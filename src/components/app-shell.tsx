"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    MessageSquare,
    Settings,
    Menu,
    Bell,
    Search,
    X,
    CreditCard,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import { useNotifications } from "@/components/notification-context"
import { NotificationDropdown } from "@/components/notification-dropdown"

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    // Auto-close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    // Landing Page - Full Screen, Native Scroll (Fixes Framer Motion useScroll & Layout Constraints)
    if (pathname === "/") {
        return (
            <div className="font-sans antialiased text-zinc-900 dark:text-zinc-50">
                {children}
            </div>
        )
    }

    return (
        <div className="relative z-10 flex h-screen w-full font-sans antialiased text-zinc-900 dark:text-zinc-50">

            {/* DESKTOP SIDEBAR */}
            {pathname !== "/login" && pathname !== "/onboarding" && pathname !== "/" && (
                <aside className="w-[260px] border-r border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-xl flex-col hidden md:flex z-50">
                    <SidebarContent pathname={pathname} />
                </aside>
            )}

            {/* MOBILE SIDEBAR OVERLAY */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 z-50 flex flex-col md:hidden shadow-2xl"
                        >
                            <div className="absolute top-4 right-4">
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <SidebarContent pathname={pathname} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                {/* HEADER */}
                {pathname !== "/login" && pathname !== "/onboarding" && pathname !== "/" && (
                    <header className="h-[60px] border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 transition-all">

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Search Bar - Modernized */}
                        <div className="hidden md:flex items-center gap-2 group">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-9 pr-8 py-1.5 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-lg border border-transparent focus:bg-white focus:border-zinc-200 focus:shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all w-64 text-sm outline-none placeholder:text-zinc-400 font-medium"
                                />
                                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-px rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[9px] font-bold text-zinc-400 shadow-sm">⌘K</div>
                            </div>
                        </div>

                        {/* Right User Actions */}
                        <div className="flex items-center gap-4 ml-auto md:ml-0">
                            <NotificationDropdown />
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-100 p-[1px] cursor-pointer ring-offset-2 hover:ring-2 ring-black/5 transition-all shadow-sm">
                                <img
                                    src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'User'}`}
                                    alt="User"
                                    className="h-full w-full rounded-full bg-white object-cover"
                                />
                            </div>
                        </div>
                    </header>
                )}

                {/* PAGE CONTENT CONTAINER */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-6xl mx-auto w-full h-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}

function SidebarContent({ pathname }: { pathname: string }) {
    const { logout } = useAuth()
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    return (
        <>
            <div className="h-[60px] flex items-center px-6">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-zinc-900 flex items-center justify-center text-white font-bold shadow-sm">
                        <span className="text-xs">R</span>
                    </div>
                    <span className="font-bold text-[15px] tracking-tight text-zinc-900 dark:text-zinc-100">Reput.ai</span>
                </div>
            </div>

            <div className="px-3 py-6 space-y-0.5 overflow-y-auto flex-1">
                <div className="text-[10px] font-semibold text-zinc-400 mb-2 px-3 uppercase tracking-widest">General</div>

                <NavLink href="/dashboard" icon={<LayoutDashboard size={15} />} label="Overview" active={pathname === '/dashboard'} />
                <NavLink href="/reviews" icon={<MessageSquare size={15} />} label="Inbox" active={pathname === '/reviews'} />
                <NavLink href="/settings" icon={<Settings size={15} />} label="Settings" active={pathname === '/settings'} />
            </div>

            <div className="p-3 mt-auto">
                <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 dark:hover:text-red-400 transition-all duration-200"
                >
                    <LogOut size={15} />
                    <span>Log out</span>
                </button>
            </div>

            <div className="p-4 relative">
                <div className="p-4 rounded-xl border border-black/5 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <CreditCard size={14} />
                            </div>
                            <div>
                                <p className="text-[13px] font-semibold text-zinc-800">Pro Plan</p>
                                <p className="text-[10px] text-zinc-500">12 days left</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-zinc-900 h-full w-[65%] rounded-full" />
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-2 font-medium">1,240 / 2,000 credits used</p>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={logout}
                title="Log out"
                description="Are you sure you want to log out of your account?"
                confirmText="Log out"
                variant="danger"
            />
        </>
    )
}

function NavLink({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 border border-transparent",
                active
                    ? "bg-white text-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-black/5"
            )}
        >
            <span className={cn("transition-colors", active ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600")}>{icon}</span>
            <span>{label}</span>
        </Link>
    )
}
