"use client"

import { useState, useEffect, Suspense } from "react"
import { useAuth } from "@/lib/auth-context"
import { getDashboardStats, getConversationsForEstablishment, getOrCreateConversation } from "@/actions/conversations"
import { getEstablishmentByUserId } from "@/actions/establishments"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import type { Conversation, Sentiment, ConversationStatus } from "@/types/database"
import { Loader2 } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

export default function DashboardPage() {
    return (
        <Suspense fallback={<Loader2 className="animate-spin text-[#E85C33]" />}>
            <DashboardContent />
        </Suspense>
    )
}

function DashboardContent() {
    const { user } = useAuth()
    const searchParams = useSearchParams()
    const initialConversationId = searchParams.get('conversationId')

    const [isLoading, setIsLoading] = useState(true)

    // Data
    const [establishment, setEstablishment] = useState<{ id: string, name: string } | null>(null)
    const [stats, setStats] = useState<{
        total: number
        sentimentCounts: { POSITIVE: number; NEUTRAL: number; NEGATIVE: number; CRITICAL: number }
        statusCounts: { OPEN: number; NEEDS_ATTENTION: number; CLOSED: number; CONVERTED: number }
    } | null>(null)
    const [conversations, setConversations] = useState<Conversation[]>([])

    const router = useRouter()

    // Auto-refresh for live feed (US-4.2)
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh()
        }, 15000) // Poll every 15s
        return () => clearInterval(interval)
    }, [router])

    useEffect(() => {
        async function loadDashboardData() {
            if (!user) return

            try {
                // 1. Get Establishment
                const estResult = await getEstablishmentByUserId()
                if (!estResult.success || !estResult.data) {
                    setIsLoading(false)
                    return
                }
                setEstablishment({ id: estResult.data.id, name: estResult.data.name })

                // 2. Get Stats
                const statsResult = await getDashboardStats(estResult.data.id)
                if (statsResult.success && statsResult.data) {
                    setStats(statsResult.data)
                }

                // 3. Get Recent Conversations
                const convResult = await getConversationsForEstablishment({
                    establishmentId: estResult.data.id,
                    limit: 50
                })
                if (convResult.success && convResult.data) {
                    setConversations(convResult.data.conversations)
                }

            } catch (error) {
                console.error("Dashboard load error:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadDashboardData()
    }, [user])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#E85C33]" size={32} />
            </div>
        )
    }

    if (!establishment) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Bienvenue !</h1>
                <p>Veuillez configurer votre établissement pour commencer.</p>
                {/* Redirect logic handled in onboarding but good to have fallback */}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FDFCF8] pb-20 md:pb-8 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 px-6 pt-6 md:px-0 md:pt-8 md:mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">Dashboard</h1>
                        <p className="text-zinc-500 text-sm md:text-base">
                            Bonjour, voici ce qui se passe chez <strong className="text-zinc-900">{establishment.name}</strong>
                        </p>
                    </div>
                </div>

                {/* Stats */}
                {stats && <StatsGrid stats={stats} />}

                {/* Main Content: Activity + Quick Actions */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Feed (2/3) */}
                    <div className="lg:col-span-2">
                        <RecentActivity conversations={conversations} initialConversationId={initialConversationId} />
                    </div>

                    {/* Right: Actions (1/3) */}
                    <div className="hidden lg:block">
                        <QuickActions />
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    )
}


