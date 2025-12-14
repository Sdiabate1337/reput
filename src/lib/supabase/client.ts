import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // Fallback for development when env vars are not set
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'placeholder-anon-key'

    return createBrowserClient(url, key)
}
