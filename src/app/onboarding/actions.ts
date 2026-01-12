'use server'

// Placeholder onboarding actions - to be replaced with real PostgreSQL implementation

export async function saveOnboardingData(data: {
    businessName: string
    fullName?: string
}) {
    // TODO: Implement with PostgreSQL
    console.log('Onboarding data:', data)
    return { success: true }
}
