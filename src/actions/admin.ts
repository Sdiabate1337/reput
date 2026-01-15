'use server'

import { query, queryOne } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { Establishment, ActionResult } from '@/types/database'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())

async function verifyAdmin() {
    console.log("Verifying Admin Access...")
    const session = await getSession()
    if (!session || !session.userId) {
        throw new Error('Non authentifié')
    }

    // Fetch user email
    const user = await queryOne<{ email: string }>(
        'SELECT email FROM users WHERE id = $1',
        [session.userId]
    )

    if (!user || !user.email) {
        throw new Error('Utilisateur introuvable')
    }

    console.log(`[Admin Check] User Email: '${user.email}'`)
    console.log(`[Admin Check] Allowed Emails:`, ADMIN_EMAILS)

    if (!ADMIN_EMAILS.includes(user.email)) {
        throw new Error(`Accès refusé: Votre email '${user.email}' n'est pas dans la liste des admins ([${ADMIN_EMAILS.join(', ')}]). Vérifiez .env.local`)
    }

    return true
}

export async function getAllEstablishments(): Promise<ActionResult<Establishment[]>> {
    try {
        await verifyAdmin()

        const establishments = await query<Establishment>(
            'SELECT * FROM establishments ORDER BY created_at DESC'
        )

        return { success: true, data: establishments }
    } catch (error) {
        console.error('getAllEstablishments error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}
