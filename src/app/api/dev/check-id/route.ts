import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'

export async function GET() {
    try {
        const email = 'test1@gmail.com'

        const user = await queryOne<{ id: string }>(
            "SELECT id FROM users WHERE email = $1",
            [email]
        )
        if (!user) return NextResponse.json({ error: "User not found" })

        const establishment = await queryOne<{ id: string, name: string, twilio_number: string }>(
            "SELECT id, name, twilio_number FROM establishments WHERE user_id = $1",
            [user.id]
        )

        return NextResponse.json({
            matches_qr: establishment?.id.startsWith('b8fd29f2'),
            actual_id: establishment?.id,
            qr_ref_should_be: establishment?.id.substring(0, 8),
            establishment
        })

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}
