"use client"

import { createContext, useContext, useState, ReactNode } from "react"

// Placeholder notification context - to be replaced with real PostgreSQL implementation
interface Notification {
    id: string
    message: string
    read: boolean
    createdAt: string
}

interface NotificationContextType {
    notifications: Notification[]
    unreadCount: number
    markAsRead: (id: string) => void
    refresh: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const unreadCount = notifications.filter(n => !n.read).length

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
    }

    const refresh = async () => {
        // TODO: Implement real PostgreSQL fetch
        console.log('Refresh notifications')
    }

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, refresh }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    const context = useContext(NotificationContext)
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider')
    }
    return context
}
