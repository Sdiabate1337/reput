
import { NextResponse } from 'next/server'
import { getTwilioClient } from '@/lib/twilio'

export async function GET() {
    try {
        const client = getTwilioClient()

        // Create Review Request Template (Interactive)
        // Variables:
        // 1: Client Name
        // 2: Establishment Name

        const content = await client.content.v1.contents.create({
            friendlyName: 'ReviewMe_Request_Interactive_v2',
            language: 'fr',
            variables: {
                '1': 'Karim',
                '2': 'Test Café'
            },
            types: {
                'twilio/quick-reply': {
                    body: 'Bonjour {{1}}, merci de votre visite chez {{2}}. Comment s\'est passée votre expérience ?',
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
            message: "Review Request Template created."
        })

    } catch (error: any) {
        console.error("Template error:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
