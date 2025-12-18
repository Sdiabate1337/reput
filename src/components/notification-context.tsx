"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"
import { Review } from "@/types"

import { useBusiness } from "@/lib/use-business"

interface NotificationContextType {
    unreadCount: number
    notifications: Review[]
    refresh: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [unreadCount, setUnreadCount] = useState(0)
    const [notifications, setNotifications] = useState<Review[]>([])
    const { user } = useAuth()
    const { businessId } = useBusiness()
    const supabase = createClient()

    const fetchNotifications = async () => {
        if (!businessId) return

        // Fetch count
        const { count, error: countError } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .or('status.eq.PENDING_ANALYSIS,status.eq.PENDING_VALIDATION')
            .eq('business_id', businessId)

        if (!countError && count !== null) {
            setUnreadCount(count)
        }

        // Fetch latest 5 notifications
        const { data, error: dataError } = await supabase
            .from('reviews')
            .select('*')
            .or('status.eq.PENDING_ANALYSIS,status.eq.PENDING_VALIDATION')
            .eq('business_id', businessId)
            .order('created_at', { ascending: false })
            .limit(5)

        if (!dataError && data) {
            // Map DB fields to Review type consistently with ReviewsPage
            const mappedNotifications: Review[] = data.map((r: any) => {
                // Sentiment Logic
                let sentiment: any = 'neutral';
                if (r.ai_sentiment_score >= 75) sentiment = 'positive';
                else if (r.ai_sentiment_score <= 40) sentiment = 'negative';

                // Status Logic
                let status: any = 'pending';
                if (r.status?.includes('PUBLISHED')) status = 'published';
                if (r.status === 'REJECTED' || r.status === 'archived') status = 'archived';

                return {
                    id: r.id,
                    source: (r.platform?.toLowerCase() || 'other') as any,
                    author: r.reviewer_name || 'Anonymous',
                    avatarUrl: undefined,
                    rating: r.rating || 0,
                    date: r.review_date || r.created_at,
                    content: r.review_text || '',
                    sentiment: sentiment,
                    status: status,
                    tags: r.ai_tags || [],
                    draftResponse: r.draft_response,
                    publishedResponse: r.published_response
                }
            })
            setNotifications(mappedNotifications)
        }
    }

    useEffect(() => {
        if (businessId) {
            fetchNotifications()

            const channel = supabase
                .channel('realtime-reviews')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'reviews',
                        filter: `business_id=eq.${businessId}`
                    },
                    () => {
                        console.log("Realtime update received!")
                        fetchNotifications()
                    }
                )
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        }
    }, [businessId, supabase])

    return (
        <NotificationContext.Provider value={{ unreadCount, notifications, refresh: fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotifications = () => useContext(NotificationContext)
