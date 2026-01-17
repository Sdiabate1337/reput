
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS redirect_events (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                establishment_id UUID NOT NULL REFERENCES establishments(id),
                conversation_id UUID REFERENCES conversations(id),
                user_agent TEXT,
                ip_hash TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `)

        // Add index for fast analytics
        await query(`
            CREATE INDEX IF NOT EXISTS idx_redirect_events_est_date 
            ON redirect_events(establishment_id, created_at);
        `)

        return NextResponse.json({ success: true, message: "Table redirect_events created" })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
