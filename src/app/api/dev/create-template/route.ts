
import { NextResponse } from 'next/server'
import { getTwilioClient } from '@/lib/twilio'

export async function GET() {
    try {
        const client = getTwilioClient()

        // Create the Content Template
        // Docs: https://www.twilio.com/docs/content-api/create-and-send-your-first-content-api-template#create-a-call-to-action-template
        const content = await client.content.v1.contents.create({
            friendlyName: 'ReviewMe_Positive_CTA_v2',
            language: 'fr',
            variables: {
                '1': 'Sdiabate', // Default/Sample for preview
                '2': 'uuid' // Sample
            },
            types: {
                'twilio/call-to-action': {
                    body: 'Génial {{1}} ! Toute l\'équipe vous remercie. 🥰\n\nUn dernier petit clic pour nous donner de la force ? 💪',
                    actions: [
                        {
                            type: 'URL',
                            title: 'Noter sur Google',
                            url: 'https://reviewme.ma/go/{{2}}'
                        }
                    ]
                }
            }
        })

        // NOTE: New templates require approval (WhatsApp). 
        // For testing in Sandbox, it might work immediately via 'whatsapp:...' prefix or similar, 
        // but typically 'marketing' templates need approval. 
        // 'Utility' category is safer? Content API doesn't specify category in the 'types' object directly same way?
        // Actually, for WhatsApp, it submits for approval automatically upon creation usually?
        // Let's check the response.

        return NextResponse.json({
            success: true,
            sid: content.sid,
            status: content.types,
            message: "Template created. Make sure to submit for approval if needed or check Twilio Console."
        })

    } catch (error: any) {
        console.error("Template creation error:", error)
        return NextResponse.json({ success: false, error: error.message, details: error }, { status: 500 })
    }
}
