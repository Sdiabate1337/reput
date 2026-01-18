"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Logo } from "@/components/logo"
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
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { getEstablishmentByUserId } from "@/actions/establishments"
import { getTrialDaysLeft } from "@/lib/access-control"
import { Establishment } from "@/types/database"

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [establishment, setEstablishment] = useState<Establishment | null>(null)
    const pathname = usePathname()

    // Load Establishment Data
    useEffect(() => {
        if (user) {
            getEstablishmentByUserId().then(res => {
                if (res.success && res.data) {
                    setEstablishment(res.data)
                }
            })
        }
    }, [user])

    // Auto-close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    // Define routes where the main shell (Sidebar/Header) should be hidden
    // We hide it for: Landing Page, Login, Onboarding, and Admin Login
    const isPublicPage =
        pathname === "/" ||
        pathname === "/pricing" ||
        pathname === "/login" ||
        pathname === "/signup" ||
        pathname === "/admin/login" ||
        pathname.startsWith("/onboarding")

    // Landing Page & Pricing have specific full-screen layout requirements
    // Now including Admin Login so it takes full screen without Shell padding
    if (pathname === "/" || pathname === "/pricing" || pathname === "/admin/login") {
        return (
            <div className="font-sans antialiased text-zinc-900 dark:text-zinc-50">
                {children}
            </div>
        )
    }

    return (
        <div className="relative z-10 flex h-screen w-full font-sans antialiased text-zinc-900 bg-[#FDFCF8]">

            {/* DESKTOP SIDEBAR */}
            {!isPublicPage && (
                <aside className="w-[280px] bg-[#E85C33] bg-noise flex-col hidden md:flex z-50 shadow-xl border-r border-[#d44922]">
                    <SidebarContent pathname={pathname} establishment={establishment} />
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
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-[#E85C33] bg-noise z-50 flex flex-col md:hidden shadow-2xl text-white"
                        >
                            <div className="absolute top-4 right-4">
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/70 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                            <SidebarContent pathname={pathname} establishment={establishment} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                {/* HEADER */}
                {!isPublicPage && (
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
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'User'}`}
                                    alt="User"
                                    className="h-full w-full rounded-full bg-white object-cover"
                                />
                            </div>
                        </div>
                    </header>
                )}

                {/* PAGE CONTENT CONTAINER */}
                <div className="flex-1 overflow-y-auto p-4 pb-24 md:p-8 md:pb-8 scroll-smooth">
                    <div className="max-w-6xl mx-auto w-full h-full">
                        {children}
                    </div>
                </div>

                {/* Mobile Bottom Nav (Global) */}
                {!isPublicPage && (
                    <BottomNav />
                )}
            </main>
        </div>
    )
}

function SidebarContent({ pathname, establishment }: { pathname: string, establishment: Establishment | null }) {
    const { signOut } = useAuth()
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    const trialDays = establishment ? getTrialDaysLeft(establishment) : 0
    const quotaUsed = establishment?.outbound_quota_used || 0
    const quotaLimit = establishment?.outbound_quota_limit || 2000
    const percentUsed = Math.min((quotaUsed / quotaLimit) * 100, 100)

    const planName = establishment?.plan === 'pro' ? 'Pro Plan' : establishment?.plan === 'enterprise' ? 'Enterprise' : 'Startup Plan'

    return (
        <>
            <div className="h-[72px] flex items-center px-6">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <Logo theme="dark" />
                </Link>
            </div>

            <div className="px-3 py-6 space-y-1 overflow-y-auto flex-1">
                <div className="text-[10px] font-semibold text-white/50 mb-2 px-3 uppercase tracking-widest">General</div>

                <NavLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Overview" active={pathname === '/dashboard'} />
                <NavLink href="/reviews" icon={<MessageSquare size={18} />} label="Inbox" active={pathname === '/reviews'} />
                <NavLink href="/settings" icon={<Settings size={18} />} label="Settings" active={pathname === '/settings'} />
            </div>

            <div className="p-3 mt-auto">
                <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex w-full items-center gap-2.5 px-4 py-3 rounded-xl text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                    <LogOut size={18} />
                    <span>Log out</span>
                </button>
            </div>

            <div className="p-4 relative">
                <div className="p-5 rounded-2xl border border-white/10 bg-white/10 relative overflow-hidden group backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                                <CreditCard size={14} />
                            </div>
                            <div>
                                <p className="text-[13px] font-semibold text-white">{planName}</p>
                                {establishment?.subscription_status === 'TRIAL' && (
                                    <p className="text-[10px] text-white/70">{trialDays} days left</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-white h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-500"
                            style={{ width: `${percentUsed}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-white/60 mt-2 font-medium">{quotaUsed} / {quotaLimit} credits used</p>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={signOut}
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
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                active
                    ? "bg-white text-[#E85C33] shadow-lg shadow-black/5"
                    : "text-white/70 hover:text-white hover:bg-white/10"
            )}
        >
            <span className={cn("transition-colors", active ? "text-[#E85C33]" : "text-white/70 group-hover:text-white")}>{icon}</span>
            <span>{label}</span>
        </Link>
    )
}
