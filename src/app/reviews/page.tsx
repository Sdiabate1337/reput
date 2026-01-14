"use client"

import { Suspense, useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getEstablishmentByUserId } from "@/actions/establishments"
import { getConversationsForEstablishment } from "@/actions/conversations"
import { RecentActivity } from "@/components/dashboard/recent-activity"
// BottomNav global
import type { Conversation } from "@/types/database"
import { Loader2, MessageSquare } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

export default function ReviewsPage() {
    return (
        <Suspense fallback={<Loader2 className="animate-spin text-[#E85C33]" />}>
            <ReviewsContent />
        </Suspense>
    )
}

function ReviewsContent() {
    const { user } = useAuth()
    const searchParams = useSearchParams()
    const initialConversationId = searchParams.get('conversationId')
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(true)
    const [establishment, setEstablishment] = useState<{ id: string, name: string } | null>(null)
    const [conversations, setConversations] = useState<Conversation[]>([])

    // Auto-refresh for live feed
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh()
        }, 15000)
        return () => clearInterval(interval)
    }, [router])

    useEffect(() => {
        async function loadReviewsData() {
            if (!user) return

            try {
                // 1. Get Establishment
                const estResult = await getEstablishmentByUserId()
                if (estResult.success && estResult.data) {
                    setEstablishment(estResult.data)

                    // 2. Load Conversations
                    const convResult = await getConversationsForEstablishment({
                        establishmentId: estResult.data.id,
                        limit: 50
                    })
                    if (convResult.success && convResult.data) {
                        setConversations(convResult.data.conversations)
                    }
                }
            } catch (error) {
                console.error("Failed to load reviews data", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadReviewsData()
    }, [user])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#E85C33]" size={32} />
            </div>
        )
    }

    if (!establishment) {
        return <div className="p-8 text-center"><p>Établissement non trouvé.</p></div>
    }

    return (
        <div className="min-h-screen bg-[#FDFCF8] pb-24 md:pb-8 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 px-6 pt-6 md:px-0 md:pt-8">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
                            Reviews
                        </h1>
                        <p className="text-zinc-500 text-sm">
                            Gestion des avis pour <strong className="text-zinc-900">{establishment.name}</strong>
                        </p>
                    </div>
                    {/* Count Badge */}
                    <div className="bg-orange-100 text-[#E85C33] px-3 py-1 rounded-full text-sm font-bold">
                        {conversations.length}
                    </div>
                </div>

                {/* Feed */}
                <div className="px-6 md:px-0">
                    <RecentActivity conversations={conversations} initialConversationId={initialConversationId} />
                </div>
            </div>
            {/* Bottom Nav is global */}
        </div>
    )
}
