"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    User, Building2, Link as LinkIcon, Bell,
    Save, Globe, Mail, Lock, Upload, LogOut,
    CheckCircle2, XCircle, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card" // Using base Card if available, or just divs
import { cn } from "@/lib/utils"

// --- TYPES ---
type TabId = 'account' | 'business' | 'integrations' | 'notifications'



import { useAuth } from "@/lib/auth-context"

import { createClient } from "@/lib/supabase/client"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"

export default function SettingsPage() {
    const { logout, user, isLoading: isAuthLoading } = useAuth()
    const supabase = createClient()
    const [activeTab, setActiveTab] = useState<TabId>('account')
    const [isLoading, setIsLoading] = useState(false)
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    // Platform Data
    const INITIAL_PLATFORMS = [
        { id: 'google', name: 'Google Business', icon: 'G' },
        { id: 'booking', name: 'Booking.com', icon: 'B' },
        { id: 'tripadvisor', name: 'TripAdvisor', icon: 'T' },
        { id: 'facebook', name: 'Facebook', icon: 'F' },
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
            // Could add a toast success here
        } catch (error) {
            console.error('Error updating profile:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isAuthLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-white" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Settings</h1>
                <p className="text-zinc-500 text-sm font-medium">Manage your account preferences and integrations.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* SIDEBAR TABS (Desktop) / TOP TABS (Mobile) */}
                <nav className="sticky top-0 z-20 bg-zinc-50/95 dark:bg-zinc-950/95 backdrop-blur-xl md:static md:bg-transparent -mx-4 px-4 py-3 md:p-0 border-b md:border-0 border-zinc-200/50 dark:border-zinc-800/50 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible no-scrollbar snap-x">
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
                </nav>

                {/* CONTENT AREA */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'account' && (
                                <div className="space-y-6">
                                    <SectionCard title="Personal Profile" description="Update your personal information.">
                                        <div className="flex items-center gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800/50">
                                            <div className="relative h-20 w-20">
                                                <div className="h-full w-full rounded-full bg-zinc-200 overflow-hidden">
                                                    {profile.avatarUrl && <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />}
                                                </div>
                                                <button className="absolute bottom-0 right-0 p-1.5 bg-zinc-900 text-white rounded-full hover:bg-zinc-700 transition-colors shadow-lg border-2 border-white dark:border-zinc-900">
                                                    <Upload size={12} />
                                                </button>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Profile Photo</h3>
                                                <p className="text-xs text-zinc-500 mt-1">Accepts JPG, PNG or SVG.</p>
                                            </div>
                                        </div>
                                        <div className="grid gap-4 mt-6">
                                            <div className="grid gap-2">
                                                <Label>Full Name</Label>
                                                <Input value={profile.name} onChange={(e: any) => setProfile({ ...profile, name: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Email Address</Label>
                                                <Input value={profile.email} onChange={(e: any) => setProfile({ ...profile, email: e.target.value })} type="email" />
                                            </div>
                                        </div>
                                    </SectionCard>

                                    <div className="flex justify-end">
                                        <SaveButton onClick={handleSave} isLoading={isLoading} />
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                                        <h3 className="text-sm font-semibold text-red-600 mb-4">Danger Zone</h3>
                                        <div className="border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-xl p-4 flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-red-900 dark:text-red-200">Sign out</h4>
                                                <p className="text-xs text-red-700 dark:text-red-300">Securely log out of your account on this device.</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsLogoutModalOpen(true)}
                                                className="border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                                            >
                                                Log out
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'business' && (
                                <div className="space-y-6">
                                    <SectionCard title="Business Identity" description="This information provides context for AI replies.">
                                        <div className="grid gap-4">
                                            <div className="grid gap-2">
                                                <Label>Business Name</Label>
                                                <Input value={business.name} onChange={(e: any) => setBusiness({ ...business, name: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Website</Label>
                                                <div className="relative">
                                                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                                    <Input className="pl-9" value={business.website} onChange={(e: any) => setBusiness({ ...business, website: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Description / Context</Label>
                                                <textarea
                                                    className="min-h-[100px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900 resize-y dark:border-zinc-800 dark:text-zinc-50"
                                                    value={business.description}
                                                    onChange={(e: any) => setBusiness({ ...business, description: e.target.value })}
                                                />
                                                <p className="text-[11px] text-zinc-500">Briefly describe your business style and tone.</p>
                                            </div>
                                        </div>
                                    </SectionCard>
                                    <div className="flex justify-end">
                                        <SaveButton onClick={handleSave} isLoading={isLoading} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'integrations' && (
                                <div className="space-y-4">
                                    {platformState.map(platform => (
                                        <div key={platform.id} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500">
                                                    {platform.icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{platform.name}</h3>
                                                    <p className="text-xs text-zinc-500">
                                                        {platform.connected ? (
                                                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500">
                                                                <CheckCircle2 size={10} /> Connected
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-zinc-400">
                                                                <XCircle size={10} /> Not connected
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant={platform.connected ? "outline" : "default"}
                                                size="sm"
                                                onClick={() => togglePlatform(platform.id)}
                                                disabled={isUpdatingPlatform === platform.id}
                                                className={cn(
                                                    "h-8 text-xs font-medium",
                                                    platform.connected ? "hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-900/20" : "bg-black text-white dark:bg-white dark:text-black"
                                                )}
                                            >
                                                {isUpdatingPlatform === platform.id ? "Updating..." : (platform.connected ? "Disconnect" : "Connect")}
                                            </Button>
                                        </div>
                                    ))}
                                    <div className="mt-6 p-4 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 flex gap-3">
                                        <AlertCircle size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">Need more integrations?</h4>
                                            <p className="text-xs text-indigo-700 dark:text-indigo-300">We are constantly adding new platforms. Contact support to request a specific integration.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <SectionCard title="Preferences" description="Manage how and when you receive updates.">
                                    <div className="space-y-6">
                                        <ToggleItem
                                            title="Email Notifications"
                                            description="Receive an email when a new review needs attention."
                                            defaultChecked={true}
                                        />
                                        <ToggleItem
                                            title="Weekly Digest"
                                            description="A summary of your reputation performance every Monday."
                                            defaultChecked={true}
                                        />
                                        <ToggleItem
                                            title="Browser Push Notifications"
                                            description="Get real-time alerts on your desktop."
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
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-4 md:p-6 shadow-sm">
            <div className="mb-4 md:mb-6">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
                <p className="text-sm text-zinc-500">{description}</p>
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
                "flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left whitespace-nowrap flex-shrink-0 snap-start",
                active
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-md ring-1 ring-black/5 dark:ring-white/10"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 bg-white/50 dark:bg-zinc-900/50 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            )}
        >
            <Icon size={16} />
            <span>{label}</span>
        </button>
    )
}

function Label({ children }: { children: React.ReactNode }) {
    return <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{children}</label>
}

function Input({ className, ...props }: any) {
    return (
        <input
            className={cn(
                "flex h-10 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
                className
            )}
            {...props}
        />
    )
}

function SaveButton({ onClick, isLoading }: any) {
    return (
        <Button onClick={onClick} disabled={isLoading} className="min-w-[100px]">
            {isLoading ? (
                <>
                    <span className="h-4 w-4 bg-white/20 rounded-full animate-spin mr-2 border-2 border-white/50 border-t-transparent" />
                    Saving...
                </>
            ) : (
                <>
                    <Save size={14} className="mr-2" /> Save
                </>
            )}
        </Button>
    )
}

function ToggleItem({ title, description, defaultChecked }: any) {
    const [checked, setChecked] = useState(defaultChecked)
    return (
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</div>
                <div className="text-xs text-zinc-500">{description}</div>
            </div>
            <button
                onClick={() => setChecked(!checked)}
                className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2",
                    checked ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-700"
                )}
            >
                <span
                    className={cn(
                        "pointer-events-none block h-4 w-4 rounded-full bg-white dark:bg-black shadow-lg ring-0 transition-transform",
                        checked ? "translate-x-4" : "translate-x-0"
                    )}
                />
            </button>
        </div>
    )
}
