'use server'

import { queryOne } from '@/lib/db'
import { verifyPassword, createSession, getSession, hashPassword } from '@/lib/auth'
import { ActionResult } from '@/types/database'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())

export async function adminLogin(formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { success: false, error: 'Email et mot de passe requis' }
    }

    try {
        // 1. Admin Email Check (Fail Fast)
        if (!ADMIN_EMAILS.includes(email)) {
            return { success: false, error: 'Accès refusé: Cet email n\'est pas administrateur.' }
        }

        // 2. Get User
        const user = await queryOne<{ id: string; password_hash: string }>(
            'SELECT id, password_hash FROM users WHERE email = $1',
            [email]
        )

        // SPECIAL FLOW: User allowed (in ENV) but not in DB -> Needs Registration
        if (!user) {
            return { success: false, error: 'ADMIN_NOT_REGISTERED' }
        }

        // 3. Verify Password
        if (!user || !(await verifyPassword(password, user.password_hash))) {
            return { success: false, error: 'Identifiants incorrects' }
        }

        // 4. Create Session
        await createSession(user.id)

        return { success: true }
    } catch (error) {
        console.error('Admin Login Error:', error)
        return { success: false, error: 'Erreur serveur' }
    }
}

export async function getAdminStatus(): Promise<boolean> {
    const session = await getSession()
    if (!session?.userId) {
        return false
    }

    const user = await queryOne<{ email: string }>(
        'SELECT email FROM users WHERE id = $1',
        [session.userId]
    )

    if (!user || !user.email) return false
    return ADMIN_EMAILS.includes(user.email)
}

export async function registerAdmin(formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) return { success: false, error: 'Requis' }

    if (!ADMIN_EMAILS.includes(email)) {
        return { success: false, error: 'Non autorisé' }
    }

    try {
        const hashedPassword = await hashPassword(password)
        const newUser = await queryOne<{ id: string }>(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
            [email, hashedPassword]
        )
        if (!newUser) throw new Error('Failed to create')

        await createSession(newUser.id)
        return { success: true }
    } catch (e) {
        return { success: false, error: 'Erreur création' }
    }
}

