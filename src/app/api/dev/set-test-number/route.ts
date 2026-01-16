import { NextResponse } from 'next/server'
import { queryOne, execute } from '@/lib/db'

export async function GET() {
    try {
        const email = 'test1@gmail.com'
        const testNumber = '+14155238886'

        // 1. Find User
        const user = await queryOne<{ id: string }>(
            "SELECT id FROM users WHERE email = $1",
            [email]
        )

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        // 2. Update Establishment
        await execute(
            `UPDATE establishments 
             SET twilio_number = $1, 
                 whatsapp_onboarding_status = 'ACTIVE' 
             WHERE user_id = $2`,
            [testNumber, user.id]
        )

        return NextResponse.json({
            success: true,
            message: `Updated to ${testNumber} for ${email}`
        })

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}
