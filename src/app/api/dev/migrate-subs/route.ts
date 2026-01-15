import { NextResponse } from 'next/server'
import { execute } from '@/lib/db'

export async function GET() {
    try {
        await execute(`
            ALTER TABLE establishments 
            ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'TRIAL',
            ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
            ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'MONTHLY',
            ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
        `)

        return NextResponse.json({ success: true, message: "Migration Subscription executed" })
    } catch (error) {
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
    }
}
