"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie
} from "recharts"
import {
    TrendingUp, TrendingDown, Users, Star,
    Calendar, Download, ChevronDown, Activity, Globe, MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { format, subDays, startOfDay, parseISO } from "date-fns"

export default function DashboardPage() {
    const [dateRange, setDateRange] = useState("Last 30 Days") // Default to 30 for better data view
    const [loading, setLoading] = useState(true)

    // State for Metrics
    const [metrics, setMetrics] = useState({
        totalReviews: 0,
        avgRating: "0.0",
        sentimentScore: 0,
        pendingCount: 0
    })

    // State for Charts
    const [trendData, setTrendData] = useState<any[]>([])
    const [platformData, setPlatformData] = useState<any[]>([])

    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)

            // Fetch ALL reviews for the business to calculate accurate aggregates
            // In a real app with uniform massive data, we'd use RPC or materialized views
            const { data: reviews, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('business_id', '00000000-0000-0000-0000-000000000001')
                .order('created_at', { ascending: true })

            if (error) {
                console.error("Error fetching dashboard data:", error)
                setLoading(false)
                return
            }

            if (!reviews || reviews.length === 0) {
                setLoading(false)
                return
            }

            // 1. Calculate Core Metrics
            const total = reviews.length
            const sumRating = reviews.reduce((acc, r) => acc + (r.rating || 0), 0)
            const avg = total > 0 ? (sumRating / total).toFixed(1) : "0.0"

            const sumSentiment = reviews.reduce((acc, r) => acc + (r.ai_sentiment_score || 0), 0)
            const avgSentiment = total > 0 ? Math.round(sumSentiment / total) : 0

            // Pending Logic: Check for raw Supabase statuses
            const pending = reviews.filter(r =>
                r.status === 'PENDING_ANALYSIS' ||
                r.status === 'PENDING_VALIDATION'
            ).length

            setMetrics({
                totalReviews: total,
                avgRating: avg,
                sentimentScore: avgSentiment,
                pendingCount: pending
            })

            // 2. Calculate Platform Distribution
            const platformCounts: Record<string, number> = {}
            reviews.forEach(r => {
                const p = r.platform?.toLowerCase() || 'other'
                platformCounts[p] = (platformCounts[p] || 0) + 1
            })

            const PLATFORM_COLORS: Record<string, string> = {
                google: '#4285F4',
                booking: '#003580',
                tripadvisor: '#00AF87',
                facebook: '#1877F2',
                instagram: '#E1306C',
                yelp: '#FF1A1A',
                other: '#71717A'
            }

            const pData = Object.entries(platformCounts).map(([name, count]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
                value: Math.round((count / total) * 100), // Percentage
                count: count,
                color: PLATFORM_COLORS[name] || PLATFORM_COLORS.other
            })).sort((a, b) => b.value - a.value)

            setPlatformData(pData)

            // 3. Calculate Trend Data (Daily Aggregation)
            // Group by Date (YYYY-MM-DD)
            const dailyGroups: Record<string, { totalRating: number, count: number }> = {}

            // Initialize last 30 days with 0 to show gaps (optional, but looks better)
            // For now, let's just map existing data for simplicity and accuracy
            reviews.forEach(r => {
                const date = r.review_date ? r.review_date.split('T')[0] : r.created_at.split('T')[0]
                if (!dailyGroups[date]) {
                    dailyGroups[date] = { totalRating: 0, count: 0 }
                }
                dailyGroups[date].totalRating += r.rating || 0
                dailyGroups[date].count += 1
            })

            const tData = Object.entries(dailyGroups)
                .map(([date, stats]) => ({
                    name: format(parseISO(date), 'd MMM'), // "12 Dec"
                    fullDate: date,
                    rating: parseFloat((stats.totalRating / stats.count).toFixed(1)),
                    reviews: stats.count
                }))
                .sort((a, b) => a.fullDate.localeCompare(b.fullDate))
                // Slice based on rudimentary date range logic if needed, or show all
                // Showing last 14 points for cleanliness in the chart
                .slice(-14)

            setTrendData(tData)
            setLoading(false)
        }

        fetchData()
    }, [supabase])

    return (
        <div className="space-y-8 pb-10">
            {/* DASHBOARD HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Overview</h1>
                    <p className="text-zinc-500 text-sm font-medium">Track your reputation performance in real-time.</p>
                </div>
                <div className="flex items-center gap-2">
                    <DateRangeDropdown value={dateRange} onChange={setDateRange} />
                    <Button className="h-9 bg-zinc-900 text-white hover:bg-zinc-800 text-xs shadow-lg shadow-zinc-500/10">
                        <Download className="mr-2 h-3.5 w-3.5" />
                        Export Report
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />)}
                </div>
            ) : (
                /* PULSE METRICS */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Global Rating"
                        value={metrics.avgRating}
                        subValue="Based on all reviews"
                        icon={Star}
                        trend="up"
                        iconColor="text-amber-500"
                    />
                    <MetricCard
                        title="Total Reviews"
                        value={metrics.totalReviews}
                        subValue="Lifetime count"
                        icon={Users}
                        trend="up"
                        iconColor="text-blue-500"
                    />
                    <MetricCard
                        title="Sentiment Score"
                        value={`${metrics.sentimentScore}%`}
                        subValue="AI calculated average"
                        icon={Activity}
                        trend={metrics.sentimentScore > 70 ? "up" : "down"}
                        iconColor="text-emerald-500"
                    />
                    <MetricCard
                        title="Pending Actions"
                        value={metrics.pendingCount}
                        subValue="Requires validations"
                        icon={MessageSquare}
                        trend={metrics.pendingCount > 0 ? "down" : "up"}
                        iconColor="text-rose-500"
                        trendLabel={metrics.pendingCount > 0 ? "Urgent" : "Clear"}
                        inverseTrend
                    />
                </div>
            )}

            {/* MAIN CHART SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* REPUTATION TREND */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-black/5 dark:border-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
                    <div className="relative z-10 mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Reputation Trend</h3>
                            <p className="text-xs text-zinc-500">Average rating fluctuation (Last 14 activity days).</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Simple trend indicator based on last point */}
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                                <TrendingUp size={12} className="text-emerald-600 dark:text-emerald-400" />
                                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Live Data</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[300px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#a1a1aa"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#a1a1aa"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={[0, 5]}
                                    tickCount={6}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: '1px solid #e4e4e7',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="rating"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRating)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* PLATFORM BREAKDOWN */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-black/5 dark:border-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
                    <h3 className="relative z-10 text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Source Breakdown</h3>

                    {loading ? (
                        <div className="h-[200px] flex items-center justify-center">
                            <div className="h-32 w-32 rounded-full border-4 border-zinc-100 border-t-zinc-300 animate-spin" />
                        </div>
                    ) : platformData.length > 0 ? (
                        <>
                            <div className="h-[200px] w-full relative z-10 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={platformData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {platformData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Metric */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <span className="block text-2xl font-bold text-zinc-900 dark:text-zinc-100">{metrics.totalReviews}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Total</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3 relative z-10">
                                {platformData.map(p => (
                                    <div key={p.name} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                            <span className="text-zinc-600 dark:text-zinc-400 font-medium">{p.name}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-zinc-400">{p.count}</span>
                                            <span className="text-zinc-900 dark:text-zinc-100 font-bold">{p.value}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-[200px] flex flex-col items-center justify-center text-zinc-400">
                            <p className="text-xs">No platform data yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function DateRangeDropdown({ value, onChange }: { value: string, onChange: (v: string) => void }) {
    const [isOpen, setIsOpen] = useState(false)
    const options = ["Last 24 Hours", "Last 7 Days", "Last 30 Days", "This Quarter", "This Year"]

    return (
        <div className="relative">
            <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className="h-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs font-medium"
            >
                <Calendar className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                {value}
                <ChevronDown className={cn("ml-2 h-3.5 w-3.5 opacity-50 transition-transform", isOpen && "rotate-180")} />
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-2 right-0 w-48 bg-white/90 backdrop-blur-xl border border-zinc-200/60 rounded-lg shadow-xl p-1 z-50 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100 slide-in-from-top-2">
                        {options.map((opt) => (
                            <div
                                key={opt}
                                onClick={() => {
                                    onChange(opt)
                                    setIsOpen(false)
                                }}
                                className={cn(
                                    "px-3 py-2 text-xs rounded-md cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors",
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

function MetricCard({ title, value, subValue, icon: Icon, trend, iconColor, trendLabel, inverseTrend }: any) {
    const isPositive = trend === 'up'
    const trendColor = inverseTrend
        ? (isPositive ? 'text-rose-500' : 'text-emerald-500')
        : (isPositive ? 'text-emerald-500' : 'text-rose-500')
    const TrendIcon = isPositive ? TrendingUp : TrendingDown

    return (
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800", iconColor)}>
                    <Icon size={18} />
                </div>
                {trend && (
                    <div className={cn("flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-50 dark:bg-zinc-800", trendColor)}>
                        {trendLabel || (isPositive ? 'Trending up' : 'Attention')}
                        <TrendIcon size={10} />
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{value}</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">{subValue}</p>
            </div>
        </div>
    )
}
