"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Star, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
    const { loginWithGoogle } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("") // Added password state
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null) // Added error state

    // We might need to expose signInWithPassword in context or just use client here.
    // Ideally context handles all auth. But for speed let's just use context for OAuth and client for email/pass if context doesn't have it.
    // Actually, let's keep it simple and just use the OAuth flow requested by user ("email et google"). 
    // Wait, "email" usually means magic link or password. I'll stick to Magic Link for simplicity or Password if standard.
    // Let's implement Password login safely.

    // REVISION: I will use the `createClient` here directly for email login to avoid cluttering context, 
    // or better yet, add `loginWithEmail` to context. 
    // For now, let's just trigger Google login as primary requested feature, and keep email form as "Magic Link" or Password placeholder that actually calls Supabase.

    // Let's implement Magic Link for "Email" flow as it's modern.
    const supabase = createClient()

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            setError(error.message)
            setIsLoading(false)
        } else {
            alert("Check your email for the login link!")
            setIsLoading(false)
        }
    }

    return (
        <div className="h-screen overflow-hidden w-full flex bg-white dark:bg-zinc-950">
            {/* Left: Login Form */}
            <div className="w-full lg:w-[480px] p-8 flex flex-col justify-center relative z-10 bg-white dark:bg-zinc-950">
                <div className="max-w-[340px] w-full mx-auto space-y-8">
                    {/* Brand */}
                    <div className="flex items-center gap-2 mb-10">
                        <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold shadow-sm">
                            <span className="text-sm">R</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">Reput.ai</span>
                    </div>

                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Welcome back</h1>
                        <p className="text-sm text-zinc-500">Sign in to your account to manage your reviews.</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-md border border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    {/* Email Form (Magic Link) */}
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email address</label>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                className="flex h-10 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:border-zinc-800 dark:focus-visible:ring-zinc-300"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <Button className="w-full h-10 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-900" disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 bg-white/20 rounded-full animate-spin border-2 border-white/50 border-t-transparent" />
                                    Sending Link...
                                </span>
                            ) : (
                                "Sign In with Email"
                            )}
                        </Button>
                    </form>

                    {/* Separator */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-100 dark:border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-zinc-950 px-2 text-zinc-400">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-1 gap-3">
                        <Button variant="outline" className="h-10 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900" onClick={loginWithGoogle}>
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-6 left-0 w-full text-center">
                    <p className="text-xs text-zinc-400">© 2024 Reput.ai Inc. All rights reserved.</p>
                </div>
            </div>

            {/* Right: Marketing / Visuals */}
            <div className="hidden lg:flex w-full relative bg-zinc-900 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-12 text-zinc-50">
                    <div className="max-w-md space-y-8">
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-sm font-medium backdrop-blur-md border border-white/10 mb-6">
                                <Star size={12} className="text-amber-400 fill-amber-400" />
                                Trusted by 10,000+ businesses
                            </span>
                            <h2 className="text-4xl font-bold tracking-tight mb-4">Turn reviews into revenue.</h2>
                            <p className="text-lg text-zinc-400 leading-relaxed">
                                Automate your reputation management with AI. Monitor, reply, and analyze customer feedback from one dashboard.
                            </p>
                        </div>

                        <div className="grid gap-4 mt-8">
                            <FeatureItem icon={Shield} title="AI-Powered Protection" desc="Detect negative sentiment instantly." />
                            <FeatureItem icon={Zap} title="Instant Responses" desc="Draft personalized replies in seconds." />
                            <FeatureItem icon={CheckCircle2} title="Review Aggregation" desc="Google, Booking, and more in one place." />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FeatureItem({ icon: Icon, title, desc }: any) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-white/10 shrink-0">
                <Icon size={18} />
            </div>
            <div>
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-xs text-zinc-400 mt-1">{desc}</p>
            </div>
        </div>
    )
}
