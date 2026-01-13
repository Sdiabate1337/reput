'use server'

import { queryOne, execute } from '@/lib/db'
import { hashPassword, verifyPassword, createSession, deleteSession, getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { ActionResult } from '@/types/database'

interface User {
    id: string
    email: string
}

// ===========================================
// Sign Up
// ===========================================

export async function signup(formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { success: false, error: 'Email et mot de passe requis' }
    }

    try {
        // Check if user exists
        const existing = await queryOne('SELECT id FROM users WHERE email = $1', [email])
        if (existing) {
            return { success: false, error: 'Cet email est déjà utilisé' }
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Create user
        const newUser = await queryOne<{ id: string }>(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
            [email, hashedPassword]
        )

        if (!newUser) {
            return { success: false, error: 'Erreur lors de la création du compte' }
        }

        // Create session
        await createSession(newUser.id)

        return { success: true }
    } catch (error) {
        console.error('Signup error:', error)
        return { success: false, error: 'Erreur serveur' }
    }
}

// ===========================================
// Login
// ===========================================

export async function login(formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { success: false, error: 'Email et mot de passe requis' }
    }

    try {
        // Get user
        const user = await queryOne<{ id: string; password_hash: string }>(
            'SELECT id, password_hash FROM users WHERE email = $1',
            [email]
        )

        if (!user || !(await verifyPassword(password, user.password_hash))) {
            return { success: false, error: 'Email ou mot de passe incorrect' }
        }

        // Create session
        await createSession(user.id)

        return { success: true }
    } catch (error) {
        console.error('Login error:', error)
        return { success: false, error: 'Erreur serveur' }
    }
}

// ===========================================
// Logout
// ===========================================

export async function logout() {
    await deleteSession()
    redirect('/login')
}

// ===========================================
// Get Current User
// ===========================================

export async function getCurrentUser(): Promise<User | null> {
    const session = await getSession()
    if (!session) return null

    const user = await queryOne<User>(
        'SELECT id, email FROM users WHERE id = $1',
        [session.userId]
    )

    return user || null
}
