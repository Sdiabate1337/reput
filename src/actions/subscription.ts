'use server'

import { queryOne, execute } from '@/lib/db'
import { getEstablishmentByUserId } from '@/actions/establishments'
import { ActionResult } from '@/types/database'

import { createYouCanPaymentToken } from '@/lib/youcan'

// ... existing imports ...

export async function switchPlan(
    establishmentId: string,
    plan: 'startup' | 'pro',
    cycle: 'MONTHLY' | 'YEARLY'
): Promise<ActionResult<{ paymentUrl?: string }>> {
    try {
        const estResult = await getEstablishmentByUserId()
        if (!estResult.success || !estResult.data) {
            return { success: false, error: "Non autorisé" }
        }

        if (estResult.data.id !== establishmentId) {
            return { success: false, error: "Non autorisé" }
        }

        // If plan is 'startup', maybe we just switch instantly for now?
        // OR If plan is 'pro', we generate payment link.

        if (plan === 'pro') {
            const amount = cycle === 'YEARLY' ? 950000 : 99000 // 9500 MAD or 990 MAD (in centimes typically? wait)
            // Startup: 290 or 390. Pro: 790 or 990.
            // Let's stick to Pricing Page logic:
            // Pro Monthly: 990 MAD
            // Pro Yearly: 790 * 12 = 9480 MAD

            // YouCan Pay AMOUNT unit: Usually it's base currency? 
            // The search said "25 USD = 2500". So if I want 990 MAD...
            // It might be 99000? 
            // Wait, let's verify standard conventions. MAD has 2 decimals.
            // So 990.00 MAD -> 99000 units.

            const price = cycle === 'YEARLY' ? 948000 : 99000

            const tokenResult = await createYouCanPaymentToken({
                amount: price,
                currency: 'MAD',
                orderId: `sub_${establishmentId}_${Date.now()}`,
                customer: {
                    // We could fetch user email here if we had it joined, or pass it.
                    // For now optional.
                },
                successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?est_id=${establishmentId}&plan=${plan}&cycle=${cycle}`,
                errorUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=payment_failed`
            })

            if (!tokenResult.success || !tokenResult.paymentUrl) {
                return { success: false, error: "Erreur initialisation paiement: " + (tokenResult.error || "URL manquante") }
            }

            return { success: true, data: { paymentUrl: tokenResult.paymentUrl } }
        }

        // For Startup (or Downgrade), switch immediately
        let newStatus = 'ACTIVE'
        let outboundLimit = 100

        await execute(
            `UPDATE establishments 
             SET plan = $1, 
                 billing_cycle = $2, 
                 subscription_status = $3,
                 outbound_quota_limit = $4,
                 updated_at = NOW()
             WHERE id = $5`,
            [plan, cycle, newStatus, outboundLimit, establishmentId]
        )

        return { success: true }
    } catch (error) {
        console.error("switchPlan error:", error)
        return { success: false, error: "Erreur serveur" }
    }
}

export async function startTrial(establishmentId: string): Promise<ActionResult> {
    // ... existing implementation ...
    try {
        await execute(
            `UPDATE establishments 
             SET plan = 'pro', 
                 subscription_status = 'TRIAL',
                 trial_ends_at = NOW() + INTERVAL '14 days',
                 outbound_quota_limit = 500,
                 updated_at = NOW()
             WHERE id = $1`,
            [establishmentId]
        )
        return { success: true }
    } catch (error) {
        return { success: false, error: String(error) }
    }
}


export async function selectPlanForCurrentUser(
    plan: 'startup' | 'pro',
    cycle: 'MONTHLY' | 'YEARLY'
): Promise<ActionResult<{ paymentUrl?: string }>> {
    const est = await getEstablishmentByUserId()
    if (!est.success || !est.data) return { success: false, error: "Non connecté" }

    // If result has paymentUrl, client should redirect
    return switchPlan(est.data.id, plan, cycle)
}
