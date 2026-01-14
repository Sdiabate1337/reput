import { NextResponse } from 'next/server'
import { migrateDb } from '@/actions/migrate'

export async function GET() {
    try {
        const result = await migrateDb()
        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
