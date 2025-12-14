"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Check, MessageSquare, Star, ExternalLink, Inbox } from "lucide-react"
import Link from "next/link"
import { useNotifications } from "@/components/notification-context"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

export function NotificationDropdown() {
    const { unreadCount, notifications } = useNotifications()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "text-zinc-400 hover:text-zinc-600 transition-colors relative outline-none",
                    isOpen && "text-zinc-600"
                )}
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-zinc-950 shadow-sm animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/5"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full">
                                    {unreadCount} pending
                                </span>
                            )}
                        </div>

                        <div className="max-h-[320px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="py-12 px-6 text-center text-zinc-400 flex flex-col items-center">
                                    <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                                        <Bell size={16} className="text-zinc-300 dark:text-zinc-600" />
                                    </div>
                                    <p className="text-sm font-medium text-zinc-400">All caught up!</p>
                                    <p className="text-xs text-zinc-400 mt-1">No pending reviews.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {notifications.map((notif) => (
                                        <Link
                                            key={notif.id}
                                            href={`/reviews?id=${notif.id}`} // Assuming we handle query param or just simple nav
                                            onClick={() => setIsOpen(false)}
                                            className="block px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group relative"
                                        >
                                            <div className="flex gap-3">
                                                <div className="mt-0.5">
                                                    {/* Avatar or Source Icon */}
                                                    <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 ring-2 ring-white dark:ring-zinc-950 shadow-sm">
                                                        {(notif.author || '?').charAt(0)}
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate pr-2">
                                                            {notif.author || 'Unknown Author'}
                                                        </p>
                                                        <span className="text-[10px] text-zinc-400 whitespace-nowrap">
                                                            {/* Safe date formatting */}
                                                            {notif.date ? formatDistanceToNow(new Date(notif.date), { addSuffix: true }) : 'Just now'}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1 mb-1">
                                                        <div className="flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={8}
                                                                    className={i < (notif.rating || 0) ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200 dark:fill-zinc-800 dark:text-zinc-800"}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] text-zinc-400">•</span>
                                                        <span className="text-[10px] text-zinc-500 capitalize">{notif.source}</span>
                                                    </div>

                                                    <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                                                        {notif.content}
                                                    </p>

                                                    <div className="mt-2 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 group-hover:underline flex items-center gap-1">
                                                        Review & Reply <ExternalLink size={10} />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Status Dot */}
                                            <div className="absolute top-4 left-2 w-1.5 h-1.5 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-zinc-950 pointer-events-none" />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                            <Link
                                href="/reviews"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                View all reviews
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
