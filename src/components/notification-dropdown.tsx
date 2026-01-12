"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell } from "lucide-react"
import Link from "next/link"
import { useNotifications } from "@/components/notification-context"
import { cn } from "@/lib/utils"

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
                    "h-10 w-10 flex items-center justify-center rounded-full transition-all duration-200 outline-none",
                    isOpen ? "bg-[#E85C33]/10 text-[#E85C33]" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                )}
            >
                <Bell size={20} className={cn(isOpen && "fill-current")} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E85C33] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E85C33] border-2 border-white"></span>
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-[360px] md:w-[400px] bg-white border border-zinc-200/60 rounded-[32px] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.1)] z-50 overflow-hidden ring-1 ring-black/5 origin-top-right"
                    >
                        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white/50 backdrop-blur-xl sticky top-0 z-10">
                            <div>
                                <h3 className="font-bold text-zinc-900">Notifications</h3>
                                <p className="text-xs text-zinc-500 font-medium mt-0.5">You have {unreadCount} unread messages</p>
                            </div>
                            {unreadCount > 0 && (
                                <button className="text-[10px] font-bold text-[#E85C33] bg-[#FFF8F6] px-3 py-1.5 rounded-full hover:bg-[#E85C33] hover:text-white transition-colors">
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
                            {notifications.length === 0 ? (
                                <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
                                    <div className="h-16 w-16 rounded-full bg-zinc-50 flex items-center justify-center mb-4">
                                        <Bell size={24} className="text-zinc-300" />
                                    </div>
                                    <p className="font-bold text-zinc-900">All caught up!</p>
                                    <p className="text-sm text-zinc-500 mt-1 max-w-[200px]">We&apos;ll notify you when you receive new reviews or updates.</p>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className="block p-4 rounded-[20px] hover:bg-zinc-50 transition-all group relative border border-transparent hover:border-zinc-200/60"
                                    >
                                        <p className="text-sm text-zinc-700">{notif.message}</p>
                                        <p className="text-xs text-zinc-400 mt-1">{notif.createdAt}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-3 bg-zinc-50/50 border-t border-zinc-100">
                            <Link
                                href="/reviews"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-xs font-bold text-zinc-600 hover:text-zinc-900 hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-zinc-200 transition-all"
                            >
                                View all notifications
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
