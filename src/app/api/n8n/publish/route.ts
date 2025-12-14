import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_PUBLISH_URL;

    if (!webhookUrl) {
        return NextResponse.json(
            { success: false, message: 'Server misconfiguration: Missing webhook URL' },
            { status: 500 }
        );
    }

    try {
        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('n8n Publish Webhook Error:', res.status, errorText);
            return NextResponse.json(
                { success: false, message: `n8n Error: ${res.status}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to proxy request to n8n' },
            { status: 500 }
        );
    }
}
