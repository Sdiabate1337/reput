
import { Establishment } from "@/types/database"

export type Feature =
    | 'EXPORT_CSV'
    | 'AUTO_REPLY'
    | 'CAMPAIGN_SEND'
    | 'QR_CODE'
    | 'ANALYTICS_ADVANCED'

export const PLAN_FEATURES: Record<string, Feature[]> = {
    'startup': ['QR_CODE'],
    'pro': ['EXPORT_CSV', 'AUTO_REPLY', 'CAMPAIGN_SEND', 'QR_CODE', 'ANALYTICS_ADVANCED'],
    'enterprise': ['EXPORT_CSV', 'AUTO_REPLY', 'CAMPAIGN_SEND', 'QR_CODE', 'ANALYTICS_ADVANCED']
}

/**
 * Check if the trial period is still active
 */
export function isTrialActive(est: Establishment): boolean {
    if (est.subscription_status !== 'TRIAL') return false
    if (!est.trial_ends_at) return false
    return new Date(est.trial_ends_at) > new Date()
}

/**
 * Check if user has access to a specific feature
 * Logic:
 * 1. If Plan includes feature -> Access
 * 2. If Plan is 'startup' but Trial is Active -> Access (assuming Pro Trial)
 */
export function canAccessFeature(est: Establishment, feature: Feature): boolean {
    // If Subscription is Active/Trial
    const isActive = est.subscription_status === 'ACTIVE'
    const isTrial = isTrialActive(est)

    // If account is canceled/past_due and no trial -> Block everything except basic read?
    // For MVP, let's correspond 'startup' to a "Free Tier" behavior if status is not active.

    // Simplification:
    // If Plan is PRO/ENTERPRISE and Status is ACTIVE -> Allow All
    if ((est.plan === 'pro' || est.plan === 'enterprise') && isActive) {
        return true
    }

    // If Trial is Active -> Allow All (Pro Trial)
    if (isTrial) {
        return true
    }

    // Otherwise check specific plan limits (Fallback to Startup/Free)
    const allowed = PLAN_FEATURES['startup'] || []
    return allowed.includes(feature)
}

/**
 * Check if user can send more messages
 */
export function checkQuota(est: Establishment): boolean {
    // If Unlimited (e.g. Enterprise), return true
    if (est.plan === 'enterprise') return true

    return est.outbound_quota_used < est.outbound_quota_limit
}

/**
 * Get remaining trial days
 */
export function getTrialDaysLeft(est: Establishment): number {
    if (!est.trial_ends_at) return 0
    const end = new Date(est.trial_ends_at).getTime()
    const now = new Date().getTime()
    if (end <= now) return 0
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24))
}
