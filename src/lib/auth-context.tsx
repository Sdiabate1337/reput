"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { login, logout, getCurrentUser } from "@/actions/auth"
import { useRouter } from "next/navigation"

interface User {
    id: string
    email: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (formData: FormData) => Promise<{ success: boolean; error?: string }>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function fetchUser() {
            try {
                const currentUser = await getCurrentUser()
                setUser(currentUser)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    const signIn = async (formData: FormData) => {
        const result = await login(formData)
        if (result.success) {
            // Refresh user state
            const currentUser = await getCurrentUser()
            setUser(currentUser)
        }
        return result
    }

    const signOut = async () => {
        await logout()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
