
import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("YouCan Pay Webhook Received:", JSON.stringify(body, null, 2));

        // YouCan Pay Webhook Structure (Inferred/Standard)
        // Usually contains: `transaction_id`, `status`, `order_id`
        // order_id was constructed as `sub_{estId}_{timestamp}`

        const { transaction_id, status, order_id, base_amount_paid } = body.transaction || body;

        if (!order_id || !order_id.startsWith('sub_')) {
            console.log("Webhook ignored: Not a subscription order", order_id);
            return NextResponse.json({ message: "Ignored" });
        }

        // Parse Establishment ID from order_id
        // Format: sub_123456_999999
        const parts = order_id.split('_');
        if (parts.length < 2) {
            console.error("Invalid Order ID format:", order_id);
            return NextResponse.json({ message: "Invalid Order ID" }, { status: 400 });
        }
        const estId = parts[1];

        // Check Status
        // YouCan Pay status: 1 = Paid? "paid"? 
        // Let's handle string "paid" or generic typical status code
        // Research: "status_text": "paid"

        const isPaid = status === 1 || status === 'paid' || body.base_response?.code === 200; // Defensive based on various gateway structures

        if (isPaid) {
            console.log(`✅ Payment Confirmed for Est ${estId}. Activating Pro Plan.`);

            await execute(
                `UPDATE establishments 
                 SET plan = 'pro', 
                     subscription_status = 'ACTIVE', 
                     updated_at = NOW(),
                     billing_cycle = 'MONTHLY',
                     outbound_quota_limit = 2000
                 WHERE id = $1`,
                [estId]
            );
        } else {
            console.log(`⚠️ Payment status not paid: ${status} for Est ${estId}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
    }
}
