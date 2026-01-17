'use server'

import { queryOne, execute, transaction } from '@/lib/db'
import { getEstablishmentByUserId } from '@/actions/establishments'
import { sendWhatsAppTemplate, formatPhoneForWhatsApp, sendWhatsAppMessage } from '@/lib/twilio'
import type { ActionResult, Establishment } from '@/types/database'
import { checkQuota } from '@/lib/access-control'
import { getOrCreateConversation } from '@/actions/conversations'

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

        // 2.5 Ensure Conversation Exists with the Correct Name
        // This ensures that when the client replies, we know who they are (used for Admin Alerts)
        await getOrCreateConversation({
            establishmentId: establishment.id,
            clientPhone: formattedPhone,
            clientName: params.clientName, // Store the manual name!
            source: 'MANUAL_SEND'
        })

        // 3. Send Message via Twilio
        // TEMPLATE STRATEGY FOR MVP:
        // Use the Interactive Template (Buttons) created via API.
        // SID: HX2e9d29527925e8e58e64ae24981ce8c6
        // Variables: 1: ClientName, 2: EstablishmentName

        const twilioResult = await sendWhatsAppTemplate({
            to: formattedPhone,
            templateSid: 'HX2e9d29527925e8e58e64ae24981ce8c6',
            contentVariables: {
                '1': params.clientName,
                '2': establishment.name
            }
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
