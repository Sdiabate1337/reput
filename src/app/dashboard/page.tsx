"use client"

import { Suspense, useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getEstablishmentByUserId } from "@/actions/establishments"
import { getDashboardStats, getConversationsForEstablishment } from "@/actions/conversations"
import { getAnalyticsData, type AnalyticsData } from "@/actions/analytics"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
// BottomNav removed (global)
import type { Conversation, Sentiment, ConversationStatus } from "@/types/database"
import { Loader2 } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { SentimentEvolutionChart } from "@/components/dashboard/charts/sentiment-evolution"
import { AnalyticsKPI } from "@/components/dashboard/charts/analytics-kpi"

import { SetupGuide } from "@/components/dashboard/setup-guide"

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

    // Data - Use proper type
    const [establishment, setEstablishment] = useState<any | null>(null) // Relaxed type for MVP to avoid importing huge interface if lazy, but ideally 'Establishment'
    const [stats, setStats] = useState<{
        total: number
        sentimentCounts: { POSITIVE: number; NEUTRAL: number; NEGATIVE: number; CRITICAL: number }
        statusCounts: { OPEN: number; NEEDS_ATTENTION: number; CLOSED: number; CONVERTED: number }
    } | null>(null)
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
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
                if (estResult.success && estResult.data) {
                    setEstablishment(estResult.data)

                    // 2. Load Stats
                    const statsResult = await getDashboardStats(estResult.data.id)
                    if (statsResult.success && statsResult.data) {
                        setStats(statsResult.data)
                    }

                    // 3. Load Analytics (Advanced)
                    const analyticsResult = await getAnalyticsData(30)
                    if (analyticsResult.success && analyticsResult.data) {
                        setAnalyticsData(analyticsResult.data)
                    }

                    // 4. Load Conversations (Keep for Feed/Data)
                    const convResult = await getConversationsForEstablishment({
                        establishmentId: estResult.data.id,
                        limit: 20
                    })
                    if (convResult.success && convResult.data) {
                        setConversations(convResult.data.conversations)
                    }
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error)
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
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FDFCF8] pb-20 md:pb-8 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header & Date Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 px-6 pt-6 md:px-0 md:pt-8 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">Performance</h1>
                        <p className="text-zinc-500 text-sm md:text-base">
                            Analyse de votre réputation chez <strong className="text-zinc-900">{establishment.name}</strong>
                        </p>
                    </div>
                    <DateRangePicker />
                </div>

                {/* Setup Guidance for New Users */}
                <SetupGuide establishment={establishment} />

                {/* KPI Cards */}
                {analyticsData && (
                    <AnalyticsKPI metrics={{
                        responseRate: analyticsData.responseRate,
                        averageSentiment: analyticsData.averageSentiment,
                        totalVolume: analyticsData.totalVolume,
                        avgResponseTime: analyticsData.avgResponseTime
                    }} />
                )}

                {/* Main Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                    {analyticsData && <SentimentEvolutionChart data={analyticsData.dailyStats} />}

                    {/* Quick Actions (Sidebar on Desktop) */}
                    <div className="hidden lg:block lg:col-span-1">
                        <QuickActions />
                    </div>
                </div>
            </div>
            {/* Bottom Nav is now global in AppShell */}
        </div>
    )
}
