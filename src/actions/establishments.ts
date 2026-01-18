'use server'

import { queryOne, execute } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { Establishment, ActionResult } from '@/types/database'

// ===========================================
// Helpers
// ===========================================

async function getAuthenticatedUserId(): Promise<string> {
    const session = await getSession()
    if (!session) {
        throw new Error('Non authentifié')
    }
    return session.userId
}

// ===========================================
// US-1.1: Create/Update Establishment
// ===========================================

export async function createEstablishment(
    data: {
        name: string
        googleMapsLink?: string
        adminPhone?: string
    }
): Promise<ActionResult<{ id: string }>> {
    try {
        const userId = await getAuthenticatedUserId()

        // Check if user already has an establishment
        const existing = await queryOne<{ id: string }>(
            'SELECT id FROM establishments WHERE user_id = $1',
            [userId]
        )

        if (existing) {
            // Update existing
            await execute(
                `UPDATE establishments 
         SET name = $1, google_maps_link = $2, admin_phone = $3, updated_at = NOW()
         WHERE id = $4`,
                [data.name, data.googleMapsLink || null, data.adminPhone || null, existing.id]
            )
            return { success: true, data: { id: existing.id } }
        }

        // Create new
        const result = await queryOne<{ id: string }>(
            `INSERT INTO establishments (user_id, name, google_maps_link, admin_phone, plan, subscription_status, trial_ends_at, outbound_quota_limit)
       VALUES ($1, $2, $3, $4, 'pro', 'TRIAL', NOW() + INTERVAL '14 days', 500)
       RETURNING id`,
            [userId, data.name, data.googleMapsLink || null, data.adminPhone || null]
        )

        if (!result) {
            return { success: false, error: 'Erreur lors de la création' }
        }

        return { success: true, data: { id: result.id } }
    } catch (error) {
        console.error('createEstablishment error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// US-1.2: Validate Review Link (Google, TripAdvisor, Booking)
// ===========================================

export async function validateGoogleMapsLink(link: string): Promise<ActionResult<{
    valid: boolean
    normalizedLink: string | null
}>> {
    try {
        // Accepted patterns (Google, TripAdvisor, Booking)
        const patterns = [
            // Google
            /^https?:\/\/(www\.)?google\.[a-z]+\/maps/i,
            /^https?:\/\/maps\.google\.[a-z]+/i,
            /^https?:\/\/goo\.gl\/maps\//i,
            /^https?:\/\/g\.page\//i,
            /^https?:\/\/maps\.app\.goo\.gl\//i,
            // TripAdvisor
            /^https?:\/\/(www\.)?tripadvisor\./i,
            // Booking
            /^https?:\/\/(www\.)?booking\.com/i,
        ]

        const isValid = patterns.some(pattern => pattern.test(link.trim()))

        return {
            success: true,
            data: {
                valid: isValid,
                normalizedLink: isValid ? link.trim() : null,
            }
        }
    } catch (error) {
        return { success: false, error: 'Erreur de validation' }
    }
}

// ===========================================
// US-1.3: Save Twilio Number
// ===========================================

export async function saveTwilioNumber(
    twilioNumber: string
): Promise<ActionResult> {
    try {
        const userId = await getAuthenticatedUserId()

        const { rowCount } = await execute(
            `UPDATE establishments SET twilio_number = $1, updated_at = NOW() WHERE user_id = $2`,
            [twilioNumber, userId]
        )

        if (rowCount === 0) {
            return { success: false, error: 'Établissement non trouvé' }
        }

        return { success: true }
    } catch (error) {
        console.error('saveTwilioNumber error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// Get Establishment by User ID
// ===========================================

export async function getEstablishmentByUserId(
    // Optional userId override, otherwise uses session
    targetUserId?: string
): Promise<ActionResult<Establishment>> {
    try {
        let userId = targetUserId
        if (!userId) {
            const session = await getSession()
            if (session) userId = session.userId
        }

        if (!userId) {
            return { success: false, error: 'Non authentifié' }
        }

        const establishment = await queryOne<Establishment>(
            'SELECT * FROM establishments WHERE user_id = $1',
            [userId]
        )

        if (!establishment) {
            return { success: false, error: 'Aucun établissement trouvé' }
        }

        return { success: true, data: establishment }
    } catch (error) {
        console.error('getEstablishmentByUserId error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// Get Establishment by ID
// ===========================================

export async function getEstablishmentById(
    id: string
): Promise<ActionResult<Establishment>> {
    try {
        // Authenticate request
        await getAuthenticatedUserId()

        const establishment = await queryOne<Establishment>(
            'SELECT * FROM establishments WHERE id = $1',
            [id]
        )

        if (!establishment) {
            return { success: false, error: 'Établissement non trouvé' }
        }

        return { success: true, data: establishment }
    } catch (error) {
        console.error('getEstablishmentById error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// Get Establishment by Twilio Number
// ===========================================

export async function getEstablishmentByTwilioNumber(
    twilioNumber: string
): Promise<ActionResult<Establishment>> {
    try {
        const establishment = await queryOne<Establishment>(
            'SELECT * FROM establishments WHERE twilio_number = $1',
            [twilioNumber]
        )

        if (!establishment) {
            // FALLBACK FOR SANDBOX MVP:
            // If we receive a message on the Sandbox number but no establishment is explicitly linked,
            // assume it's for the most recently active establishment (Single Tenant Dev Mode).
            if (twilioNumber.includes('14155238886')) {
                const fallback = await queryOne<Establishment>(
                    'SELECT * FROM establishments ORDER BY updated_at DESC LIMIT 1'
                )
                if (fallback) {
                    return { success: true, data: fallback }
                }
            }
            return { success: false, error: 'Établissement non trouvé' }
        }

        return { success: true, data: establishment }
    } catch (error) {
        console.error('getEstablishmentByTwilioNumber error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// Update Establishment
// ===========================================

export async function updateEstablishment(
    id: string,
    updates: Partial<Pick<Establishment, 'name' | 'google_maps_link' | 'google_place_id' | 'admin_phone'>> & {
        custom_message_neutral?: string
        custom_message_negative?: string
        custom_message_welcome?: string
        custom_message_positive?: string
        custom_message_request?: string
    }
): Promise<ActionResult> {
    try {
        const userId = await getAuthenticatedUserId()
        // ... (Verification)
        // ...

        const setClauses: string[] = []
        const values: any[] = []
        let paramIndex = 1

        if (updates.name) {
            setClauses.push(`name = $${paramIndex++}`)
            values.push(updates.name)
        }
        if (updates.google_maps_link) {
            setClauses.push(`google_maps_link = $${paramIndex++}`)
            values.push(updates.google_maps_link)
        }
        if (updates.google_place_id) {
            setClauses.push(`google_place_id = $${paramIndex++}`)
            values.push(updates.google_place_id)
        }
        if (updates.admin_phone) {
            setClauses.push(`admin_phone = $${paramIndex++}`)
            values.push(updates.admin_phone)
        }
        // Custom Messages
        if (updates.custom_message_neutral !== undefined) {
            setClauses.push(`custom_message_neutral = $${paramIndex++}`)
            values.push(updates.custom_message_neutral)
        }
        if (updates.custom_message_negative !== undefined) {
            setClauses.push(`custom_message_negative = $${paramIndex++}`)
            values.push(updates.custom_message_negative)
        }
        if (updates.custom_message_welcome !== undefined) {
            setClauses.push(`custom_message_welcome = $${paramIndex++}`)
            values.push(updates.custom_message_welcome)
        }
        if (updates.custom_message_positive !== undefined) {
            setClauses.push(`custom_message_positive = $${paramIndex++}`)
            values.push(updates.custom_message_positive)
        }
        if (updates.custom_message_request !== undefined) {
            setClauses.push(`custom_message_request = $${paramIndex++}`)
            values.push(updates.custom_message_request)
        }

        if (setClauses.length === 0) {
            return { success: true }
        }

        setClauses.push(`updated_at = NOW()`)
        values.push(id)

        await execute(
            `UPDATE establishments SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`,
            values
        )

        return { success: true }
    } catch (error) {
        console.error('updateEstablishment error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// Get Webhook URL
// ===========================================

export async function getWebhookUrl(): Promise<ActionResult<{ url: string }>> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return {
        success: true,
        data: { url: `${baseUrl}/api/webhooks/twilio` }
    }
}
