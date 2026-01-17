"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Star,
    MoreHorizontal,
    RefreshCw,
    CheckCircle2,
    Pencil,
    MessageSquare,
    AlertCircle,
    Archive,
    Sparkles,
    RotateCw,
    Send,
    Copy,
    ArrowUpRight,
    Loader2
} from "lucide-react"
import { format } from "date-fns"
import { Review, ReviewStatus } from "@/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CardHeader, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ReviewCardProps {
    review: Review;
    onStatusChange: (id: string, newStatus: ReviewStatus) => void;
}

export function ReviewCard({ review, onStatusChange }: ReviewCardProps) {
    // AI Logic removed due to n8n deprecation

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            whileHover={{ y: -4 }}
            className="group h-full"
        >
            <div className="relative h-full flex flex-col bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-zinc-100 hover:border-orange-100/50 hover:shadow-[0_12px_32px_rgba(232,92,51,0.08)] transition-all duration-300 overflow-hidden">

                {/* Sentiment Indicator Line */}
                <div className={cn("absolute top-0 left-0 w-full h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    review.sentiment === 'positive' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" :
                        review.sentiment === 'negative' ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : "bg-orange-400"
                )} />

                <CardHeader className="flex flex-row items-start justify-between px-5 pt-5 pb-2 space-y-0 relative z-10">
                    <div className="flex gap-3.5">
                        <div className="relative shrink-0">
                            {/* Avatar with Ring */}
                            <div className={cn(
                                "rounded-full p-[1.5px] transition-all duration-300",
                                review.sentiment === 'positive' ? "bg-gradient-to-b from-emerald-400 to-transparent" :
                                    review.sentiment === 'negative' ? "bg-gradient-to-b from-rose-400 to-transparent" : "bg-gradient-to-b from-orange-300 to-transparent"
                            )}>
                                <Avatar className="h-10 w-10 border-2 border-white dark:border-zinc-900">
                                    <AvatarImage src={review.avatarUrl} alt={review.author} />
                                    <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs font-medium">{review.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Platform Icon Badge */}
                            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-0.5 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                                <div className={cn(
                                    "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white",
                                    review.source === 'google' ? "bg-[#4285F4]" :
                                        review.source === 'booking' ? "bg-[#003580]" : "bg-zinc-500"
                                )}>
                                    {review.source === 'google' ? 'G' : 'B'}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col pt-0.5">
                            <h3 className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none mb-1.5">
                                {review.author}
                            </h3>
                            <div className="flex items-center gap-1.5">
                                <div className="flex -space-x-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "h-3 w-3",
                                                i < review.rating ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200 dark:fill-zinc-800 dark:text-zinc-800"
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-[11px] text-zinc-400 font-medium">
                                    {new Date(review.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Archive Action */}
                    <button
                        onClick={() => onStatusChange(review.id, 'archived')}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1 -mr-2 opacity-0 group-hover:opacity-100"
                        title="Archive"
                    >
                        <Archive size={16} />
                    </button>
                </CardHeader>

                <CardContent className="px-5 pb-4 flex-1 relative z-10">
                    <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-4">
                        <span className="text-zinc-300 dark:text-zinc-600 mr-1">“</span>
                        {review.content}
                        <span className="text-zinc-300 dark:text-zinc-600 ml-1">”</span>
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                        {review.tags.map(tag => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60 tracking-wide"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </CardContent>

                {/* Published Response Section */}
                {review.status === 'published' && (review.publishedResponse || review.draftResponse) && (
                    <div className="px-5 pb-5">
                        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 dark:bg-zinc-800/30 dark:border-zinc-700/30">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Published</span>
                            </div>
                            <p className="text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap pl-6 border-l-2 border-zinc-200 ml-1">
                                {review.publishedResponse || review.draftResponse}
                            </p>
                        </div>
                    </div>
                )}

                {/* Additional Footer if needed */}
                <div className="px-5 py-4 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-black/20">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        {review.source} review
                    </span>
                    <Button variant="ghost" size="sm" className="h-6 text-[11px] text-zinc-400 hover:text-[#E85C33] hover:bg-orange-50 transition-colors">
                        View Thread <ArrowUpRight size={12} className="ml-1" />
                    </Button>
                </div>

            </div>
        </motion.div>
    )
}
