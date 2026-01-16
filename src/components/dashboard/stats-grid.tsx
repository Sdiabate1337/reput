"use client"

import { motion } from "framer-motion"
import { MessageSquare, Star, TrendingUp, BarChart3, AlertTriangle, CheckCircle } from "lucide-react"

interface StatsGridProps {
    stats: {
        total: number
        sentimentCounts: { POSITIVE: number; NEUTRAL: number; NEGATIVE: number; CRITICAL: number }
        statusCounts: { OPEN: number; NEEDS_ATTENTION: number; CLOSED: number; CONVERTED: number }
    }
}

export function StatsGrid({ stats }: StatsGridProps) {
    // Calculate satisfaction rate (Positive + Neutral / Total with sentiment)
    // NOTE: Client considers "Bien" (Neutral) as Positive for satisfaction.
    const totalRated = stats.sentimentCounts.POSITIVE + stats.sentimentCounts.NEUTRAL + stats.sentimentCounts.NEGATIVE + stats.sentimentCounts.CRITICAL
    const positiveCount = stats.sentimentCounts.POSITIVE + stats.sentimentCounts.NEUTRAL

    const satisfactionRate = totalRated > 0
        ? Math.round((positiveCount / totalRated) * 100)
        : 0

    const cards = [
        {
            label: "Conversations",
            value: stats.total.toString(),
            icon: MessageSquare,
            color: "blue",
            subtext: `${stats.statusCounts.OPEN} en cours`
        },
        {
            label: "Taux de Satisfaction",
            value: `${satisfactionRate}%`,
            icon: TrendingUp,
            color: satisfactionRate >= 80 ? "green" : satisfactionRate >= 50 ? "yellow" : "red",
            subtext: `${positiveCount} positifs (incl. Bien)`
        },
        {
            label: "Avis Critiques",
            value: stats.sentimentCounts.CRITICAL.toString(),
            icon: AlertTriangle,
            color: "red",
            subtext: "Nécessitent attention"
        },
        {
            label: "Clients Récupérés",
            value: stats.statusCounts.CONVERTED.toString(),
            icon: CheckCircle,
            color: "emerald",
            subtext: "Transformés en positifs"
        },
    ]

    // Mobile Action Bar (Only shows if issues exist)
    const hasIssues = stats.sentimentCounts.CRITICAL > 0 || stats.sentimentCounts.NEGATIVE > 0

    return (
        <div className="mb-6 md:mb-8">
            {/* Mobile View: Action-Focused */}
            <div className="flex flex-col gap-3 md:hidden">
                {hasIssues ? (
                    <div className="grid grid-cols-2 gap-3">
                        {stats.sentimentCounts.CRITICAL > 0 && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex flex-col items-center text-center">
                                <AlertTriangle className="text-red-600 mb-1" size={20} />
                                <span className="text-2xl font-bold text-red-700">{stats.sentimentCounts.CRITICAL}</span>
                                <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Critiques</span>
                            </div>
                        )}
                        {stats.sentimentCounts.NEGATIVE > 0 && (
                            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex flex-col items-center text-center">
                                <TrendingUp className="text-orange-600 mb-1 rotate-180" size={20} />
                                <span className="text-2xl font-bold text-orange-700">{stats.sentimentCounts.NEGATIVE}</span>
                                <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Négatifs</span>
                            </div>
                        )}
                        {/* Fill space if only one type exists */}
                        {!(stats.sentimentCounts.CRITICAL > 0 && stats.sentimentCounts.NEGATIVE > 0) && (
                            <div className="bg-white border border-zinc-100 p-4 rounded-xl flex flex-col items-center justify-center text-center opacity-60">
                                <span className="text-sm text-zinc-400">Tout le reste semble OK</span>
                            </div>
                        )}
                    </div>
                ) : (
                    // Everything Good State
                    <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center justify-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Star className="text-green-600" size={16} fill="currentColor" />
                        </div>
                        <div>
                            <p className="font-bold text-green-800">Tout va bien !</p>
                            <p className="text-xs text-green-600">Aucun avis négatif à traiter.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop View: Full Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                        <div className="flex items-center gap-4">
                            {stat.label === "Taux de Satisfaction" ? (
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    {/* Simple Donut Chart */}
                                    <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#f4f4f5" // zinc-100
                                            strokeWidth="3"
                                        />
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke={satisfactionRate >= 80 ? "#22c55e" : satisfactionRate >= 50 ? "#eab308" : "#ef4444"}
                                            strokeWidth="3"
                                            strokeDasharray={`${satisfactionRate}, 100`}
                                            className="animate-[chart-grow_1s_ease-out_forwards]"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <TrendingUp size={16} className={satisfactionRate >= 80 ? "text-green-600" : satisfactionRate >= 50 ? "text-yellow-600" : "text-red-600"} />
                                    </div>
                                </div>
                            ) : (
                                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                                    <stat.icon size={24} />
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-zinc-500 font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                                {stat.subtext && (
                                    <p className="text-xs text-zinc-400 mt-1">{stat.subtext}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
