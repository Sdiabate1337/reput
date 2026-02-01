// ===========================================
// Watchdog Cron - FSM Recovery System
// ===========================================
// Runs every 15 minutes to recover stuck conversations
// Deploy: Vercel Cron or external scheduler

import { NextResponse } from 'next/server'
import { query, execute } from '@/lib/db'
import { sendWhatsAppTemplate, sendWhatsAppMessage } from '@/lib/twilio'
import type { ConversationState, Establishment } from '@/types/database'

// Force dynamic execution (no caching)
export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 second timeout

// ===========================================
// Template SIDs (Update after Twilio approval)
// ===========================================
const TEMPLATES = {
    // Template A: "Oups, note oubliée ?" - For INIT state
    RELANCE_NOTE: process.env.TEMPLATE_RELANCE_NOTE || 'HX_PLACEHOLDER_NOTE',
    // Template B: "Dites-nous tout (Vocal OK)" - For FEEDBACK_PENDING
    RELANCE_DETAILS: process.env.TEMPLATE_RELANCE_DETAILS || 'HX_PLACEHOLDER_DETAILS',
    // Template C: "Soutien à l'équipe" - For CONVERSION_PENDING
    RELANCE_GOOGLE: process.env.TEMPLATE_RELANCE_GOOGLE || 'HX_PLACEHOLDER_GOOGLE'
}

// ===========================================
// Recovery Timing Configuration
// ===========================================
const RECOVERY_CONFIG = {
    INIT: {
        delayMinutes: 30,      // Wait 30 min before reminder
        graceMinutes: 5        // Extra buffer for race conditions
    },
    FEEDBACK_PENDING: {
        delayMinutes: 60,      // Wait 60 min
        graceMinutes: 5
    },
    CONVERSION_PENDING: {
        delayMinutes: 120,     // Wait 2 hours
        graceMinutes: 5
    }
}

// ===========================================
// Types
// ===========================================
interface StuckSession {
    id: string
    client_phone: string
    client_name: string | null
    current_state: ConversationState
    last_interaction_at: Date
    establishment_id: string
    establishment_name: string
    reminder_count: number
}

// ===========================================
// Main Watchdog Handler
// ===========================================
export async function GET() {
    const startTime = Date.now()
    const now = new Date()

    const stats = {
        checked: 0,
        remindedInit: 0,
        remindedFeedback: 0,
        remindedConversion: 0,
        correctedStates: 0,
        archived: 0,
        errors: 0
    }

    try {
        // 1. Find stuck sessions (within 24h, not yet reminded)
        const stuckSessions = await query<StuckSession>(`
            SELECT 
                c.id, 
                c.client_phone, 
                c.client_name, 
                c.current_state, 
                c.last_interaction_at,
                c.reminder_count,
                c.establishment_id,
                e.name as establishment_name
            FROM conversations c
            JOIN establishments e ON c.establishment_id = e.id
            WHERE 
                c.current_state IN ('INIT', 'FEEDBACK_PENDING', 'CONVERSION_PENDING')
                AND c.reminder_count = 0
                AND c.created_at > NOW() - INTERVAL '23 hours'
            ORDER BY c.last_interaction_at ASC
            LIMIT 100
        `)

        stats.checked = stuckSessions.length
        console.log(`[Watchdog] Checking ${stats.checked} stuck sessions`)

        for (const session of stuckSessions) {
            const minutesSinceInteraction =
                (now.getTime() - new Date(session.last_interaction_at).getTime()) / 1000 / 60

            try {
                // Strategy 1: Distrait (Scanned but no rating)
                if (session.current_state === 'INIT') {
                    const config = RECOVERY_CONFIG.INIT
                    if (minutesSinceInteraction >= config.delayMinutes + config.graceMinutes) {
                        await handleInitRecovery(session)
                        stats.remindedInit++
                    }
                }

                // Strategy 2: Silent Critic (Rated 1-3 but no feedback)
                else if (session.current_state === 'FEEDBACK_PENDING') {
                    const config = RECOVERY_CONFIG.FEEDBACK_PENDING
                    if (minutesSinceInteraction >= config.delayMinutes + config.graceMinutes) {
                        await handleFeedbackRecovery(session)
                        stats.remindedFeedback++
                    }
                }

                // Strategy 3: Shy Fan (Rated 4-5 but no Google click)
                else if (session.current_state === 'CONVERSION_PENDING') {
                    const config = RECOVERY_CONFIG.CONVERSION_PENDING
                    if (minutesSinceInteraction >= config.delayMinutes + config.graceMinutes) {
                        const result = await handleConversionRecovery(session)
                        if (result === 'reminded') stats.remindedConversion++
                        if (result === 'corrected') stats.correctedStates++
                    }
                }
            } catch (error) {
                console.error(`[Watchdog] Error processing session ${session.id}:`, error)
                stats.errors++
            }
        }

        // 2. Archive expired sessions (>24h old)
        const archiveResult = await execute(`
            UPDATE conversations 
            SET current_state = 'ARCHIVED'
            WHERE current_state IN ('INIT', 'FEEDBACK_PENDING', 'CONVERSION_PENDING')
            AND created_at < NOW() - INTERVAL '24 hours'
        `)
        stats.archived = archiveResult.rowCount

        const duration = Date.now() - startTime
        console.log(`[Watchdog] Completed in ${duration}ms`, stats)

        return NextResponse.json({
            status: 'ok',
            duration,
            stats
        })
    } catch (error) {
        console.error('[Watchdog] Fatal error:', error)
        return NextResponse.json(
            { status: 'error', error: String(error) },
            { status: 500 }
        )
    }
}

// ===========================================
// Recovery Handlers
// ===========================================

async function handleInitRecovery(session: StuckSession): Promise<void> {
    // Atomic increment with optimistic locking
    const lockResult = await execute(
        `UPDATE conversations 
         SET reminder_count = reminder_count + 1, 
             reminder_last_sent_at = NOW()
         WHERE id = $1 AND reminder_count = 0
         RETURNING id`,
        [session.id]
    )

    if (lockResult.rowCount === 0) {
        console.log(`[Watchdog] Session ${session.id} already reminded, skipping`)
        return
    }

    try {
        // Check if we have a real template or placeholder
        if (TEMPLATES.RELANCE_NOTE.startsWith('HX_PLACEHOLDER')) {
            // Use freeform message as fallback
            await sendWhatsAppMessage({
                to: session.client_phone,
                body: `Salam ${session.client_name || ''} 👋\n\nOn espère que vous avez passé un bon moment chez ${session.establishment_name} !\n\nVotre avis compte vraiment pour nous. Comment était votre expérience ?`
            })
        } else {
            await sendWhatsAppTemplate({
                to: session.client_phone,
                templateSid: TEMPLATES.RELANCE_NOTE,
                contentVariables: {
                    '1': session.client_name || 'cher client'
                }
            })
        }
        console.log(`[Watchdog] Sent INIT reminder to ${session.client_phone}`)
    } catch (error: any) {
        await handleSendError(session.id, error)
    }
}

async function handleFeedbackRecovery(session: StuckSession): Promise<void> {
    const lockResult = await execute(
        `UPDATE conversations 
         SET reminder_count = reminder_count + 1, 
             reminder_last_sent_at = NOW()
         WHERE id = $1 AND reminder_count = 0
         RETURNING id`,
        [session.id]
    )

    if (lockResult.rowCount === 0) return

    try {
        if (TEMPLATES.RELANCE_DETAILS.startsWith('HX_PLACEHOLDER')) {
            await sendWhatsAppMessage({
                to: session.client_phone,
                body: `Re-bonjour ${session.client_name || ''} 🙏\n\nVotre retour est précieux pour nous aider à nous améliorer. Qu'est-ce qui aurait pu rendre votre visite meilleure ?\n\n💡 Vous pouvez répondre par note vocale si c'est plus simple !`
            })
        } else {
            await sendWhatsAppTemplate({
                to: session.client_phone,
                templateSid: TEMPLATES.RELANCE_DETAILS,
                contentVariables: {
                    '1': session.client_name || 'cher client'
                }
            })
        }
        console.log(`[Watchdog] Sent FEEDBACK reminder to ${session.client_phone}`)
    } catch (error: any) {
        await handleSendError(session.id, error)
    }
}

async function handleConversionRecovery(
    session: StuckSession
): Promise<'reminded' | 'corrected' | 'skipped'> {
    // First, check if they actually clicked the Google link
    const clicks = await query(
        `SELECT 1 FROM redirect_events WHERE conversation_id = $1 LIMIT 1`,
        [session.id]
    )

    if (clicks.length > 0) {
        // They clicked! Update state to COMPLETED (we missed the update somehow)
        await execute(
            `UPDATE conversations SET current_state = 'COMPLETED' WHERE id = $1`,
            [session.id]
        )
        console.log(`[Watchdog] Corrected state for ${session.id} -> COMPLETED`)
        return 'corrected'
    }

    // They haven't clicked, send a soft reminder
    const lockResult = await execute(
        `UPDATE conversations 
         SET reminder_count = reminder_count + 1, 
             reminder_last_sent_at = NOW()
         WHERE id = $1 AND reminder_count = 0
         RETURNING id`,
        [session.id]
    )

    if (lockResult.rowCount === 0) return 'skipped'

    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://reviewme.ma'
        const trackingLink = `${baseUrl.replace(/\/$/, '')}/go/${session.establishment_id}`

        if (TEMPLATES.RELANCE_GOOGLE.startsWith('HX_PLACEHOLDER')) {
            await sendWhatsAppMessage({
                to: session.client_phone,
                body: `Merci encore ${session.client_name || ''} pour votre gentillesse ! 🧡\n\nSi vous avez 30 secondes, un avis public nous aiderait beaucoup à continuer à bien servir nos clients.\n\n${trackingLink}`
            })
        } else {
            await sendWhatsAppTemplate({
                to: session.client_phone,
                templateSid: TEMPLATES.RELANCE_GOOGLE,
                contentVariables: {
                    '1': session.client_name || 'cher client',
                    '2': session.establishment_id
                }
            })
        }
        console.log(`[Watchdog] Sent CONVERSION reminder to ${session.client_phone}`)
        return 'reminded'
    } catch (error: any) {
        await handleSendError(session.id, error)
        return 'skipped'
    }
}

// Handle Twilio send errors (e.g., unsubscribed users)
async function handleSendError(conversationId: string, error: any): Promise<void> {
    console.error(`[Watchdog] Send error for ${conversationId}:`, error)

    // Twilio error 21610 = User has unsubscribed
    if (error.code === 21610 || error.code === 21614) {
        await execute(
            `UPDATE conversations SET current_state = 'ARCHIVED' WHERE id = $1`,
            [conversationId]
        )
        console.log(`[Watchdog] Archived unsubscribed conversation ${conversationId}`)
    }
}
