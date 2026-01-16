"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Clock, ArrowRight, Filter } from "lucide-react"
import Link from "next/link"
import type { Conversation, ConversationMessage, Sentiment } from "@/types/database"
import { formatSmartDate } from "@/lib/utils"
import { ConversationSheet } from "@/components/dashboard/conversation-sheet"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface RecentActivityProps {
    conversations: Conversation[]
    initialConversationId?: string | null
}

type FilterType = 'ALL' | 'POSITIVE' | 'NEGATIVE' | 'CRITICAL'

export function RecentActivity({ conversations, initialConversationId }: RecentActivityProps) {
    const router = useRouter()
    const [selectedId, setSelectedId] = useState<string | null>(initialConversationId || null)
    const [filter, setFilter] = useState<FilterType>('ALL')

    const selectedConversation = conversations.find(c => c.id === selectedId) || null

    // Filter logic
    const filteredConversations = conversations.filter(c => {
        if (filter === 'ALL') return true
        if (filter === 'POSITIVE') return c.sentiment === 'POSITIVE' || c.sentiment === 'NEUTRAL' // "Bien" is technically Neutral but client wants it as Positive
        return c.sentiment === filter
    })

    const handleRefresh = () => {
        router.refresh()
    }

    return (
        <div className="w-full pb-20 md:pb-0">
            {/* Filter Bar (Scrollable) */}
            <div className="sticky top-0 bg-[#FDFCF8]/95 backdrop-blur-sm z-10 py-2 mb-1">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                    {(['ALL', 'POSITIVE', 'NEGATIVE', 'CRITICAL'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex-shrink-0 text-[13px] px-4 py-1.5 rounded-full font-medium transition-all duration-200 border ${filter === f
                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                                : 'bg-white text-zinc-600 border-zinc-200'
                                }`}
                        >
                            {f === 'ALL' ? 'Tous' : f === 'POSITIVE' ? 'Positifs' : f === 'NEGATIVE' ? 'Négatifs' : 'Critiques'}
                        </button>
                    ))}
                </div>
            </div>

            {filteredConversations.length === 0 ? (
                <div className="text-center py-24 flex flex-col items-center justify-center opacity-60">
                    <MessageSquare size={40} className="text-zinc-300 mb-4" />
                    <p className="text-zinc-500 font-medium">Aucune discussion</p>
                </div>
            ) : (
                <div className="flex flex-col bg-white border border-zinc-100 divide-y divide-zinc-50 rounded-xl md:rounded-2xl md:border">
                    {filteredConversations.map((conv, i) => {
                        // Find the last CLIENT message to show context
                        const clientMessages = conv.messages.filter(m => (m as ConversationMessage).role === 'client')
                        const lastClientMessage = clientMessages.length > 0 ? clientMessages[clientMessages.length - 1] : null
                        const lastMessage = conv.messages[conv.messages.length - 1] as ConversationMessage

                        // Prefer client message, fallback to last message (e.g. system/assistant only)
                        const displayMessage = lastClientMessage || lastMessage

                        // Logic for grouping: Positive + Neutral = Green (Positive)
                        const isPositive = conv.sentiment === 'POSITIVE' || conv.sentiment === 'NEUTRAL'
                        const isCritical = conv.sentiment === 'CRITICAL'
                        const isNegative = conv.sentiment === 'NEGATIVE'

                        return (
                            <motion.div
                                key={conv.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.02 }}
                                onClick={() => setSelectedId(conv.id)}
                                className="flex gap-4 px-4 py-4 md:px-4 md:py-5 active:bg-zinc-50 transition-colors cursor-pointer relative"
                            >
                                {/* Avatar */}
                                <div className="relative shrink-0 pt-1">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-sm transition-transform active:scale-95
                                    ${isPositive ? 'bg-gradient-to-br from-green-50 to-green-100 text-green-700' :
                                            isCritical ? 'bg-gradient-to-br from-red-50 to-red-100 text-red-700' :
                                                isNegative ? 'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700' : // Negative -> Orange/Red
                                                    'bg-zinc-50 text-zinc-500' // Fallback
                                        }`}
                                    >
                                        {conv.client_name ? conv.client_name[0].toUpperCase() : '?'}
                                    </div>
                                    {isCritical && (
                                        <div className="absolute top-1 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pr-1">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h3 className={`font-semibold text-[16px] truncate tracking-tight ${isCritical ? 'text-zinc-900' : 'text-zinc-900'}`}>
                                            {conv.client_name || conv.client_phone}
                                        </h3>
                                        <span className={`text-[12px] font-medium whitespace-nowrap ${isCritical ? 'text-red-500' : 'text-zinc-400'}`}>
                                            {formatSmartDate(conv.updated_at)}
                                        </span>
                                    </div>

                                    <p className={`text-[14px] truncate ${conv.status === 'CONVERTED' ? 'text-green-600 font-medium' : conv.status === 'NEEDS_ATTENTION' ? 'text-orange-600 font-medium' : displayMessage?.role === 'client' ? 'text-zinc-700 font-medium' : 'text-zinc-400 italic'}`}>
                                        {/* Override display for Converted/NeedsAttention to show status instead of "ok" */}
                                        {conv.status === 'CONVERTED' ? (
                                            <span className="flex items-center gap-1">
                                                <span>⭐ Avis positif ! Lien envoyé.</span>
                                            </span>
                                        ) : conv.status === 'NEEDS_ATTENTION' && conv.sentiment === 'NEUTRAL' ? (
                                            <span className="flex items-center gap-1">
                                                <span>🤔 Avis mitigé. Feedback demandé.</span>
                                            </span>
                                        ) : conv.status === 'NEEDS_ATTENTION' && conv.sentiment === 'NEGATIVE' ? (
                                            <span className="flex items-center gap-1">
                                                <span>⚠️ Avis négatif. Déçu.</span>
                                            </span>
                                        ) : displayMessage ? (
                                            <>
                                                {/* Mobile: 15 chars max */}
                                                <span className="md:hidden">
                                                    {displayMessage.role === 'assistant' ? 'Vous: ' : ''}
                                                    {displayMessage.content.length > 15
                                                        ? displayMessage.content.slice(0, 15) + '...'
                                                        : displayMessage.content}
                                                </span>
                                                {/* Desktop: Full text (truncated by CSS) */}
                                                <span className="hidden md:inline">
                                                    {displayMessage.role === 'assistant' && <span>Vous: </span>}
                                                    {displayMessage.content}
                                                </span>
                                            </>
                                        ) : 'Nouvelle conversation'}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}

            <ConversationSheet
                conversation={selectedConversation}
                isOpen={!!selectedId}
                onClose={() => setSelectedId(null)}
                onUpdate={handleRefresh}
            />
        </div>
    )
}
