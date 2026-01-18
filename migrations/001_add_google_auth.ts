import { execute } from '@/lib/db';

async function run() {
    console.log("Migrating Users table for OAuth...");
    try {
        await execute(`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;`);
        console.log("- Added google_id");

        await execute(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;`);
        console.log("- Added avatar_url");

        await execute(`ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;`);
        console.log("- Made password_hash nullable");

        console.log("Migration successful.");
        process.exit(0);
    } catch (e: any) {
        console.error("Migration failed:", e.message);
        process.exit(1);
    }
}

run();
