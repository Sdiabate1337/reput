
import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'

export async function GET() {
    try {
        const userId = '7de6d625-f735-48c7-a75a-0e7c4bf6454e'
        const result = await queryOne<{ email: string }>(
            'SELECT email FROM users WHERE id = $1',
            [userId]
        )

        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}
