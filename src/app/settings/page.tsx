"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    User, Building2, Link as LinkIcon, Bell,
    Save, Globe, Mail, Lock, Upload, LogOut,
    CheckCircle2, XCircle, AlertCircle, ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"

// --- TYPES ---
type TabId = 'account' | 'business' | 'integrations' | 'notifications'

export default function SettingsPage() {
    const { logout, user, isLoading: isAuthLoading } = useAuth()
    const supabase = createClient()
    const [activeTab, setActiveTab] = useState<TabId>('account')
    const [isLoading, setIsLoading] = useState(false)
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    // Platform Data
    const INITIAL_PLATFORMS = [
        { id: 'google', name: 'Google Business', icon: 'G', color: 'bg-blue-500' },
        { id: 'booking', name: 'Booking.com', icon: 'B', color: 'bg-[#003580]' },
        { id: 'tripadvisor', name: 'TripAdvisor', icon: 'T', color: 'bg-[#34E0A1]' },
        { id: 'facebook', name: 'Facebook', icon: 'F', color: 'bg-[#1877F2]' },
    ]
    const [platformState, setPlatformState] = useState(INITIAL_PLATFORMS.map(p => ({ ...p, connected: false })))
    const [isUpdatingPlatform, setIsUpdatingPlatform] = useState<string | null>(null)

    // Form States
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        avatarUrl: "",
        language: "Français"
    })
    const [business, setBusiness] = useState({
        name: "",
        website: "",
        description: ""
    })

    // Load data from user session
    useEffect(() => {
        if (user) {
            setProfile({
                name: user.user_metadata?.full_name || user.user_metadata?.name || "",
                email: user.email || "",
                avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
                language: "Français"
            })
            setBusiness({
                name: user.user_metadata?.company_name || "",
                website: user.user_metadata?.website || "",
                description: user.user_metadata?.description || ""
            })

            // Sync platforms
            const connected = user.user_metadata?.connected_platforms || []
            setPlatformState(prev => prev.map(p => ({
                ...p,
                connected: connected.includes(p.id)
            })))
        }
    }, [user])

    const togglePlatform = async (platformId: string) => {
        setIsUpdatingPlatform(platformId)
        try {
            // Calculate new state
            const currentConnected = platformState.find(p => p.id === platformId)?.connected
            const newConnectedList = currentConnected
                ? platformState.filter(p => p.connected && p.id !== platformId).map(p => p.id)
                : [...platformState.filter(p => p.connected).map(p => p.id), platformId]

            // Update Supabase
            const { error } = await supabase.auth.updateUser({
                data: { connected_platforms: newConnectedList }
            })

            if (error) throw error

            // Update Local State
            setPlatformState(prev => prev.map(p =>
                p.id === platformId ? { ...p, connected: !p.connected } : p
            ))

        } catch (error) {
            console.error('Error toggling platform:', error)
        } finally {
            setIsUpdatingPlatform(null)
        }
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const updates: any = {
                data: {
                    full_name: profile.name,
                    company_name: business.name,
                    website: business.website,
                    description: business.description
                }
            }

            // Only update email if it changed (triggers validatiion email)
            if (user?.email && profile.email !== user.email) {
                updates.email = profile.email
            }

            const { error } = await supabase.auth.updateUser(updates)

            if (error) throw error
        } catch (error) {
            console.error('Error updating profile:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isAuthLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-[#E85C33]" />
            </div>
        )
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 pb-12">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Settings</h1>
                    <p className="text-zinc-500 font-medium mt-1">Manage your preferences and integrations.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                {/* SIDEBAR TABS */}
                {/* SIDEBAR TABS */}
                <nav className="w-full md:w-64 sticky top-[72px] md:top-24 z-20 bg-[#FDFCF8]/95 backdrop-blur-sm md:bg-transparent -mx-4 px-4 py-3 md:p-0 shrink-0 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible no-scrollbar border-b md:border-0 border-zinc-200/50">
                    <TabButton
                        active={activeTab === 'account'}
                        onClick={() => setActiveTab('account')}
                        icon={User}
                        label="Account"
                    />
                    <TabButton
                        active={activeTab === 'business'}
                        onClick={() => setActiveTab('business')}
                        icon={Building2}
                        label="Business Info"
                    />
                    <TabButton
                        active={activeTab === 'integrations'}
                        onClick={() => setActiveTab('integrations')}
                        icon={LinkIcon}
                        label="Integrations"
                    />
                    <TabButton
                        active={activeTab === 'notifications'}
                        onClick={() => setActiveTab('notifications')}
                        icon={Bell}
                        label="Notifications"
                    />

                    <div className="hidden md:block pt-6 mt-6 border-t border-zinc-200">
                        <button
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                            <LogOut size={16} />
                            Log out
                        </button>
                    </div>
                </nav>

                {/* CONTENT AREA */}
                <div className="flex-1 min-w-0 w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            {activeTab === 'account' && (
                                <div className="space-y-6 max-w-2xl">
                                    <SectionCard title="Personal Profile" description="Update your personal information.">
                                        <div className="flex items-center gap-6 pb-8 border-b border-zinc-100">
                                            <div className="relative h-24 w-24 group cursor-pointer">
                                                <div className="h-full w-full rounded-2xl bg-zinc-100 overflow-hidden ring-4 ring-white shadow-lg">
                                                    {profile.avatarUrl && <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />}
                                                </div>
                                                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Upload size={20} className="text-white" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-zinc-900">Profile Photo</h3>
                                                <p className="text-sm text-zinc-500 mt-1">Accepts JPG, PNG or SVG.</p>
                                            </div>
                                        </div>
                                        <div className="grid gap-6 mt-8">
                                            <div className="grid gap-2">
                                                <Label>Full Name</Label>
                                                <Input value={profile.name} onChange={(e: any) => setProfile({ ...profile, name: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Email Address</Label>
                                                <Input value={profile.email} onChange={(e: any) => setProfile({ ...profile, email: e.target.value })} type="email" />
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-end">
                                            <SaveButton onClick={handleSave} isLoading={isLoading} />
                                        </div>
                                    </SectionCard>

                                    <div className="border border-red-200/60 bg-red-50/30 rounded-[32px] p-8 shadow-[0_2px_20px_rgba(220,38,38,0.02)]">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                            <div>
                                                <h2 className="text-lg font-bold text-red-900">Sign out</h2>
                                                <p className="text-red-700/80 mt-1 text-sm font-medium">Securely log out of your account on this device.</p>
                                            </div>
                                            <Button
                                                onClick={() => setIsLogoutModalOpen(true)}
                                                className="h-11 px-6 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm font-bold transition-all"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Log out
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'business' && (
                                <div className="space-y-6 max-w-2xl">
                                    <SectionCard title="Business Identity" description="This information provides context for AI replies.">
                                        <div className="grid gap-6">
                                            <div className="grid gap-2">
                                                <Label>Business Name</Label>
                                                <Input value={business.name} onChange={(e: any) => setBusiness({ ...business, name: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Website</Label>
                                                <div className="relative">
                                                    <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                                    <Input className="pl-11" value={business.website} onChange={(e: any) => setBusiness({ ...business, website: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Description / Context</Label>
                                                <textarea
                                                    className="min-h-[140px] w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm shadow-sm placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E85C33]/20 focus:border-[#E85C33] resize-y transition-all"
                                                    value={business.description}
                                                    onChange={(e: any) => setBusiness({ ...business, description: e.target.value })}
                                                    placeholder="e.g. A cozy family-run Italian restaurant in downtown Paris..."
                                                />
                                                <p className="text-[13px] text-zinc-500">Briefly describe your business style and tone for the AI.</p>
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-end">
                                            <SaveButton onClick={handleSave} isLoading={isLoading} />
                                        </div>
                                    </SectionCard>
                                </div>
                            )}

                            {activeTab === 'integrations' && (
                                <div className="space-y-6 max-w-3xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {platformState.map(platform => (
                                            <div
                                                key={platform.id}
                                                className={cn(
                                                    "p-5 rounded-3xl border transition-all duration-300 flex flex-col gap-4",
                                                    platform.connected
                                                        ? "bg-[#FFF8F6] border-[#E85C33]/30 shadow-[0_8px_30px_rgba(232,92,51,0.06)]"
                                                        : "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5"
                                                )}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm", platform.color)}>
                                                            {platform.icon}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-zinc-900">{platform.name}</h3>
                                                            <p className="text-xs font-medium text-zinc-500">
                                                                {platform.connected ? "Auto-syced" : "No active sync"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {platform.connected && (
                                                        <div className="h-6 w-6 rounded-full bg-[#E85C33] text-white flex items-center justify-center">
                                                            <CheckCircle2 size={12} strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </div>

                                                <Button
                                                    variant={platform.connected ? "outline" : "default"}
                                                    size="sm"
                                                    onClick={() => togglePlatform(platform.id)}
                                                    disabled={isUpdatingPlatform === platform.id}
                                                    className={cn(
                                                        "w-full h-9 rounded-xl font-bold text-xs shadow-none border transition-all",
                                                        platform.connected
                                                            ? "bg-white border-[#E85C33]/20 text-[#E85C33] hover:bg-[#E85C33] hover:text-white hover:border-[#E85C33]"
                                                            : "bg-zinc-900 text-white hover:bg-zinc-800 border-transparent"
                                                    )}
                                                >
                                                    {isUpdatingPlatform === platform.id ? "Updating..." : (platform.connected ? "Disconnect" : "Connect Account")}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-4">
                                        <div className="p-2 bg-indigo-100 rounded-lg shrink-0">
                                            <AlertCircle size={20} className="text-indigo-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-indigo-900">Need more integrations?</h4>
                                            <p className="text-sm text-indigo-700 mt-1 leading-relaxed">We are constantly adding new platforms. Contact support to request a specific integration for your industry.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <SectionCard title="Notification Preferences" description="Manage how and when you receive updates.">
                                    <div className="space-y-6">
                                        <ToggleItem
                                            title="Email Notifications"
                                            description="Receive an email when-ever a new high-priority review needs attention."
                                            defaultChecked={true}
                                        />
                                        <div className="h-px w-full bg-zinc-100" />
                                        <ToggleItem
                                            title="Weekly Performance Digest"
                                            description="A summary of your reputation performance every Monday morning."
                                            defaultChecked={true}
                                        />
                                        <div className="h-px w-full bg-zinc-100" />
                                        <ToggleItem
                                            title="Browser Push Notifications"
                                            description="Get real-time alerts on your desktop even when the tab is closed."
                                            defaultChecked={false}
                                        />
                                    </div>
                                </SectionCard>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* MODALS */}
            <ConfirmationModal
                isOpen={!!isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={logout}
                title="Log out"
                description="Are you sure you want to log out? You will need to sign in again to access your account."
                confirmText="Log out"
                variant="danger"
            />
        </div>
    )
}

// --- HELPER COMPONENTS ---

function SectionCard({ title, description, children }: any) {
    return (
        <div className="border border-zinc-200/60 bg-white rounded-[32px] p-8 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
                <p className="text-zinc-500 mt-1">{description}</p>
            </div>
            {children}
        </div>
    )
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2.5 px-4 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-sm font-medium transition-all text-left whitespace-nowrap flex-shrink-0 snap-start",
                active
                    ? "bg-[#FFF8F6] text-[#E85C33] shadow-none ring-1 ring-[#E85C33]/10 md:ring-0"
                    : "bg-white/50 md:bg-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 border border-transparent hover:border-zinc-200 md:hover:border-transparent"
            )}
        >
            <Icon size={16} className={cn(active ? "text-[#E85C33]" : "text-zinc-400")} />
            <span className={cn(active ? "font-bold" : "")}>{label}</span>
            {active && <ArrowRight size={14} className="ml-auto opacity-50 hidden md:block" />}
        </button>
    )
}

function Label({ children }: { children: React.ReactNode }) {
    return <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide ml-1 mb-1.5 block">{children}</label>
}

function Input({ className, ...props }: any) {
    return (
        <input
            className={cn(
                "flex h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-1 text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus:bg-white focus:border-[#E85C33] focus:ring-4 focus:ring-[#E85C33]/10 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    )
}

function SaveButton({ onClick, isLoading }: any) {
    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            className="min-w-[120px] h-11 rounded-xl bg-[#E85C33] hover:bg-[#d94a20] text-white shadow-lg shadow-orange-500/20 font-bold"
        >
            {isLoading ? (
                <>
                    <span className="h-4 w-4 bg-white/20 rounded-full animate-spin mr-2 border-2 border-white/50 border-t-transparent" />
                    Saving...
                </>
            ) : (
                <>
                    <Save size={16} className="mr-2" /> Save Changes
                </>
            )}
        </Button>
    )
}

function ToggleItem({ title, description, defaultChecked }: any) {
    const [checked, setChecked] = useState(defaultChecked)
    return (
        <div className="flex items-center justify-between group cursor-pointer" onClick={() => setChecked(!checked)}>
            <div className="space-y-0.5">
                <div className="text-sm font-bold text-zinc-900 group-hover:text-[#E85C33] transition-colors">{title}</div>
                <div className="text-xs text-zinc-500">{description}</div>
            </div>
            <button
                className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85C33] focus-visible:ring-offset-2",
                    checked ? "bg-[#E85C33]" : "bg-zinc-200"
                )}
            >
                <span
                    className={cn(
                        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
                        checked ? "translate-x-5" : "translate-x-0"
                    )}
                />
            </button>
        </div>
    )
}
