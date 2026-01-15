'use server'

import { queryOne, execute, transaction } from '@/lib/db'
import { getEstablishmentByUserId } from '@/actions/establishments'
import { sendWhatsAppTemplate, formatPhoneForWhatsApp, sendWhatsAppMessage } from '@/lib/twilio'
import type { ActionResult, Establishment } from '@/types/database'
import { checkQuota } from '@/lib/access-control'

// ===========================================
// Send Manual Review Request (Manual Relance)
// ===========================================

export async function sendReviewRequest(params: {
    clientName: string
    clientPhone: string
}): Promise<ActionResult> {
    try {
        // 1. Get Establishment & Check Quota
        const estResult = await getEstablishmentByUserId()
        if (!estResult.success || !estResult.data) {
            return { success: false, error: 'Établissement non trouvé' }
        }

        const establishment = estResult.data

        if (!checkQuota(establishment)) {
            return { success: false, error: 'Quota de messages atteint pour ce mois. Passez en Pro.' }
        }

        // 2. Format Phone
        const formattedPhone = formatPhoneForWhatsApp(params.clientPhone)

        // 3. Send Message via Twilio
        // NOTE: For MVP Sandbox, we can use free-form messages if the user has joined the sandbox.
        // In Prod, we MUST use a Template.
        // We will simulate a Template send here using sendWhatsAppMessage for Sandbox convenience,
        // unless we have a specific template SID.

        // TEMPLATE STRATEGY FOR MVP:
        // Use a simple text message that looks like a template.
        // "Bonjour [Name], merci de votre visite chez [Establishment]. Un avis ? [Link]"
        // But since we can't initiate free-form without user prior approval in Prod...
        // We'll stick to the "Correct" way: Templates.
        // HOWEVER: Twilio Sandbox allows free-form to sandbox participants.

        const messageBody = `Bonjour ${params.clientName}, merci de votre visite chez ${establishment.name}. Tout s'est bien passé ?`

        const twilioResult = await sendWhatsAppMessage({
            to: formattedPhone,
            body: messageBody
        })

        if (!twilioResult.success) {
            return { success: false, error: twilioResult.error || 'Erreur Twilio' }
        }

        // 4. Update Quota & Log Message
        await transaction(async (client) => {
            // Increment quota
            await client.query(
                `UPDATE establishments 
         SET outbound_quota_used = outbound_quota_used + 1 
         WHERE id = $1`,
                [establishment.id]
            )

            // Log outbound message
            await client.query(
                `INSERT INTO outbound_messages 
         (establishment_id, phone, template_type, status, twilio_sid)
         VALUES ($1, $2, 'REVIEW_REQUEST', 'SENT', $3)`,
                [establishment.id, formattedPhone, twilioResult.messageSid]
            )

            // Log analytics event
            await client.query(
                `INSERT INTO events (establishment_id, type, payload)
         VALUES ($1, 'MESSAGE_OUT', $2)`,
                [establishment.id, JSON.stringify({ phone: formattedPhone, type: 'REVIEW_REQUEST' })]
            )
        })

        return { success: true }

    } catch (error) {
        console.error('sendReviewRequest error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}
