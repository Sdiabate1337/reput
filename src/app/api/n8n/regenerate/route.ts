import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_REGENERATE_URL;

    if (!webhookUrl) {
        return NextResponse.json(
            { success: false, message: 'Server misconfiguration: Missing webhook URL' },
            { status: 500 }
        );
    }

    try {
        console.log("Proxying to n8n:", webhookUrl, "Body:", body);
        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('n8n Regenerate Webhook Error:', res.status, errorText);

            // Try to parse JSON error if possible
            try {
                const jsonError = JSON.parse(errorText);
                return NextResponse.json(jsonError, { status: res.status });
            } catch (e) {
                return NextResponse.json(
                    { success: false, message: `n8n Error: ${res.status} - ${errorText}` },
                    { status: res.status }
                );
            }
        }

        const responseText = await res.text();
        console.log("n8n Raw Response:", responseText); // DEBUG

        if (!responseText) {
            throw new Error("n8n returned an empty response (200 OK). Check if the workflow is Active and reaches the Respond to Webhook node.");
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            throw new Error(`Invalid JSON from n8n: ${responseText.substring(0, 100)}`);
        }

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('Proxy Error:', error);
        return NextResponse.json(
            { success: false, message: `Failed to proxy request to n8n: ${error.message || String(error)}` },
            { status: 500 }
        );
    }
}
