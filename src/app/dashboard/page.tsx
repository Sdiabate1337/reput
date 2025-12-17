"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie
} from "recharts"
import {
    TrendingUp, TrendingDown, Users, Star,
    Calendar, Download, ChevronDown, Activity, Globe, MessageSquare, ArrowRight, ArrowUpRight, Share2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
// Ensure createClient is imported from the correct path. It was used in previous file.
import { createClient } from "@/lib/supabase/client"
import { format, parseISO } from "date-fns"
import Link from "next/link"
import { ReputationShowcaseModal } from "@/components/reputation-showcase-modal"

export default function DashboardPage() {
    const [dateRange, setDateRange] = useState("Last 30 Days")
    const [loading, setLoading] = useState(true)
    const [isShowcaseOpen, setIsShowcaseOpen] = useState(false)
    const [reviews, setReviews] = useState<any[]>([]) // Store raw reviews for "Recent Activity"
    const [stats, setStats] = useState({
        avgRating: "0.0",
        totalReviews: 0,
        sentimentScore: 0,
        pendingCount: 0,
        responseRate: "0%"
    })
    const [trendData, setTrendData] = useState<any[]>([])
    const [platformData, setPlatformData] = useState<any[]>([])

    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const { data: rawReviews, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('business_id', '00000000-0000-0000-0000-000000000001')
                .order('created_at', { ascending: false })

            if (error || !rawReviews) {
                console.error("Error:", error)
                setLoading(false)
                return
            }

            setReviews(rawReviews)

            // Metrics
            const total = rawReviews.length
            const sumRating = rawReviews.reduce((acc, r) => acc + (r.rating || 0), 0)
            const avg = total > 0 ? (sumRating / total).toFixed(1) : "0.0"

            const pending = rawReviews.filter(r => r.status === 'PENDING_ANALYSIS' || r.status === 'PENDING_VALIDATION').length
            const replied = rawReviews.filter(r => r.status?.includes('PUBLISHED')).length
            const responseRate = total > 0 ? Math.round((replied / total) * 100) : 0

            const sentimentSum = rawReviews.reduce((acc, r) => acc + (r.ai_sentiment_score || 0), 0)
            const sentimentAvg = total > 0 ? Math.round(sentimentSum / total) : 0

            setStats({
                avgRating: avg,
                totalReviews: total,
                sentimentScore: sentimentAvg,
                pendingCount: pending,
                responseRate: `${responseRate}%`
            })

            // Trend Data (Daily)
            const dailyGroups: Record<string, { total: number, count: number }> = {}
            rawReviews.forEach(r => {
                const d = (r.review_date || r.created_at).split('T')[0]
                if (!dailyGroups[d]) dailyGroups[d] = { total: 0, count: 0 }
                dailyGroups[d].total += r.rating || 0
                dailyGroups[d].count += 1
            })

            const tData = Object.entries(dailyGroups)
                .map(([date, d]) => ({
                    date: format(parseISO(date), 'MMM d'),
                    fullDate: date,
                    rating: parseFloat((d.total / d.count).toFixed(1)),
                    count: d.count
                }))
                .sort((a, b) => a.fullDate.localeCompare(b.fullDate))
                .slice(-14)

            setTrendData(tData)

            // Platform Data
            const pCounts: Record<string, number> = {}
            rawReviews.forEach(r => {
                const p = r.platform?.toLowerCase() || 'other'
                pCounts[p] = (pCounts[p] || 0) + 1
            })
            const pData = Object.entries(pCounts).map(([k, v]) => ({
                name: k.charAt(0).toUpperCase() + k.slice(1),
                value: v,
                color: k === 'google' ? '#4285F4' : k === 'booking' ? '#003580' : '#71717A'
            })).sort((a, b) => b.value - a.value)
            setPlatformData(pData)

            setLoading(false)
        }
        fetchData()
    }, [])

    return (
        <div className="space-y-8 pb-12 w-full max-w-[1600px] mx-auto">
            {/* Header */}
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
                    <p className="text-zinc-500 font-medium mt-1">Good afternoon, here is your reputation at a glance.</p>
                </div>

                {/* Actions Toolbar - Mobile Optimized */}
                <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full xl:w-auto">
                    {/* Primary Action - Full Width on Mobile */}
                    <Button
                        onClick={() => setIsShowcaseOpen(true)}
                        className="col-span-2 sm:col-span-1 h-11 sm:h-10 bg-[#E85C33] text-white hover:bg-[#d94a20] shadow-lg shadow-orange-500/20 border-none w-full sm:w-auto"
                    >
                        <Share2 className="mr-2 h-4 w-4" />
                        Showcase Reputation
                    </Button>

                    {/* Secondary Actions - Split Row on Mobile */}
                    <DateRangeDropdown
                        value={dateRange}
                        onChange={setDateRange}
                        className="col-span-1 w-full sm:w-auto"
                    />

                    <Button variant="outline" className="col-span-1 h-10 border-dashed border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400 w-full sm:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            <ReputationShowcaseModal
                isOpen={isShowcaseOpen}
                onClose={() => setIsShowcaseOpen(false)}
                reviews={reviews}
                avgRating={stats.avgRating}
            />

            {loading ? (
                <DashboardSkeleton />
            ) : (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6"
                >
                    {/* 1. HERO SCORE CARD (Span 4) */}
                    <motion.div
                        variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                        whileHover={{ scale: 1.01, transition: { type: "spring", stiffness: 300 } }}
                        className="md:col-span-4 bg-white rounded-3xl p-8 border border-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden group hover:border-amber-100 transition-colors cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-amber-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-amber-100/50 text-amber-600 rounded-xl">
                                    <Star size={18} fill="currentColor" />
                                </div>
                                <span className="font-bold text-amber-900/60 uppercase tracking-widest text-xs">Trust Score</span>
                            </div>
                            <h2 className="text-6xl font-extrabold text-zinc-900 tracking-tighter mt-4">{stats.avgRating}</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-zinc-400 font-medium text-sm">out of 5.0</span>
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                                    <TrendingUp size={10} /> +0.2 this week
                                </span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex justify-between text-sm font-medium mb-2">
                                <span className="text-zinc-500">Response Rate</span>
                                <span className="text-zinc-900">{stats.responseRate}</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <div className="h-full bg-zinc-900 rounded-full" style={{ width: stats.responseRate }} />
                            </div>
                        </div>
                    </motion.div>

                    {/* 2. INBOX ACTION CARD (Span 4) - Dark/Orange Accent */}
                    <motion.div
                        variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                        whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
                        className="md:col-span-4 bg-[#E85C33] rounded-3xl p-8 text-white shadow-lg shadow-orange-500/20 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <MessageSquare size={18} className="text-white" />
                                </div>
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/10">Action Required</span>
                            </div>

                            <div className="mt-8">
                                <div className="text-5xl font-bold tracking-tight">{stats.pendingCount}</div>
                                <p className="text-orange-100 font-medium mt-1">Pending Reviews</p>
                            </div>
                        </div>

                        <Link href="/reviews" className="mt-8 w-full bg-white text-[#E85C33] h-12 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-50 transition-colors shadow-sm relative z-10">
                            Go to Inbox <ArrowRight size={16} />
                        </Link>
                    </motion.div>

                    {/* 3. PLATFORM BREAKDOWN (Span 4) */}
                    <motion.div
                        variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                        whileHover={{ scale: 1.01, transition: { type: "spring", stiffness: 300 } }}
                        className="md:col-span-4 bg-white rounded-3xl p-8 border border-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col hover:border-zinc-200 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                <Globe size={18} />
                            </div>
                            <span className="font-bold text-zinc-400 uppercase tracking-widest text-xs">Sources</span>
                        </div>

                        <div className="space-y-4 flex-1">
                            {platformData.slice(0, 3).map((p, i) => (
                                <div key={p.name} className="group/item">
                                    <div className="flex justify-between text-sm font-medium mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                            <span className="text-zinc-700">{p.name}</span>
                                        </div>
                                        <span className="text-zinc-900">{p.value}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(p.value / stats.totalReviews) * 100}%` }}
                                            transition={{ delay: 0.5 + (i * 0.1), duration: 0.8, ease: "easeOut" }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: p.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 4. MAIN TREND CHART (Span 8) */}
                    <motion.div
                        variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                        whileHover={{ scale: 1.01, transition: { type: "spring", stiffness: 300 } }}
                        className="md:col-span-8 bg-white rounded-3xl p-8 border border-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[400px] flex flex-col hover:border-zinc-200 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900">Reputation Trend</h3>
                                <p className="text-zinc-500 text-sm">Rating evolution over the last 14 days</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold">Rating</div>
                                <div className="px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-400 text-xs font-medium">Volume</div>
                            </div>
                        </div>

                        <div className="flex-1 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#E85C33" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#E85C33" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                                    <XAxis dataKey="date" stroke="#d4d4d8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#d4d4d8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 5]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                                        cursor={{ stroke: '#E85C33', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="rating"
                                        stroke="#E85C33"
                                        strokeWidth={3}
                                        fill="url(#chartGradient)"
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* 5. RECENT ACTIVITY LIST (Span 4) */}
                    <motion.div
                        variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                        whileHover={{ scale: 1.01, transition: { type: "spring", stiffness: 300 } }}
                        className="md:col-span-4 bg-white rounded-3xl p-8 border border-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col hover:border-zinc-200 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-zinc-900">Recent Activity</h3>
                            <Link href="/reviews" className="p-2 bg-zinc-50 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
                                <ArrowUpRight size={18} />
                            </Link>
                        </div>

                        <div className="space-y-6 overflow-hidden relative">
                            {reviews.slice(0, 4).map((r, i) => (
                                <div key={r.id || i} className="flex gap-4 items-start group/item">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full mt-2 shrink-0",
                                        r.rating >= 4 ? "bg-emerald-500" : r.rating <= 2 ? "bg-rose-500" : "bg-amber-500"
                                    )} />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-zinc-900 truncate pr-4">"{r.review_text?.substring(0, 60) || "No text"}..."</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-zinc-400 font-medium">{r.reviewer_name || "Guest"}</span>
                                            <span className="text-[10px] text-zinc-300">•</span>
                                            <span className="text-xs text-zinc-400">{r.platform}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Fade out bottom */}
                            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}


function DateRangeDropdown({ value, onChange, className }: any) {
    const [isOpen, setIsOpen] = useState(false)
    const options = ["Last 24 Hours", "Last 7 Days", "Last 30 Days", "This Year"]

    return (
        <div className={cn("relative", className)}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full h-10 px-4 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 flex items-center justify-between gap-2 hover:bg-zinc-50 transition-colors whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-zinc-400" />
                    {value}
                </div>
                <ChevronDown size={14} className="text-zinc-400 opacity-50" />
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-full min-w-[180px] bg-white border border-zinc-100 rounded-xl shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                        {options.map(opt => (
                            <button key={opt} onClick={() => { onChange(opt); setIsOpen(false) }} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-zinc-50 text-zinc-600 font-medium">
                                {opt}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

function DashboardSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-pulse">
            <div className="md:col-span-4 h-[300px] bg-zinc-100 rounded-3xl" />
            <div className="md:col-span-4 h-[300px] bg-zinc-100 rounded-3xl" />
            <div className="md:col-span-4 h-[300px] bg-zinc-100 rounded-3xl" />
            <div className="md:col-span-8 h-[400px] bg-zinc-100 rounded-3xl" />
            <div className="md:col-span-4 h-[400px] bg-zinc-100 rounded-3xl" />
        </div>
    )
}

