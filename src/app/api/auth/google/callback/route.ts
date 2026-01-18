import { NextRequest, NextResponse } from 'next/server'
import { queryOne, execute } from '@/lib/db'
import { createSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface GoogleUser {
    id: string
    email: string
    verified_email: boolean
    name: string
    given_name: string
    picture: string
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
        return NextResponse.redirect(new URL('/login?error=GoogleAuthFailed', request.url))
    }

    if (!code) {
        return NextResponse.redirect(new URL('/login?error=NoCode', request.url))
    }

    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const baseUrl = process.env.NODE_ENV === 'production'
        ? (process.env.NEXT_PUBLIC_APP_URL || 'https://reviewme.ma')
        : 'http://localhost:3000'

    const redirectUri = `${baseUrl}/api/auth/google/callback`

    if (!clientId || !clientSecret) {
        return NextResponse.json({ error: "Google Configuration Missing" }, { status: 500 })
    }

    try {
        // 1. Exchange Code for Token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        })

        const tokenData = await tokenResponse.json()

        if (!tokenResponse.ok) {
            console.error('Google Token Error:', tokenData)
            return NextResponse.redirect(new URL('/login?error=TokenExchangeFailed', request.url))
        }

        // 2. Get User Info
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        })

        const googleUser = (await userResponse.json()) as GoogleUser

        if (!googleUser.email) {
            return NextResponse.redirect(new URL('/login?error=NoEmail', request.url))
        }

        // 3. Database Logic
        let userId = ''
        let isNewUser = false

        // A. Check by Google ID
        const existingByGoogle = await queryOne<{ id: string }>(
            'SELECT id FROM users WHERE google_id = $1',
            [googleUser.id]
        )

        if (existingByGoogle) {
            userId = existingByGoogle.id
        } else {
            // B. Check by Email
            const existingByEmail = await queryOne<{ id: string }>(
                'SELECT id FROM users WHERE email = $1',
                [googleUser.email]
            )

            if (existingByEmail) {
                // Link account
                userId = existingByEmail.id
                await execute(
                    'UPDATE users SET google_id = $1, avatar_url = $2 WHERE id = $3',
                    [googleUser.id, googleUser.picture, userId]
                )
            } else {
                // C. Create New User
                const newUser = await queryOne<{ id: string }>(
                    'INSERT INTO users (email, google_id, avatar_url) VALUES ($1, $2, $3) RETURNING id',
                    [googleUser.email, googleUser.id, googleUser.picture]
                )
                if (newUser) {
                    userId = newUser.id
                    isNewUser = true
                } else {
                    throw new Error('Failed to create user')
                }
            }
        }

        // 4. Create Session
        await createSession(userId)

        // 5. Check if user needs onboarding (no establishment)
        const establishment = await queryOne('SELECT id FROM establishments WHERE user_id = $1', [userId])

        const destination = establishment ? '/dashboard' : '/onboarding'
        return NextResponse.redirect(new URL(destination, request.url))

    } catch (error) {
        console.error('Google Auth Error:', error)
        return NextResponse.redirect(new URL('/login?error=ServerAuthError', request.url))
    }
}
