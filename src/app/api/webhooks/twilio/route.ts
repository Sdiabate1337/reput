import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import {
    validateTwilioSignature,
    extractPhoneFromWhatsApp,
    sendWhatsAppMessage,
    formatPhoneForWhatsApp
} from '@/lib/twilio'
import {
    getEstablishmentByTwilioNumber
} from '@/actions/establishments'
import {
    getOrCreateConversation,
    addMessageToConversation,
    updateConversationAnalysis
} from '@/actions/conversations'
import { analyzeAndRespond } from '@/actions/ai'
import { parseQRRef } from '@/lib/utils'

// Force dynamic to ensure headers are read correctly
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const text = await request.text()
        const params = new URLSearchParams(text)
        const body: Record<string, string> = {}
        params.forEach((value, key) => {
            body[key] = value
        })

        // 1. Validation (Skip in Dev/Neon if needed, but good to have)
        const requestUrl = request.url
        const signature = (await headers()).get('x-twilio-signature') || ''

        // TODO: Enable strict validation in production
        // const isValid = validateTwilioSignature(signature, requestUrl, body)
        // if (!isValid) {
        //   return new NextResponse('Unauthorized', { status: 401 })
        // }

        // 2. Extract Info
        const from = body.From // "whatsapp:+212..."
        const to = body.To // "whatsapp:+1..."
        const messageBody = body.Body || ''
        const profileName = body.ProfileName || '' // Twilio sends this

        console.log(`[Twilio Webhook] Received message from ${from} (${profileName}) to ${to}: ${messageBody}`)

        if (!from || !to) {
            return new NextResponse('Missing From or To', { status: 400 })
        }

        // 3. Identify Establishment
        const establishmentResult = await getEstablishmentByTwilioNumber(to)
        if (!establishmentResult.success || !establishmentResult.data) {
            console.error(`[Twilio Webhook] No establishment found for ${to}`)
            // Return 200 to stop Twilio retries
            return new NextResponse('Establishment not found', { status: 200 })
        }
        const establishment = establishmentResult.data

        // 4. Parse QR Ref (if any)
        const { establishmentRef, customRef } = parseQRRef(messageBody)
        const source = establishmentRef ? 'QR_SCAN' : 'MANUAL_SEND'

        // 5. Get/Create Conversation
        const conversationResult = await getOrCreateConversation({
            establishmentId: establishment.id,
            clientPhone: extractPhoneFromWhatsApp(from),
            clientName: profileName, // Pass the name here
            source,
            qrRef: customRef || undefined
        })

        if (!conversationResult.success || !conversationResult.data) {
            console.error('[Twilio Webhook] Failed to create conversation')
            return new NextResponse('Conversation error', { status: 200 })
        }
        const conversation = conversationResult.data

        // 6. Save Client Message
        await addMessageToConversation(conversation.id, {
            role: 'client',
            content: messageBody
        })

        // 7. AI Pipeline
        if (conversation.ai_enabled) {
            // Get history (current message is already added so we could query it, 
            // but for efficiency we can just construct payload)
            const history = (conversation.messages as any[] || [])
            // Add the new message to history for context (since we just saved it but didn't re-fetch)
            history.push({ role: 'client', content: messageBody })

            // Analyze & Respond
            const aiResult = await analyzeAndRespond({
                conversationHistory: history,
                establishmentName: establishment.name,
                googleMapsLink: establishment.google_maps_link || ''
            })

            if (aiResult.success && aiResult.data) {
                const { replyText, sentiment, language, isCritical } = aiResult.data

                // Update Conversation Analysis
                await updateConversationAnalysis(conversation.id, {
                    sentiment,
                    language,
                    status: isCritical ? 'NEEDS_ATTENTION' : 'OPEN'
                })

                // Flow 3: Critical Alert to Admin
                console.log(`[Critical Check] isCritical=${isCritical}, admin_phone=${establishment.admin_phone}`)

                if (isCritical && establishment.admin_phone) {
                    const adminNumber = formatPhoneForWhatsApp(establishment.admin_phone)
                    const clientName = conversation.client_name || from
                    // Construct deep link (assuming app is at APP_URL)
                    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
                    const dashboardLink = `${baseUrl}/dashboard?conversationId=${conversation.id}`

                    console.log(`[Critical Alert] Sending to ${adminNumber}...`)

                    const alertResult = await sendWhatsAppMessage({
                        to: adminNumber,
                        body: `🚨 ALERT: Critical Review from ${clientName}.\nLink: ${dashboardLink}`
                    })
                    console.log(`[Critical Alert] Result:`, alertResult)
                }

                // Send Reply via Twilio
                await sendWhatsAppMessage({
                    to: conversation.client_phone,
                    body: replyText
                })

                // Save Assistant Message
                await addMessageToConversation(conversation.id, {
                    role: 'assistant',
                    content: replyText
                })
            }
        }

        return new NextResponse('<Response></Response>', {
            headers: { 'Content-Type': 'text/xml' }
        })

    } catch (error) {
        console.error('[Twilio Webhook] Error:', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
