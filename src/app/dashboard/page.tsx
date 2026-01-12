"use client"

import { motion } from "framer-motion"
import { BarChart3, MessageSquare, Star, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#FDFCF8] p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
                        <p className="text-zinc-500">Bienvenue sur votre tableau de bord</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: "Conversations", value: "0", icon: MessageSquare, color: "orange" },
                        { label: "Note Moyenne", value: "N/A", icon: Star, color: "yellow" },
                        { label: "Taux de Satisfaction", value: "N/A", icon: TrendingUp, color: "green" },
                        { label: "Réponses IA", value: "0", icon: BarChart3, color: "blue" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-12 text-center">
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="text-[#E85C33]" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-2">Aucune conversation</h2>
                    <p className="text-zinc-500 mb-6">
                        Configurez votre établissement pour commencer à collecter des avis
                    </p>
                    <Link
                        href="/onboarding"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#E85C33] text-white font-bold rounded-xl hover:bg-[#d54d26] transition-colors"
                    >
                        Configurer mon établissement
                    </Link>
                </div>
            </div>
        </div>
    )
}
