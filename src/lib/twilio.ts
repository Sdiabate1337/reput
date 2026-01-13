import Twilio from 'twilio'

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER!

// Create client singleton
let twilioClient: Twilio.Twilio | null = null

export function getTwilioClient(): Twilio.Twilio {
    if (!twilioClient) {
        if (!accountSid || !authToken) {
            throw new Error('Twilio credentials not configured')
        }
        twilioClient = Twilio(accountSid, authToken)
    }
    return twilioClient
}

// ===========================================
// WhatsApp Message Functions
// ===========================================

export interface SendMessageParams {
    to: string // Phone number with country code (e.g., +212600000000)
    body: string
}

export interface SendTemplateParams {
    to: string
    templateSid: string
    contentVariables?: Record<string, string>
}

/**
 * Send a free-form WhatsApp message (only works within 24h session window)
 */
export async function sendWhatsAppMessage(params: SendMessageParams): Promise<{
    success: boolean
    messageSid?: string
    error?: string
}> {
    try {
        const client = getTwilioClient()

        // Remove spaces from env var just in case
        const cleanTwilioNumber = twilioNumber.trim()
        const from = cleanTwilioNumber.startsWith('whatsapp:') ? cleanTwilioNumber : `whatsapp:${cleanTwilioNumber}`
        const to = `whatsapp:${params.to}`

        console.log(`[Twilio] Sending from ${from} to ${to}`)

        const message = await client.messages.create({
            from,
            to,
            body: params.body,
        })

        return {
            success: true,
            messageSid: message.sid,
        }
    } catch (error) {
        console.error('Twilio sendWhatsAppMessage error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

/**
 * Send a template message (Business-Initiated, requires pre-approved template)
 */
export async function sendWhatsAppTemplate(params: SendTemplateParams): Promise<{
    success: boolean
    messageSid?: string
    error?: string
}> {
    try {
        const client = getTwilioClient()

        const message = await client.messages.create({
            from: twilioNumber.startsWith('whatsapp:') ? twilioNumber : `whatsapp:${twilioNumber}`,
            to: `whatsapp:${params.to}`,
            contentSid: params.templateSid,
            contentVariables: params.contentVariables
                ? JSON.stringify(params.contentVariables)
                : undefined,
        })

        return {
            success: true,
            messageSid: message.sid,
        }
    } catch (error) {
        console.error('Twilio sendWhatsAppTemplate error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

/**
 * Validate Twilio webhook signature (for security)
 */
export function validateTwilioSignature(
    signature: string,
    url: string,
    params: Record<string, string>
): boolean {
    const client = getTwilioClient()
    return Twilio.validateRequest(authToken, signature, url, params)
}

/**
 * Format phone number for WhatsApp
 */
export function formatPhoneForWhatsApp(phone: string): string {
    // Remove any existing whatsapp: prefix
    let cleaned = phone.replace(/^whatsapp:/i, '')

    // Remove spaces, dashes, parentheses
    cleaned = cleaned.replace(/[\s\-\(\)]/g, '')

    // Ensure it starts with +
    if (!cleaned.startsWith('+')) {
        // Assume Morocco if no country code
        if (cleaned.startsWith('0')) {
            cleaned = '+212' + cleaned.slice(1)
        } else {
            cleaned = '+' + cleaned
        }
    }

    return cleaned
}

/**
 * Extract phone number from Twilio WhatsApp format
 */
export function extractPhoneFromWhatsApp(twilioPhone: string): string {
    return twilioPhone.replace(/^whatsapp:/i, '')
}
