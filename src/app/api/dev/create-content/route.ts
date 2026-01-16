import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID
        const authToken = process.env.TWILIO_AUTH_TOKEN

        if (!accountSid || !authToken) {
            return NextResponse.json({ error: "Missing Twilio Credentials" }, { status: 500 })
        }

        // Define the Content Payload (Call to Action - Google Review)
        const contentPayload = {
            "friendly_name": "Reput Google Review CTA v1",
            "language": "fr",
            "variables": {
                "1": "https://google.com" // Default URL
            },
            "types": {
                "twilio/call-to-action": {
                    "body": "Génial ! Toute l'équipe vous remercie. 🥰\n\nUn dernier petit clic pour nous donner de la force ? 💪",
                    "media": [
                        "https://images.unsplash.com/photo-1554048612-387768052bf7?q=80&w=1000&auto=format&fit=crop" // Celebration/Hearts
                    ],
                    "actions": [
                        {
                            "type": "URL",
                            "title": "Noter sur Google ⭐️",
                            "url": "https://{{1}}"
                        }
                    ]
                }
            }
        }

        // Call Twilio Content API directly (Helper lib might be outdated or require specific version)
        // Endpoint: https://content.twilio.com/v1/Content
        const response = await fetch(`https://content.twilio.com/v1/Content`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contentPayload)
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json({ error: data }, { status: response.status })
        }

        return NextResponse.json({
            success: true,
            sid: data.sid,
            friendly_name: data.friendly_name,
            data
        })

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}
