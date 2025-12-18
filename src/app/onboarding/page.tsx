"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Building2, Globe, Sparkles, Search, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { completeOnboarding } from "./actions"

export default function OnboardingPage() {
    const { user } = useAuth()
    const router = useRouter()
    const supabase = createClient()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    // Form State
    const [businessName, setBusinessName] = useState(user?.user_metadata?.company_name || "")
    const [website, setWebsite] = useState("")
    const [platforms, setPlatforms] = useState<string[]>(['google'])

    const handleNext = async () => {
        if (step < 3) {
            setStep(step + 1)
        } else {
            setIsLoading(true)
            try {
                await completeOnboarding({
                    company_name: businessName,
                    website: website,
                    connected_platforms: platforms
                })
            } catch (error) {
                console.error("Onboarding failed:", error)
                setIsLoading(false)
            }
        }
    }

    return (
        <div className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans text-zinc-900 selection:bg-orange-500/20">

            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#FBECE6] rounded-full blur-[120px] opacity-60 pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.8))]" />

            {/* Header */}
            <div className="absolute top-8 left-8 z-20">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-9 w-9 bg-zinc-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-zinc-900/10 group-hover:scale-105 transition-transform">R</div>
                    <span className="font-bold text-lg tracking-tight text-zinc-900">Reput.ai</span>
                </Link>
            </div>

            <div className="w-full max-w-2xl relative z-10">

                {/* Stepper */}
                <div className="mb-12">
                    <div className="flex justify-between items-center relative">
                        {/* Connecting Line */}
                        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-zinc-200 -z-10" />

                        {[
                            { id: 1, label: "Profile" },
                            { id: 2, label: "Connect" },
                            { id: 3, label: "Analysis" }
                        ].map((s) => {
                            const isActive = step >= s.id;
                            const isCurrent = step === s.id;
                            return (
                                <div key={s.id} className="flex flex-col items-center gap-2 bg-[#FDFCF8] px-2">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                                            isActive
                                                ? "bg-[#E85C33] border-[#E85C33] text-white shadow-lg shadow-orange-500/20"
                                                : "bg-white border-zinc-200 text-zinc-400"
                                        )}
                                    >
                                        {isActive && !isCurrent && s.id < step ? (
                                            <Check size={16} strokeWidth={3} />
                                        ) : (
                                            <span className="font-bold text-sm">{s.id}</span>
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-xs font-bold uppercase tracking-wider transition-colors duration-300",
                                        isActive ? "text-[#E85C33]" : "text-zinc-400"
                                    )}>{s.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <StepCard key="step1" title="Tell us about yourself" description="We need a few details to set up your workspace.">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700">Business Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#E85C33] transition-colors">
                                            <Building2 size={18} />
                                        </div>
                                        <input
                                            value={businessName}
                                            onChange={(e) => setBusinessName(e.target.value)}
                                            className="flex h-12 w-full rounded-xl border border-zinc-200 bg-white/50 pl-11 pr-4 py-2 text-base shadow-sm transition-all outline-none focus:border-[#E85C33] focus:ring-4 focus:ring-[#E85C33]/10 placeholder:text-zinc-400"
                                            placeholder="e.g. Acme Hotel & Spa"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700">Website URL</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#E85C33] transition-colors">
                                            <Globe size={18} />
                                        </div>
                                        <input
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            className="flex h-12 w-full rounded-xl border border-zinc-200 bg-white/50 pl-11 pr-4 py-2 text-base shadow-sm transition-all outline-none focus:border-[#E85C33] focus:ring-4 focus:ring-[#E85C33]/10 placeholder:text-zinc-400"
                                            placeholder="https://acme.com"
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={handleNext}
                                    disabled={!businessName}
                                    className="w-full mt-6 h-12 rounded-full bg-[#E85C33] hover:bg-[#D54D26] text-white shadow-lg shadow-orange-500/20 font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Continue <ArrowRight size={18} className="ml-2" />
                                </Button>
                            </div>
                        </StepCard>
                    )}

                    {step === 2 && (
                        <StepCard key="step2" title="Connect your sources" description="Where do you receive reviews? Select all that apply.">
                            <div className="grid grid-cols-1 gap-3">
                                <PlatformToggle
                                    id="google"
                                    label="Google Business"
                                    icon={<div className="font-bold text-blue-600 text-lg">G</div>}
                                    checked={platforms.includes('google')}
                                    onChange={() => setPlatforms(prev => prev.includes('google') ? prev.filter(p => p !== 'google') : [...prev, 'google'])}
                                />
                                <PlatformToggle
                                    id="booking"
                                    label="Booking.com"
                                    icon={<div className="font-bold text-[#003580] text-lg">B</div>}
                                    checked={platforms.includes('booking')}
                                    onChange={() => setPlatforms(prev => prev.includes('booking') ? prev.filter(p => p !== 'booking') : [...prev, 'booking'])}
                                />
                                <PlatformToggle
                                    id="tripadvisor"
                                    label="TripAdvisor"
                                    icon={<div className="font-bold text-[#00AF87] text-lg">T</div>}
                                    checked={platforms.includes('tripadvisor')}
                                    onChange={() => setPlatforms(prev => prev.includes('tripadvisor') ? prev.filter(p => p !== 'tripadvisor') : [...prev, 'tripadvisor'])}
                                />
                                <Button
                                    onClick={handleNext}
                                    className="w-full mt-6 h-12 rounded-full bg-[#E85C33] hover:bg-[#D54D26] text-white shadow-lg shadow-orange-500/20 font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Continue <ArrowRight size={18} className="ml-2" />
                                </Button>
                            </div>
                        </StepCard>
                    )}

                    {step === 3 && (
                        <StepCard key="step3" title="AI Analysis in Progress" description="We're building your reputation baseline...">
                            <div className="py-12 flex flex-col items-center text-center space-y-8">
                                <div className="relative h-24 w-24">
                                    {/* Radar Ripples */}
                                    <div className="absolute inset-0 bg-[#E85C33] rounded-full animate-ping opacity-20" />
                                    <div className="absolute inset-0 bg-[#E85C33] rounded-full animate-ping opacity-10 animation-delay-300" />
                                    <div className="absolute inset-0 bg-[#E85C33] rounded-full animate-ping opacity-5 animation-delay-700" />

                                    <div className="relative h-full w-full bg-white border-2 border-orange-100 text-[#E85C33] rounded-full flex items-center justify-center shadow-xl">
                                        <Sparkles size={32} className="animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-3 max-w-sm mx-auto">
                                    <h3 className="font-bold text-zinc-900 text-lg">Scanning {platforms.length} sources...</h3>
                                    <div className="flex flex-col gap-2">
                                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 2.5, ease: "easeInOut" }}
                                                className="h-full bg-[#E85C33] rounded-full"
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-zinc-400 font-medium">
                                            <span>Connecting API</span>
                                            <span>Importing Reviews</span>
                                            <span>Sentiment Analysis</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleNext}
                                    className="w-full h-12 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl font-bold text-base transition-all"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Finalizing...</span>
                                    ) : (
                                        "Go to Dashboard"
                                    )}
                                </Button>
                            </div>
                        </StepCard>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}

function StepCard({ title, description, children }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/50 p-8 md:p-12 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.05)]"
        >
            <div className="mb-8 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">{title}</h1>
                <p className="text-zinc-500 font-medium">{description}</p>
            </div>
            {children}
        </motion.div>
    )
}

function PlatformToggle({ id, label, icon, checked, onChange }: any) {
    return (
        <div
            onClick={onChange}
            className={cn(
                "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group relative overflow-hidden",
                checked
                    ? "border-[#E85C33] bg-orange-50/50"
                    : "border-zinc-100 bg-white hover:border-zinc-200 hover:bg-zinc-50"
            )}
        >
            <div className="flex items-center gap-4 relative z-10">
                <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-sm">
                    {icon}
                </div>
                <span className={cn("font-bold text-base", checked ? "text-[#E85C33]" : "text-zinc-700")}>{label}</span>
            </div>
            <div className={cn(
                "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all relative z-10",
                checked ? "bg-[#E85C33] border-[#E85C33] text-white" : "border-zinc-200 bg-white group-hover:border-zinc-300"
            )}>
                {checked && <Check size={12} strokeWidth={4} />}
            </div>
        </div>
    )
}
