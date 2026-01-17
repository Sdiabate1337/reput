
import { NextResponse } from 'next/server'
import { execute } from '@/lib/db'

export async function GET() {
    try {
        await execute(`
            ALTER TABLE establishments 
            ADD COLUMN IF NOT EXISTS google_place_id VARCHAR(255);
        `)

        return NextResponse.json({ success: true, message: "Added google_place_id column" })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
