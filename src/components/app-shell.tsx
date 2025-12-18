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
        <div className="relative z-10 flex h-screen w-full font-sans antialiased text-zinc-900 bg-[#FDFCF8]">

            {/* DESKTOP SIDEBAR */}
            {pathname !== "/login" && pathname !== "/onboarding" && pathname !== "/" && (
                <aside className="w-[280px] border-r border-zinc-100 bg-white flex-col hidden md:flex z-50">
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
                            className="fixed inset-y-0 left-0 w-[280px] bg-[#FDFCF8] border-r border-zinc-200 z-50 flex flex-col md:hidden shadow-2xl text-zinc-900"
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
                    <header className="h-[72px] bg-[#FDFCF8] sticky top-0 z-30 flex items-center justify-between px-8 transition-all">

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Search Bar - Modernized */}
                        <div className="hidden md:flex items-center gap-2 group relative z-50">
                            <div className="relative">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#E85C33] transition-colors duration-300" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-12 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl w-64 focus:w-96 transition-all duration-300 ease-out outline-none focus:bg-white focus:border-[#E85C33]/30 focus:ring-4 focus:ring-[#E85C33]/10 focus:shadow-xl shadow-sm placeholder:text-zinc-400 text-sm font-medium"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none opacity-100 group-focus-within:opacity-0 transition-opacity duration-200">
                                    <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-zinc-200 bg-zinc-100 px-1.5 font-mono text-[10px] font-medium text-zinc-500 border-b-2">
                                        <span className="text-xs">⌘</span>K
                                    </kbd>
                                </div>
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
            <div className="h-[72px] flex items-center px-6">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-bold shadow-lg shadow-zinc-900/10 group-hover:scale-105 transition-transform">
                        <span className="text-sm">R</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight text-zinc-900">Reput.ai</span>
                </Link>
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
                <div className="p-5 rounded-2xl border border-zinc-100 bg-zinc-50/50 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-[#E85C33]/10 flex items-center justify-center text-[#E85C33]">
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
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                    ? "bg-orange-50 text-[#E85C33]"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
            )}
        >
            <span className={cn("transition-colors", active ? "text-[#E85C33]" : "text-zinc-400 group-hover:text-zinc-600")}>{icon}</span>
            <span>{label}</span>
        </Link>
    )
}
