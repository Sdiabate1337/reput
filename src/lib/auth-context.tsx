"use client"

import { createContext, useContext, useState, ReactNode } from "react"

// Placeholder auth context - to be replaced with real PostgreSQL auth
interface User {
    id: string
    email: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)

    const signIn = async (email: string) => {
        // TODO: Implement real PostgreSQL auth
        console.log('Sign in:', email)
    }

    const signOut = async () => {
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
