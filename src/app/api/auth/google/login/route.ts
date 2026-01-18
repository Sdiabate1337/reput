import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const baseUrl = process.env.NODE_ENV === 'production'
        ? (process.env.NEXT_PUBLIC_APP_URL || 'https://reviewme.ma')
        : 'http://localhost:3000'

    const redirectUri = `${baseUrl}/api/auth/google/callback`

    if (!clientId) {
        return NextResponse.json({ error: "Google Client ID not configured" }, { status: 500 })
    }

    const scope = 'openid email profile'
    const responseType = 'code'

    // Construct Google OAuth URL
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&prompt=select_account`

    return NextResponse.redirect(url)
}
