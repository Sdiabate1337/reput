"use client"

import { AuthProvider } from "@/lib/auth-context"
import { NotificationProvider } from "@/components/notification-context"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <NotificationProvider>
                {children}
            </NotificationProvider>
        </AuthProvider>
    )
}
