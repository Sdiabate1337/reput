"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, ChevronDown, RefreshCcw, TrendingUp, CheckCircle2, Clock, Inbox, Download, Star } from "lucide-react"
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
        <div className="space-y-8 pb-12 w-full max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Inbox</h1>
                    <p className="text-zinc-500 font-medium mt-1">Manage, reply, and track your customer reviews.</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Reusing standard buttons for consistency */}
                    <Button variant="outline" className="h-10 border-dashed border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* COCKPIT STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Pending - Meaningful Action */}
                <div className="group p-5 md:p-6 rounded-[32px] bg-white border border-zinc-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-[#FFF8F6] rounded-2xl text-[#E85C33] group-hover:scale-110 transition-transform duration-300">
                            <Inbox size={20} strokeWidth={2.5} />
                        </div>
                        {pendingCount > 0 && (
                            <span className="flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-[#E85C33] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E85C33]"></span>
                            </span>
                        )}
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-1">{pendingCount}</div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pending</div>
                    </div>
                </div>

                {/* Avg Rating */}
                <div className="group p-5 md:p-6 rounded-[32px] bg-white border border-zinc-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                            <Star size={20} strokeWidth={2.5} className="fill-emerald-600/20" />
                        </div>
                        <div className={cn("text-xs font-bold px-2 py-1 rounded-full", Number(avgRating) >= 4 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                            {Number(avgRating) >= 4 ? "+2.1%" : "-0.5%"}
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-1">{avgRating}</div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Avg Rating</div>
                    </div>
                </div>

                {/* Speed - Performance */}
                <div className="group p-5 md:p-6 rounded-[32px] bg-white border border-zinc-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform duration-300">
                            <Clock size={20} strokeWidth={2.5} />
                        </div>
                        <div className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">Top 5%</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-1">2.4<span className="text-lg text-zinc-400 font-medium ml-1">hrs</span></div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Avg Speed</div>
                    </div>
                </div>

                {/* Replied Rate */}
                <div className="group p-5 md:p-6 rounded-[32px] bg-white border border-zinc-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-violet-50 rounded-2xl text-violet-600 group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle2 size={20} strokeWidth={2.5} />
                        </div>
                        <div className="text-xs font-bold px-2 py-1 rounded-full bg-violet-100 text-violet-700">On Track</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-1">94<span className="text-lg text-zinc-400 font-medium">%</span></div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Replied</div>
                    </div>
                </div>
            </div>

            {/* STICKY FILTERS BAR */}
            <div className="sticky top-0 z-30 -mx-8 px-8 py-4 bg-[#FDFCF8]/95 backdrop-blur-sm border-b border-black/5 flex items-center justify-between gap-4 transition-all will-change-transform">

                {/* Left: Filters */}
                <div className="flex items-center gap-2 flex-wrap">
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

                {/* Right: Refresh */}
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => fetchReviews()} className="h-9 w-9 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100">
                        <RefreshCcw className="h-4 w-4" />
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
                    "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all capitalize border",
                    value !== 'all' || isOpen
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-900/10"
                        : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700 hover:shadow-sm"
                )}
            >
                <span>{label}</span>
                {value !== 'all' && <span className="opacity-80"> | {value}</span>}
                <ChevronDown size={12} className={cn("transition-transform ml-1", isOpen && "rotate-180")} />
            </button>

            {/* Click-based Dropdown */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-2 left-0 min-w-[140px] bg-white border border-zinc-100 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                        {options.map((opt: string) => (
                            <div
                                key={opt}
                                onClick={() => {
                                    onChange(opt)
                                    setIsOpen(false)
                                }}
                                className={cn(
                                    "px-3 py-2 text-xs font-medium rounded-xl cursor-pointer capitalize transition-colors flex items-center justify-between",
                                    value === opt ? "bg-zinc-50 text-zinc-900 font-bold" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
                                )}
                            >
                                {opt}
                                {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-[#E85C33]" />}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
