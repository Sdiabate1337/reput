
import { execute } from '@/lib/db'

export async function POST() {
    try {
        await execute(`ALTER TABLE establishments ADD COLUMN IF NOT EXISTS custom_message_welcome TEXT;`)
        await execute(`ALTER TABLE establishments ADD COLUMN IF NOT EXISTS custom_message_positive TEXT;`)
        return new Response('Migration applied: welcome/positive cols', { status: 200 })
    } catch (error) {
        return new Response('Migration failed: ' + error, { status: 500 })
    }
}
