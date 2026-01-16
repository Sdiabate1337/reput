import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// ===========================================
// Parse QR Ref from incoming message
// ===========================================

export function parseQRRef(messageBody: string): {
    establishmentRef: string | null
    customRef: string | null
} {
    // Flexible matching for:
    // 1. "Avis abc12345" (Legacy)
    // 2. "Bonjour... (Ref: abc12345)" (New Human Format)
    // 3. "Ref: abc12345" (Fallback)

    // Regex looks for "Avis" OR "Ref:" followed optionally by space, then the ID (hex)
    // It captures the ID in group 1
    const match = messageBody.match(/(?:Avis|Ref:?)\s*([a-f0-9]+)/i)

    if (!match) {
        return { establishmentRef: null, customRef: null }
    }

    // Check if there's text AFTER the ID for customRef (e.g. Table Number)
    // We need to re-parse specifically for that if needed, 
    // but for now let's grab the ID and everything after it.

    const establishmentRef = match[1]

    // Extract everything after the ID as potential custom ref
    // This is a bit loose but works for "Avis ID Table3"
    const remaining = messageBody.split(establishmentRef)[1]?.trim() || null

    return {
        establishmentRef,
        customRef: remaining,
    }
}

// ===========================================
// Smart Date Formatter (WhatsApp Style)
// ===========================================
export function formatSmartDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const oneDay = 24 * 60 * 60 * 1000
    const oneWeek = 7 * oneDay

    // Check if it's today
    if (date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }

    // Check if it's yesterday
    const yesterday = new Date(now.getTime() - oneDay)
    if (date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear()) {
        return 'Hier'
    }

    // Check if it's within the last week
    if (diff < oneWeek) {
        return date.toLocaleDateString('fr-FR', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase())
    }

    // Older
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
