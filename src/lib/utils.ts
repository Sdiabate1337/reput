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
