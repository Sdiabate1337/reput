"use server"

import { execute, queryOne } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { ActionResult } from '@/types/database'

// ===========================================
// Request Connection
// ===========================================

export async function requestWhatsAppConnection(
    establishmentId: string,
    phoneNumber: string
): Promise<ActionResult> {
    try {
        const session = await getSession()
        if (!session) return { success: false, error: "Non authentifié" }

        // Sanitize phone number (basic)
        const cleanPhone = phoneNumber.replace(/\s/g, '').replace(/^\+/, '')
        // Verify prefix? For checks, allow any for now.

        // Update DB
        const result = await execute(
            `UPDATE establishments 
             SET whatsapp_onboarding_status = 'REQUESTED', 
                 twilio_number = $1, 
                 updated_at = NOW() 
             WHERE id = $2 AND user_id = $3`,
            [`+${cleanPhone}`, establishmentId, session.userId]
        )

        // ALERT ADMIN (Mocked)
        console.log(`[ADMIN ALERT] New WhatsApp Request from Est ${establishmentId}: +${cleanPhone}`)
        // In real life: sendEmailToAdmin(...) or sendWhatsAppToAdmin(...)

        // Ideally, we would add the num to Twilio API here, but for "Concierge", we do it manually.

        if (result.rowCount === 0) return { success: false, error: "Erreur mise à jour" }

        return { success: true }
    } catch (e: any) {
        console.error("requestWhatsAppConnection error", e)
        return { success: false, error: e.message || "Erreur serveur" }
    }
}

// ===========================================
// Submit Code
// ===========================================

export async function submitWhatsAppCode(
    establishmentId: string,
    code: string
): Promise<ActionResult> {
    try {
        const session = await getSession()
        if (!session) return { success: false, error: "Non authentifié" }

        // Update DB status to CODE_SENT (Wait, code submitted means status 'ACTIVE' if we auto-verify? 
        // Or specific 'CODE_SUBMITTED' status? 
        // User flow says: User gives code -> Admin puts it in Twilio.
        // So status should act as "Code Received, Waiting Final Confirmation".
        // Let's call it 'CODE_SENT' in DB but maybe 'VERIFYING' in UI logic.
        // Actually, if Twilio validates instantly, we are good.
        // But for Concierge, the admin needs the code.

        // Let's store the code in a temp log (or just console log for admin retrieval in MVP)
        console.log(`[ADMIN ALERT] Verification Code for Est ${establishmentId}: ${code}`)

        // Update status to 'VERIFYING'. The admin must confirm manually.
        console.log(`[ADMIN ACTION REQUIRED] Verification Code for Est ${establishmentId}: ${code}. Verify in Twilio and set status to ACTIVE.`)

        await execute(
            `UPDATE establishments 
             SET whatsapp_onboarding_status = 'VERIFYING', 
                 updated_at = NOW() 
             WHERE id = $1 AND user_id = $2`,
            [establishmentId, session.userId]
        )

        return { success: true }
    } catch (e) {
        console.error("submitWhatsAppCode error", e)
        return { success: false, error: "Erreur serveur" }
    }
}
