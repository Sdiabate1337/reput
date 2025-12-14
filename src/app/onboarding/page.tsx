"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Building2, Globe, Link, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

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
            // Save profile metadata
            await supabase.auth.updateUser({
                data: {
                    company_name: businessName,
                    website: website,
                    connected_platforms: platforms,
                    onboarded: true
                }
            })
            router.push('/dashboard')
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg">

                {/* Progress */}
                <div className="mb-8 flex justify-center gap-2">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={cn(
                                "h-1 w-12 rounded-full transition-colors duration-500",
                                step >= s ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-200 dark:bg-zinc-800"
                            )}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <StepCard key="step1" title="Tell us about yourself" description="We need a few details to set up your workspace.">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Business Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                        <input
                                            value={businessName}
                                            onChange={(e) => setBusinessName(e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-zinc-200 bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm transition-colors dark:border-zinc-800"
                                            placeholder="Acme Inc."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Website</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                        <input
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-zinc-200 bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm transition-colors dark:border-zinc-800"
                                            placeholder="https://acme.com"
                                        />
                                    </div>
                                </div>
                                <Button onClick={handleNext} disabled={!businessName} className="w-full mt-4 bg-zinc-900 text-white hover:bg-zinc-800">
                                    Continue <ArrowRight size={14} className="ml-2" />
                                </Button>
                            </div>
                        </StepCard>
                    )}

                    {step === 2 && (
                        <StepCard key="step2" title="Connect your sources" description="Where do you receive reviews?">
                            <div className="space-y-3">
                                <PlatformToggle
                                    id="google"
                                    label="Google Business"
                                    icon="G"
                                    checked={platforms.includes('google')}
                                    onChange={() => setPlatforms(prev => prev.includes('google') ? prev.filter(p => p !== 'google') : [...prev, 'google'])}
                                />
                                <PlatformToggle
                                    id="booking"
                                    label="Booking.com"
                                    icon="B"
                                    checked={platforms.includes('booking')}
                                    onChange={() => setPlatforms(prev => prev.includes('booking') ? prev.filter(p => p !== 'booking') : [...prev, 'booking'])}
                                />
                                <PlatformToggle
                                    id="tripadvisor"
                                    label="TripAdvisor"
                                    icon="T"
                                    checked={platforms.includes('tripadvisor')}
                                    onChange={() => setPlatforms(prev => prev.includes('tripadvisor') ? prev.filter(p => p !== 'tripadvisor') : [...prev, 'tripadvisor'])}
                                />
                                <Button onClick={handleNext} className="w-full mt-6 bg-zinc-900 text-white hover:bg-zinc-800">
                                    Continue <ArrowRight size={14} className="ml-2" />
                                </Button>
                            </div>
                        </StepCard>
                    )}

                    {step === 3 && (
                        <StepCard key="step3" title="Review Intelligence" description="Analyzing your initial reputation data...">
                            <div className="py-8 flex flex-col items-center text-center space-y-6">
                                <div className="relative h-16 w-16">
                                    <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20" />
                                    <div className="relative h-full w-full bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                                        <Sparkles size={24} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-medium">AI is preparing your dashboard</h3>
                                    <p className="text-sm text-zinc-500 max-w-xs mx-auto">We are aggregating your reviews and generating initial sentiment analysis.</p>
                                </div>
                                <Button onClick={handleNext} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                                    {isLoading ? "Launching..." : "Go to Dashboard"}
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-xl shadow-zinc-200/50 dark:shadow-none"
        >
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h1>
                <p className="text-zinc-500 mt-1">{description}</p>
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
                "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200",
                checked
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 ring-1 ring-indigo-600"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
            )}
        >
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 text-xs">
                    {icon}
                </div>
                <span className="font-medium text-sm">{label}</span>
            </div>
            <div className={cn(
                "h-5 w-5 rounded-full border flex items-center justify-center transition-colors",
                checked ? "bg-indigo-600 border-indigo-600 text-white" : "border-zinc-300 dark:border-zinc-600"
            )}>
                {checked && <Check size={10} />}
            </div>
        </div>
    )
}
