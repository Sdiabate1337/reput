
import { Twilio } from 'twilio'
import { NextResponse } from 'next/server'

export async function GET() {
    const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

    try {
        // 1. Dynamic Welcome (Quick Reply)
        // We use {{1}} for the entire body text.
        const welcomeBody = {
            "types": {
                "twilio/quick-reply": {
                    "body": "{{1}}",
                    "actions": [
                        { "title": "Top !", "id": "1" },
                        { "title": "Bien", "id": "2" },
                        { "title": "Déçu", "id": "3" }
                    ]
                }
            }
        }

        const welcomeTemplate = await client.content.v1.contents.create({
            friendlyName: 'Dynamic Welcome (Custom Text)',
            language: 'fr',
            variables: { '1': 'body_text' },
            types: welcomeBody.types
        })

        // 2. Dynamic Positive (CTA)
        // We use {{1}} for body, {{2}} for Link URL suffix (or full URL? CTA usually needs specific structure)
        // Twilio CTA URL often supports {{1}}.
        // Body: {{1}}
        // Button: Link to {{2}}
        const positiveBody = {
            "types": {
                "twilio/call-to-action": {
                    "body": "{{1}}", // Dynamic Body
                    "actions": [
                        {
                            "type": "URL",
                            "title": "Laisser un avis Google",
                            "url": "https://{{2}}" // We pass the link without protocol
                        }
                    ]
                }
            }
        }

        const positiveTemplate = await client.content.v1.contents.create({
            friendlyName: 'Dynamic Positive (Custom Text)',
            language: 'fr',
            variables: { '1': 'body_text', '2': 'link_url' },
            types: positiveBody.types
        })

        return NextResponse.json({
            welcomeSid: welcomeTemplate.sid,
            positiveSid: positiveTemplate.sid
        })

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
