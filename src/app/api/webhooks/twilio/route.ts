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
import { canAccessFeature, checkQuota } from '@/lib/access-control'
import { execute } from '@/lib/db'

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

            // Case A: QR Scan (Anytime) -> Send Visual Welcome (Interactive Buttons)
            if (source === 'QR_SCAN') {
                console.log('[Twilio Webhook] QR Scan detected - Sending Visual Welcome (Interactive)')

                // Dynamic Welcome Template (Text Only support in body)
                const contentSid = 'HX95c32af4619c2900260e9f8e714ab20f'

                // Defaults if not customized
                const defaultWelcome = `Marhba {{name}} ! 🧡\nMerci de votre visite chez ${establishment.name}.\n\nQuelle a été votre impression ?`
                const rawMessage = establishment.custom_message_welcome || defaultWelcome

                // Replace {{name}} with profileName or "cher client"
                const safeName = profileName || 'cher client'
                const finalMessage = rawMessage.replace('{{name}}', safeName)

                const result = await import('@/lib/twilio').then(mod => mod.sendWhatsAppTemplate({
                    to: from.replace('whatsapp:', ''),
                    templateSid: contentSid,
                    contentVariables: {
                        '1': finalMessage
                    }
                }))

                console.log('[Twilio Webhook] Interactive Welcome Result:', result)

                // Save Assistant Message
                await addMessageToConversation(conversation.id, {
                    role: 'assistant',
                    content: '[Interactive Welcome Sent] ' + finalMessage
                })

                return new NextResponse('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })
            }

            // Case B: User Replied via Button Click (or Text)
            // Match against the button titles we defined
            const cleanBody = messageBody.trim()

            // Check for Rating Button Clicks
            if (cleanBody.includes('Top !') || cleanBody.includes('5/5') || cleanBody === '1') {
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

                // NEW TEMPLATE (Created via Content API script)
                // Hardcoded domain: https://reviewme.ma/go/{{2}}
                // Variable 1: Body text (with dynamic fallback link)
                // Variable 2: Establishment UUID
                const contentSid = 'HX42d3b18e50c737475c7fab05a8c30969'

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

                // Update analysis
                await updateConversationAnalysis(conversation.id, { sentiment: 'POSITIVE', status: 'CONVERTED', language: 'FR' })

                await addMessageToConversation(conversation.id, { role: 'assistant', content: '[CTA Sent] ' + finalPositive })
                return new NextResponse('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })

            } else if (cleanBody.includes('Bien') || cleanBody.includes('3-4') || cleanBody === '2') {
                // RATING 3-4 matches -> Send Link + Feedback Question

                // USE TRACKING LINK
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://reviewme.ma'
                const safeBaseUrl = baseUrl.replace(/\/$/, '')
                const trackingLink = `${safeBaseUrl}/go/${establishment.id}`

                const contentSid = 'HX01112ace1de5bf48fd75dd446de26071'

                const defaultPositive = "Merci ! Un petit clic pour nous donner de la force ? 💪"
                const rawPositive = establishment.custom_message_positive || defaultPositive
                const safeName = profileName || 'cher client'
                const finalPositive = rawPositive.replace('{{name}}', safeName) + `\n\n${trackingLink}`

                await import('@/lib/twilio').then(mod => mod.sendWhatsAppMessage({
                    to: from.replace('whatsapp:', ''),
                    body: finalPositive
                }))

                // 2. Send Feedback Question (Text)
                const responseText = establishment.custom_message_neutral || `Merci pour votre retour. Que pourrions-nous améliorer pour obtenir 5 étoiles la prochaine fois ?`

                await import('@/lib/twilio').then(mod => mod.sendWhatsAppMessage({
                    to: from.replace('whatsapp:', ''),
                    body: responseText
                }))

                // Set status to NEEDS_ATTENTION.
                // The AI blocker below will prevent auto-reply if status is NEEDS_ATTENTION.
                await updateConversationAnalysis(conversation.id, { sentiment: 'NEUTRAL', status: 'NEEDS_ATTENTION', language: 'FR' })

                await addMessageToConversation(conversation.id, { role: 'assistant', content: responseText })
                return new NextResponse('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })

            } else if (cleanBody.includes('Déçu') || cleanBody.includes('1-2') || cleanBody === '3') {
                // RATING 1-2 matches
                const responseText = establishment.custom_message_negative || `Nous sommes navrés d'apprendre que votre expérience n'a pas été satisfaisante. Pourriez-vous nous donner plus de détails afin que nous puissions nous améliorer ?`
                await updateConversationAnalysis(conversation.id, { sentiment: 'NEGATIVE', status: 'NEEDS_ATTENTION', language: 'FR' })

                await import('@/lib/twilio').then(mod => mod.sendWhatsAppMessage({
                    to: from.replace('whatsapp:', ''),
                    body: responseText
                }))

                await addMessageToConversation(conversation.id, { role: 'assistant', content: responseText })
                return new NextResponse('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })
            }

            // ==================================================
            // DEFAULT AI FLOW (Fallback)
            // ==================================================

            // STOP: If conversation is already CONVERTED (Link Sent), do not reply to small talk ("ok", "merci")
            // This prevents spamming the user after they have the link.
            console.log(`[Twilio Webhook] AI Flow Check. Status: ${conversation.status}`)

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
