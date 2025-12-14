"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, ChevronDown, RefreshCcw, TrendingUp, CheckCircle2, Clock, Inbox } from "lucide-react"
import { Review, Platform, Sentiment, ReviewStatus } from "@/types"
import { ReviewCard } from "@/components/review-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

// --- MOCK DATA REMOVED ---

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [filterPlatform, setFilterPlatform] = useState<Platform | 'all'>('all')
    const [filterSentiment, setFilterSentiment] = useState<Sentiment | 'all'>('all')
    const [filterStatus, setFilterStatus] = useState<ReviewStatus | 'all'>('pending') // Default to Pending for Inbox feel

    const supabase = createClient()

    const fetchReviews = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('business_id', '00000000-0000-0000-0000-000000000001') // Test Business ID
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching reviews:', error.message, error.details, error.hint)
        } else {
            // Map DB fields to Frontend Type
            const mappedReviews: Review[] = (data || []).map((r: any) => {
                // Sentiment Logic
                let sentiment: Sentiment = 'neutral';
                if (r.ai_sentiment_score >= 75) sentiment = 'positive';
                else if (r.ai_sentiment_score <= 40) sentiment = 'negative';

                // Status Logic
                let status: ReviewStatus = 'pending';
                if (r.status?.includes('PUBLISHED')) status = 'published';
                if (r.status === 'REJECTED' || r.status === 'archived') status = 'archived';

                return {
                    id: r.id,
                    source: r.platform?.toLowerCase() as Platform,
                    author: r.reviewer_name || 'Anonymous',
                    avatarUrl: undefined, // Not in DB schema
                    rating: r.rating,
                    date: r.review_date || r.created_at,
                    content: r.review_text || '',
                    sentiment: sentiment,
                    status: status,
                    tags: r.ai_tags || [],
                    draftResponse: r.draft_response,
                    publishedResponse: r.published_response
                }
            })
            setReviews(mappedReviews)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchReviews()
    }, [])

    const handleStatusChange = (id: string, newStatus: ReviewStatus) => {
        setReviews(prev => prev.map(r =>
            r.id === id ? { ...r, status: newStatus } : r
        ))
    }

    const filteredReviews = reviews.filter(review => {
        if (filterPlatform !== 'all' && review.source !== filterPlatform) return false
        if (filterSentiment !== 'all' && review.sentiment !== filterSentiment) return false
        if (filterStatus !== 'all' && review.status !== filterStatus) return false
        return true
    })

    // Staggered animation for list
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    // Stats Calculation
    const pendingCount = reviews.filter(r => r.status === 'pending').length
    const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0).toFixed(1)

    return (
        <div className="space-y-6 pb-10">
            {/* COCKPIT STATS (Mobile/Desktop friendly) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <Inbox size={14} className="text-zinc-400" />
                        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Pending</span>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{pendingCount}</div>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp size={14} className="text-emerald-500" />
                        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Avg Rating</span>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{avgRating}</div>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm hidden md:block">
                    <div className="flex items-center gap-2 mb-1">
                        <Clock size={14} className="text-blue-500" />
                        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Response Time</span>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">2.4h</div>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm hidden md:block">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 size={14} className="text-indigo-500" />
                        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Replied</span>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">94%</div>
                </div>
            </div>

            {/* STICKY HEADER TOOLBAR */}
            <div className="sticky top-0 z-30 -mx-6 px-6 py-3 backdrop-blur-xl bg-white/80 dark:bg-zinc-950/80 border-b border-black/5 dark:border-white/5 flex items-center justify-between gap-4 transition-all will-change-transform">

                {/* Left: Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="h-8 flex items-center gap-2 mr-2 px-2 bg-zinc-100/50 dark:bg-zinc-900 rounded-lg border border-black/5">
                        <span className="text-xs font-bold text-zinc-500 uppercase">View:</span>
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 capitalize">{filterStatus}</span>
                    </div>

                    <FilterButton
                        label="Status"
                        value={filterStatus}
                        options={['all', 'pending', 'published', 'archived']}
                        onChange={(v: any) => setFilterStatus(v)}
                    />
                    <FilterButton
                        label="Source"
                        value={filterPlatform}
                        options={['all', 'google', 'booking', 'tripadvisor']}
                        onChange={(v: any) => setFilterPlatform(v)}
                    />
                    <FilterButton
                        label="Sentiment"
                        value={filterSentiment}
                        options={['all', 'positive', 'neutral', 'negative']}
                        onChange={(v: any) => setFilterSentiment(v)}
                    />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-600">
                        <RefreshCcw className="h-3.5 w-3.5" />
                    </Button>
                    <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
                    <Button size="sm" className="h-8 text-[11px] font-medium bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm">
                        Export
                    </Button>
                </div>
            </div>

            {/* CONTENT GRID */}
            <AnimatePresence mode="popLayout">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
                        ))}
                    </div>
                ) : filteredReviews.length > 0 ? (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
                    >
                        {filteredReviews.map((review) => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </motion.div>
                ) : (
                    /* EMPTY STATE */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="h-24 w-24 bg-zinc-50 dark:bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 ring-1 ring-black/5 dark:ring-white/5">
                            <CheckCircle2 size={40} className="text-zinc-300 dark:text-zinc-600" />
                        </div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">All caught up!</h2>
                        <p className="text-zinc-500 max-w-sm mx-auto mb-8">
                            There are no {filterStatus !== 'all' ? filterStatus : ''} reviews to show right now.
                        </p>
                        <Button variant="outline" onClick={() => setFilterStatus('all')}>
                            View All Reviews
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function FilterButton({ label, value, options, onChange }: any) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all capitalize",
                    value !== 'all' || isOpen
                        ? "bg-white shadow-sm text-indigo-600 ring-1 ring-zinc-200"
                        : "text-zinc-500 hover:bg-white/50 hover:text-zinc-700"
                )}
            >
                <span className="text-zinc-400">{label}</span>
                {value !== 'all' && <span>: {value}</span>}
                <ChevronDown size={10} className={cn("opacity-50 transition-transform", isOpen && "rotate-180")} />
            </button>

            {/* Click-based Dropdown */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-2 left-0 w-32 bg-white/90 backdrop-blur-xl border border-zinc-200/60 rounded-lg shadow-xl p-1 z-50 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                        {options.map((opt: string) => (
                            <div
                                key={opt}
                                onClick={() => {
                                    onChange(opt)
                                    setIsOpen(false)
                                }}
                                className={cn(
                                    "px-2 py-1.5 text-xs rounded-md cursor-pointer hover:bg-zinc-50 capitalize transition-colors",
                                    value === opt ? "font-bold text-indigo-600 bg-indigo-50/50" : "text-zinc-600"
                                )}
                            >
                                {opt}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
