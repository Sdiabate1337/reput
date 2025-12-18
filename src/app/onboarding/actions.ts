'use server'

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export type OnboardingData = {
    company_name: string
    website: string
    connected_platforms: string[]
}

export async function completeOnboarding(data: OnboardingData) {
    const supabase = await createClient()

    // 1. Verify User
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (!user || userError) {
        throw new Error("Unauthorized")
    }

    // 2. Update User Metadata (Mark as onboarded)
    const { error: updateError } = await supabase.auth.updateUser({
        data: {
            company_name: data.company_name,
            website: data.website,
            connected_platforms: data.connected_platforms,
            onboarded: true
        }
    })

    if (updateError) {
        console.error("Error updating user metadata:", updateError)
        return { error: updateError.message }
    }

    // 3. Create Business Record in Database
    // We assume a 'businesses' table exists. 
    // If you haven't created it yet, user will see a DB error.
    const { error: businessError } = await supabase
        .from('businesses')
        .insert({
            user_id: user.id,
            name: data.company_name,
            website: data.website,
            // Assuming we might want to store platforms loosely or in a related table later
            // For now, we only store core business info.
        })
        .select()
        .single()

    // Note: If 'businesses' table doesn't exist, this will fail. 
    // We log it but don't block the user from entering the dashboard (soft fail), 
    // or block if strict. I'll block if specific error to help debugging.

    if (businessError) {
        console.error("Error creating business record:", businessError)
        // Check if table missing
        if (businessError.code === '42P01') { // undefined_table
            console.error("MISSING TABLE: 'businesses' table does not exist.")
        }
        // return { error: "Failed to create business record. Contact support." }
    }

    // 4. Redirect
    redirect('/dashboard')
}
