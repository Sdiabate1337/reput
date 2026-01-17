
import { NextResponse } from 'next/server'
import { getTwilioClient } from '@/lib/twilio'

export async function GET() {
    try {
        const client = getTwilioClient()

        // Create Review Request Template (Custom Message)
        // Variables:
        // 1: Full Custom Message Body (e.g. "Bonjour Karim, merci pour votre passage ! Un petit avis ?")

        const content = await client.content.v1.contents.create({
            friendlyName: 'ReviewMe_Request_Custom_v1',
            language: 'fr',
            variables: {
                '1': 'Bonjour Karim, merci de votre visite. Un petit avis ?'
            },
            types: {
                'twilio/quick-reply': {
                    body: '{{1}}',
                    actions: [
                        {
                            type: 'QUICK_REPLY',
                            title: 'Top ! ⭐',
                            id: 'rating_5'
                        },
                        {
                            type: 'QUICK_REPLY',
                            title: 'Moyen 😐',
                            id: 'rating_3'
                        },
                        {
                            type: 'QUICK_REPLY',
                            title: 'Déçu 😞',
                            id: 'rating_1'
                        }
                    ]
                }
            }
        })

        return NextResponse.json({
            success: true,
            sid: content.sid,
            message: "Custom Request Template created."
        })

    } catch (error: any) {
        console.error("Template error:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
