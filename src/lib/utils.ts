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
