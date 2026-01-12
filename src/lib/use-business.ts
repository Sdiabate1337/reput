"use client"

import { useState, useEffect } from "react"

// Placeholder business hook - to be replaced with real PostgreSQL implementation
interface Business {
    id: string
    name: string
    googleMapsLink: string | null
}

export function useBusiness() {
    const [business, setBusiness] = useState<Business | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // TODO: Implement real PostgreSQL fetch
        setLoading(false)
    }, [])

    return { business, loading }
}
