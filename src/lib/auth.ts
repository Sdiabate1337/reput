import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default-secret-key-change-it-in-prod'
)

const COOKIE_NAME = 'session'

// ===========================================
// Password Hashing
// ===========================================

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
}

// ===========================================
// Session Management (JWT)
// ===========================================

export async function createSession(userId: string) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    const session = await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET_KEY)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires,
        sameSite: 'lax',
        path: '/',
    })
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get(COOKIE_NAME)?.value
    if (!session) return null

    try {
        const { payload } = await jwtVerify(session, SECRET_KEY, {
            algorithms: ['HS256'],
        })
        return payload as { userId: string }
    } catch (error) {
        return null
    }
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
}
