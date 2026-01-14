"use server"

import { execute } from '@/lib/db'

export async function migrateDb() {
    try {
        console.log("Running migration: Add whatsapp_onboarding_status...")
        await execute(`
            ALTER TABLE establishments 
            ADD COLUMN IF NOT EXISTS whatsapp_onboarding_status VARCHAR(50) DEFAULT 'PENDING';
        `)
        console.log("Migration successful!")
        return { success: true }
    } catch (e) {
        console.error("Migration failed:", e)
        return { success: false, error: e }
    }
}
