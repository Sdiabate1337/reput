'use server'

import QRCode from 'qrcode'
import { queryOne } from '@/lib/db'
import type { ActionResult, Establishment } from '@/types/database'

// ===========================================
// US-1.4: Generate QR Code
// ===========================================

export async function generateQRCode(
    userId: string
): Promise<ActionResult<{
    qrDataUrl: string
    waLink: string
    downloadUrl: string
}>> {
    try {
        // Get establishment for user
        const establishment = await queryOne<Establishment>(
            'SELECT id, twilio_number, name FROM establishments WHERE user_id = $1',
            [userId]
        )

        if (!establishment) {
            return { success: false, error: 'Aucun établissement trouvé' }
        }

        if (!establishment.twilio_number) {
            return { success: false, error: 'Numéro WhatsApp non configuré' }
        }

        // Build WhatsApp link
        // Format: wa.me/1234567890?text=Avis%20[establishment_id]
        const phoneNumber = establishment.twilio_number
            .replace('whatsapp:', '')
            .replace('+', '')

        const prefilledText = encodeURIComponent(`Avis ${establishment.id.slice(0, 8)}`)
        const waLink = `https://wa.me/${phoneNumber}?text=${prefilledText}`

        // Generate QR Code as Data URL
        const qrDataUrl = await QRCode.toDataURL(waLink, {
            width: 512,
            margin: 2,
            color: {
                dark: '#E85C33', // Platform orange
                light: '#FFFFFF',
            },
            errorCorrectionLevel: 'H', // High error correction for logo overlay
        })

        return {
            success: true,
            data: {
                qrDataUrl,
                waLink,
                downloadUrl: qrDataUrl,
            }
        }
    } catch (error) {
        console.error('generateQRCode error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// Generate QR Code by Establishment ID
// ===========================================

export async function generateQRCodeByEstablishmentId(
    establishmentId: string
): Promise<ActionResult<{
    qrDataUrl: string
    waLink: string
}>> {
    try {
        const establishment = await queryOne<Establishment>(
            'SELECT id, twilio_number FROM establishments WHERE id = $1',
            [establishmentId]
        )

        if (!establishment) {
            return { success: false, error: 'Établissement non trouvé' }
        }

        if (!establishment.twilio_number) {
            return { success: false, error: 'Numéro WhatsApp non configuré' }
        }

        const phoneNumber = establishment.twilio_number
            .replace('whatsapp:', '')
            .replace('+', '')

        const prefilledText = encodeURIComponent(`Avis ${establishment.id.slice(0, 8)}`)
        const waLink = `https://wa.me/${phoneNumber}?text=${prefilledText}`

        const qrDataUrl = await QRCode.toDataURL(waLink, {
            width: 512,
            margin: 2,
            color: {
                dark: '#E85C33',
                light: '#FFFFFF',
            },
            errorCorrectionLevel: 'H',
        })

        return {
            success: true,
            data: { qrDataUrl, waLink }
        }
    } catch (error) {
        console.error('generateQRCodeByEstablishmentId error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// Generate QR Code with Custom Ref (Table Number etc.)
// ===========================================

export async function generateQRCodeWithRef(
    userId: string,
    ref: string
): Promise<ActionResult<{
    qrDataUrl: string
    waLink: string
}>> {
    try {
        const establishment = await queryOne<Establishment>(
            'SELECT id, twilio_number FROM establishments WHERE user_id = $1',
            [userId]
        )

        if (!establishment) {
            return { success: false, error: 'Aucun établissement trouvé' }
        }

        if (!establishment.twilio_number) {
            return { success: false, error: 'Numéro WhatsApp non configuré' }
        }

        const phoneNumber = establishment.twilio_number
            .replace('whatsapp:', '')
            .replace('+', '')

        // Include custom ref in the prefilled message
        const prefilledText = encodeURIComponent(`Avis ${establishment.id.slice(0, 8)} ${ref}`)
        const waLink = `https://wa.me/${phoneNumber}?text=${prefilledText}`

        const qrDataUrl = await QRCode.toDataURL(waLink, {
            width: 512,
            margin: 2,
            color: {
                dark: '#E85C33',
                light: '#FFFFFF',
            },
            errorCorrectionLevel: 'H',
        })

        return {
            success: true,
            data: { qrDataUrl, waLink }
        }
    } catch (error) {
        console.error('generateQRCodeWithRef error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// Parse QR Ref from incoming message
// ===========================================

export function parseQRRef(messageBody: string): {
    establishmentRef: string | null
    customRef: string | null
} {
    // Expected format: "Avis abc12345 Table3" or just "Avis abc12345"
    const match = messageBody.match(/^Avis\s+([a-f0-9]+)\s*(.*)$/i)

    if (!match) {
        return { establishmentRef: null, customRef: null }
    }

    return {
        establishmentRef: match[1],
        customRef: match[2]?.trim() || null,
    }
}
