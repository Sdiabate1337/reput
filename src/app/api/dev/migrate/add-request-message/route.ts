
import { execute } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        await execute(`
            ALTER TABLE establishments 
            ADD COLUMN IF NOT EXISTS custom_message_request TEXT;
        `)

        return NextResponse.json({ success: true, message: 'Column custom_message_request added' })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
