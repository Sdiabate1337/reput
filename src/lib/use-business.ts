"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"

export function useBusiness() {
    const { user } = useAuth()
    const [businessId, setBusinessId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchBusiness() {
            if (!user) return

            const supabase = createClient()
            const { data, error } = await supabase
                .from('businesses')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (!error && data) {
                setBusinessId(data.id)
            }
            setLoading(false)
        }

        fetchBusiness()
    }, [user])

    return { businessId, loading }
}
