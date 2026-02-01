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
import { analyzeAndRespond, generateFeedbackResponse } from '@/actions/ai'
import { parseQRRef } from '@/lib/utils'
import { canAccessFeature, checkQuota } from '@/lib/access-control'
import { execute } from '@/lib/db'
import { updateConversationState, isTerminalState } from '@/lib/state-machine'
import { isVoiceNote, transcribeAudio } from '@/lib/whisper'
import type { ConversationState } from '@/types/database'

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
        // Check Feature Access
        const hasAutoReplyAccess = canAccessFeature(establishment, 'AUTO_REPLY')

        console.log(`[Debug Flow] Source: ${source}, AI_Enabled: ${conversation.ai_enabled}, HasAccess: ${hasAutoReplyAccess}`)

        if (conversation.ai_enabled && hasAutoReplyAccess) {
            const history = (conversation.messages as any[] || [])
            history.push({ role: 'client', content: messageBody })

            // ==================================================
            // VISUAL FLOW LOGIC (Scan-to-Chat)
            // ==================================================

            // Case A: QR Scan (Anytime) -> Send Visual Welcome with Interactive Buttons
            if (source === 'QR_SCAN') {
                console.log('[Twilio Webhook] QR Scan detected - Sending Interactive Welcome')

                // FSM: Ensure state is INIT
                await updateConversationState(conversation.id, 'INIT')

                // NEW Template with Quick Reply Buttons - V2 Modern (created 2026-02-01)
                const contentSid = 'HX6cb24c095eedd46a724800defb6ccf78'

                const safeName = profileName || 'cher client'

                // Send template with variables: {{1}} = name, {{2}} = establishment
                const result = await import('@/lib/twilio').then(mod => mod.sendWhatsAppTemplate({
                    to: from.replace('whatsapp:', ''),
                    templateSid: contentSid,
                    contentVariables: {
                        '1': safeName,
                        '2': establishment.name
                    }
                }))

                console.log('[Twilio Webhook] Interactive Welcome Result:', result)

                const logMessage = `Marhba ${safeName} ! 🧡 Merci de votre visite chez ${establishment.name}. Quelle a été votre impression ? [Buttons: Top/Bien/Déçu]`

                // Save Assistant Message
                await addMessageToConversation(conversation.id, {
                    role: 'assistant',
                    content: logMessage
                })

                return new NextResponse('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })
            }

            // Case B: User Replied via Button Click (or Text)
            // Match against the button titles we defined
            const cleanBody = messageBody.trim()

            // Check for Rating Button Clicks (supports both old and new button texts)
            if (cleanBody.includes('Top !') || cleanBody.includes('Excellente') || cleanBody.includes('5/5') || cleanBody === '1') {
                // RATING 5 matches
                // USE TRACKING LINK
                // establishment.id is available from getEstablishmentByTwilioNumber call earlier? 
                // Wait, early code: const establishment = await getEstablishmentByTwilioNumber(to)

                // Trackable Link (No https:// because template has it)
                // DYNAMIC BASE URL: Use env var (ngrok in dev) or fallback to prod
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://reviewme.ma'
                // Ensure no double slash if env var has trailing slash
                const safeBaseUrl = baseUrl.replace(/\/$/, '')
                const trackingLink = `${safeBaseUrl}/go/${establishment.id}`

                // NEW TEMPLATE: Positive CTA with button (created 2026-02-01)
                // Button URL: https://reviewme.ma/go/{{2}}
                const contentSid = 'HXafbfac19a16cc2a2da65b756f7b792c7'

                const defaultPositive = "Génial ! Toute l'équipe vous remercie. 🥰\n\nUn dernier petit clic pour nous donner de la force ? 💪"
                const rawPositive = establishment.custom_message_positive || defaultPositive
                const safeName = profileName || 'cher client'

                // Variable 1 Body: Includes dynamic link (ngrok in dev, reviewme in prod) for reliable fallback
                const finalPositive = rawPositive.replace('{{name}}', safeName) + `\n\n${trackingLink}`

                // Variable 2 Button: Only ID (Template adds domain). 
                // Note: Button will always point to PROD (reviewme.ma). 
                // In dev, use the link in body.
                const buttonVariable = establishment.id

                await import('@/lib/twilio').then(mod => mod.sendWhatsAppTemplate({
                    to: from.replace('whatsapp:', ''),
                    templateSid: contentSid,
                    contentVariables: {
                        '1': finalPositive,
                        '2': buttonVariable
                    }
                }))

                // Update analysis + FSM state
                await updateConversationAnalysis(conversation.id, { sentiment: 'POSITIVE', status: 'CONVERTED', language: 'FR' })
                await updateConversationState(conversation.id, 'CONVERSION_PENDING', { sentiment: 'POSITIVE' })

                await addMessageToConversation(conversation.id, { role: 'assistant', content: '[CTA Sent] ' + finalPositive })
                return new NextResponse('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })

            } else if (cleanBody.includes('Bien') || cleanBody.includes('Correcte') || cleanBody.includes('Moyen') || cleanBody.includes('3-4') || cleanBody === '2') {
                // RATING 3-4 matches -> Ask for feedback FIRST, CTA link comes AFTER feedback received

                // 1. Send Feedback Question ONLY (no link yet)
                const responseText = establishment.custom_message_neutral || `Merci pour votre visite ! 🙏\n\nVotre avis compte vraiment pour nous. Qu'est-ce qui aurait pu rendre votre expérience encore meilleure ?`

                await import('@/lib/twilio').then(mod => mod.sendWhatsAppMessage({
                    to: from.replace('whatsapp:', ''),
                    body: responseText
                }))

                // Set FSM state to FEEDBACK_PENDING - CTA will be sent when feedback is received
                await updateConversationAnalysis(conversation.id, { sentiment: 'NEUTRAL', status: 'NEEDS_ATTENTION', language: 'FR' })
                await updateConversationState(conversation.id, 'FEEDBACK_PENDING', { sentiment: 'NEUTRAL' })

                await addMessageToConversation(conversation.id, { role: 'assistant', content: responseText })
                return new NextResponse('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })

            } else if (cleanBody.includes('Déçu') || cleanBody.includes('Décevante') || cleanBody.includes('1-2') || cleanBody === '3') {
                // RATING 1-2 matches
                const responseText = establishment.custom_message_negative || `Nous sommes navrés d'apprendre que votre expérience n'a pas été satisfaisante. Pourriez-vous nous donner plus de détails afin que nous puissions nous améliorer ?`
                await updateConversationAnalysis(conversation.id, { sentiment: 'NEGATIVE', status: 'NEEDS_ATTENTION', language: 'FR' })
                await updateConversationState(conversation.id, 'FEEDBACK_PENDING', { sentiment: 'NEGATIVE' })

                await import('@/lib/twilio').then(mod => mod.sendWhatsAppMessage({
                    to: from.replace('whatsapp:', ''),
                    body: responseText
                }))

                // ALERT ADMIN (US-5.2) - Send template with CTA button to conversation
                if (establishment.admin_phone) {
                    console.log(`[Twilio Webhook] Sending Admin Alert to ${establishment.admin_phone} for conversation ${conversation.id}`)
                    try {
                        // Admin Alert Template with button to conversation
                        const adminTemplateSid = 'HXe54f36c257e5665ed36cba9b4e59038a'
                        await import('@/lib/twilio').then(mod => mod.sendWhatsAppTemplate({
                            to: establishment.admin_phone!.replace('whatsapp:', ''),
                            templateSid: adminTemplateSid,
                            contentVariables: {
                                '1': profileName || 'Client',
                                '2': establishment.name,
                                '3': conversation.id
                            }
                        }))
                    } catch (err) {
                        console.error("[Twilio Webhook] Failed to send Admin Alert:", err)
                    }
                }

                await addMessageToConversation(conversation.id, { role: 'assistant', content: responseText })
                return new NextResponse('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })
            }

            // ==================================================
            // DEFAULT AI FLOW (Fallback)
            // ==================================================

            // FSM: Check if conversation is in FEEDBACK_PENDING and has voice/text feedback
            const currentState = conversation.current_state || 'INIT'

            // Handle FEEDBACK_PENDING: Process feedback (voice or text)
            if (currentState === 'FEEDBACK_PENDING') {
                let feedbackText = messageBody

                // Check for voice note
                if (isVoiceNote(body) && body.MediaUrl0) {
                    console.log('[Twilio Webhook] Voice note detected, transcribing...')
                    const transcription = await transcribeAudio(body.MediaUrl0)

                    if (transcription.success && transcription.text) {
                        feedbackText = transcription.text
                        console.log(`[Twilio Webhook] Transcribed: "${feedbackText.substring(0, 100)}..."`)
                    } else {
                        console.warn('[Twilio Webhook] Transcription failed:', transcription.error)
                        // Fall back to any text that might accompany the voice note
                    }
                }

                // Analyze the feedback
                const feedbackAnalysis = await analyzeAndRespond({
                    conversationHistory: [{ role: 'client', content: feedbackText }],
                    establishmentName: establishment.name,
                    googleMapsLink: ''
                })

                // Check if this was a NEUTRAL feedback (Correcte button)
                const wasNeutral = conversation.sentiment === 'NEUTRAL'

                if (wasNeutral) {
                    // 1. Generate personalized thank you using GPT
                    const aiResponse = await generateFeedbackResponse({
                        feedbackText,
                        clientName: conversation.client_name,
                        establishmentName: establishment.name,
                        sentiment: 'NEUTRAL'
                    })
                    const thankYouMessage = aiResponse.success ? aiResponse.data!.response : "Merci beaucoup pour ce retour précieux ! Nous en prenons bonne note. 🙏"

                    await sendWhatsAppMessage({
                        to: conversation.client_phone,
                        body: thankYouMessage
                    })
                    await addMessageToConversation(conversation.id, { role: 'assistant', content: thankYouMessage })

                    // 2. NOW send the CTA link (using template with button)
                    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://reviewme.ma'
                    const safeBaseUrl = baseUrl.replace(/\/$/, '')
                    const trackingLink = `${safeBaseUrl}/go/${establishment.id}`

                    const ctaMessage = "Si vous avez 30 secondes, un petit avis public serait vraiment apprécié ! 🙌"
                    const contentSid = 'HXafbfac19a16cc2a2da65b756f7b792c7' // Positive CTA template

                    await import('@/lib/twilio').then(mod => mod.sendWhatsAppTemplate({
                        to: from.replace('whatsapp:', ''),
                        templateSid: contentSid,
                        contentVariables: {
                            '1': ctaMessage,
                            '2': establishment.id
                        }
                    }))

                    // Transition to CONVERSION_PENDING (waiting for click)
                    await updateConversationState(conversation.id, 'CONVERSION_PENDING')
                    await updateConversationAnalysis(conversation.id, { status: 'CONVERTED' })

                    await addMessageToConversation(conversation.id, { role: 'assistant', content: `[CTA Sent] ${trackingLink}` })
                    return new NextResponse('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })
                }

                // NEGATIVE feedback: Generate personalized response using GPT
                const aiResponse = await generateFeedbackResponse({
                    feedbackText,
                    clientName: conversation.client_name,
                    establishmentName: establishment.name,
                    sentiment: 'NEGATIVE'
                })
                const thankYouMessage = aiResponse.success ? aiResponse.data!.response : "Merci pour votre retour détaillé. Votre message a été transmis à la direction. Nous ferons notre possible pour nous améliorer. 🙏"

                await sendWhatsAppMessage({
                    to: conversation.client_phone,
                    body: thankYouMessage
                })

                // Update state to RESOLVED
                await updateConversationState(conversation.id, 'RESOLVED')
                await updateConversationAnalysis(conversation.id, { status: 'CLOSED' })

                // Alert admin if critical
                if (feedbackAnalysis.success && feedbackAnalysis.data?.isCritical && establishment.admin_phone) {
                    const adminNumber = formatPhoneForWhatsApp(establishment.admin_phone)
                    await sendWhatsAppMessage({
                        to: adminNumber,
                        body: `🚨 Feedback critique reçu:\n"${feedbackText.substring(0, 200)}..."\n\nConversation: ${conversation.id}`
                    })
                }

                await addMessageToConversation(conversation.id, { role: 'assistant', content: thankYouMessage })
                return new NextResponse('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })
            }

            // STOP: If conversation is in terminal FSM state
            if (isTerminalState(currentState as any)) {
                console.log(`[Twilio Webhook] Conversation is in terminal state (${currentState}). Suppressing AI response.`)
                return new NextResponse('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })
            }

            // STOP: Legacy check - If conversation is already CONVERTED (Link Sent), do not reply to small talk ("ok", "merci")
            console.log(`[Twilio Webhook] AI Flow Check. Status: ${conversation.status}, FSM State: ${currentState}`)

            // STOP: If conversation is already FINAL (CONVERTED or NEEDS_ATTENTION), 
            // do not reply to subsequent messages ("ok", "merci", etc.)
            if (conversation.status === 'CONVERTED' || conversation.status === 'NEEDS_ATTENTION') {
                console.log(`[Twilio Webhook] Conversation is FINAL (${conversation.status}). Suppressing AI response.`)
                return new NextResponse('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })
            }

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
                    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
                    const dashboardLink = `${baseUrl}/dashboard?conversationId=${conversation.id}`

                    console.log(`[Critical Alert] Sending to ${adminNumber}...`)
                    // Use freeform for now, later template
                    const alertResult = await sendWhatsAppMessage({
                        to: adminNumber,
                        body: `🚨 ALERT: Critical Review from ${clientName}.\nLink: ${dashboardLink}`
                    })
                    console.log(`[Critical Alert] Result:`, alertResult)
                }

                // Send Reply via Twilio (If Quota Allows)
                if (checkQuota(establishment)) {
                    await sendWhatsAppMessage({
                        to: conversation.client_phone,
                        body: replyText
                    })

                    // Increment Quota
                    await execute(
                        `UPDATE establishments SET outbound_quota_used = outbound_quota_used + 1, updated_at = NOW() WHERE id = $1`,
                        [establishment.id]
                    )
                } else {
                    console.warn(`[Twilio Webhook] Quota exceeded for establishment ${establishment.id}`)
                    // Optional: Send a different message or notify admin?
                }

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
