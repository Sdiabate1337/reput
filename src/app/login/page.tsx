"use client"

import { useState, Suspense, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Star, Shield, Zap, ArrowRight, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export default function LoginPage() {
    const { loginWithGoogle } = useAuth()
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSent, setIsSent] = useState(false)

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
            setIsSent(true)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex bg-[#FDFCF8] selection:bg-orange-500/20 font-sans text-zinc-900">
            {/* Left: Login Form */}
            <div className="w-full lg:w-[500px] xl:w-[600px] p-8 lg:p-12 flex flex-col justify-between relative z-10 bg-white shadow-[20px_0_60px_-10px_rgba(0,0,0,0.03)] border-r border-zinc-100">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="h-full flex flex-col justify-between"
                >
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-9 w-9 bg-zinc-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-zinc-900/10 group-hover:scale-105 transition-transform">R</div>
                            <span className="font-bold text-lg tracking-tight text-zinc-900">Reput.ai</span>
                        </Link>
                    </div>

                    <div className="max-w-[380px] w-full mx-auto space-y-8">
                        {/* Header */}
                        <Suspense fallback={<LoginHeader />}>
                            <DynamicLoginHeader />
                        </Suspense>

                        {/* Social Login */}
                        <div className="grid grid-cols-1 gap-4">
                            <Button
                                variant="outline"
                                className="h-12 rounded-xl text-base font-medium border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all text-zinc-700 justify-center gap-3"
                                onClick={loginWithGoogle}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-zinc-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase font-semibold tracking-wider">
                                <span className="bg-white px-3 text-zinc-400">Or with Email</span>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
                                <Shield size={16} className="shrink-0" /> {error}
                            </motion.div>
                        )}

                        {/* Success Message */}
                        {isSent ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-green-50 rounded-2xl border border-green-100 text-center space-y-2">
                                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-2">
                                    <Check size={24} />
                                </div>
                                <h3 className="text-green-800 font-bold">Check your inbox!</h3>
                                <p className="text-green-700 text-sm">We sent a magic link to <span className="font-semibold">{email}</span>.</p>
                                <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-100 mt-2 h-auto py-1 px-3 text-xs" onClick={() => setIsSent(false)}>Use a different email</Button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleEmailLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-700">Email address</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="name@company.com"
                                            className="flex h-12 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 py-2 text-base shadow-sm transition-all outline-none focus:border-[#E85C33] focus:ring-4 focus:ring-[#E85C33]/10 placeholder:text-zinc-400"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoFocus // Auto focus for UX
                                        />
                                    </div>
                                </div>
                                <Button
                                    className="w-full h-12 rounded-full bg-[#E85C33] hover:bg-[#D54D26] text-white shadow-lg shadow-orange-500/20 font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin text-white/80" />
                                            Sending Link...
                                        </span>
                                    ) : (
                                        "Send Magic Link"
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-6 opacity-40 grayscale mix-blend-multiply py-6">
                        <span className="text-sm font-serif font-bold text-zinc-900">Hilton</span>
                        <span className="text-sm font-serif font-bold text-zinc-900">Marriott</span>
                        <span className="text-sm font-serif font-bold text-zinc-900">Accor</span>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-zinc-400 font-medium">© 2025 Reput.ai Inc. • Privacy • Terms</p>
                    </div>
                </motion.div>
            </div>

            {/* Right: Visuals */}
            <div className="hidden lg:flex w-full relative overflow-hidden bg-[#FBECE6]">
                <LoginVisuals />
            </div>
        </div>
    )
}

function LoginHeader() {
    return (
        <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Welcome back</h1>
            <p className="text-base text-zinc-500 font-medium">Log in to your command center.</p>
        </div>
    )
}

function DynamicLoginHeader() {
    const searchParams = useSearchParams()
    const intent = searchParams.get('intent')

    if (intent === 'demo') {
        return (
            <div className="space-y-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Book your Demo</h1>
                <p className="text-base text-zinc-500 font-medium">Create an account to schedule a personalized tour.</p>
            </div>
        )
    }

    if (intent === 'signup') {
        return (
            <div className="space-y-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Start 14-Day Free Trial</h1>
                <p className="text-base text-zinc-500 font-medium">No credit card required. Cancel anytime.</p>
            </div>
        )
    }

    return <LoginHeader />
}

function LoginVisuals() {
    const [index, setIndex] = useState(0)
    const testimonials = [
        {
            quote: "Reput has completely changed how we handle guest feedback. It's like having a full-time reputation manager.",
            author: "James Lewis",
            role: "General Manager, Hyatt Regency",
            initials: "JL"
        },
        {
            quote: "We caught a 1-star review about a cold room and fixed it before the guest even checked out. Magic.",
            author: "Sarah Jenkins",
            role: "GM, Horizon Hotel",
            initials: "SJ"
        },
        {
            quote: "I used to spend 2 hours a day on reviews. Now I spend 10 minutes. The ROI was immediate.",
            author: "Marc Dubois",
            role: "Owner, Le Petit Bistro",
            initials: "MD"
        }
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <>
            {/* Background Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F5D0C2] rounded-full blur-[120px] opacity-60"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.5))]" />

            <div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-12">
                <Link href="/" className="absolute top-12 right-12 text-zinc-500 font-bold text-sm bg-white/50 px-4 py-2 rounded-full hover:bg-white transition-all cursor-pointer">
                    Back to Home
                </Link>

                <div className="max-w-md w-full h-[400px] flex items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-orange-900/5 relative border border-white/50"
                        >
                            <div className="absolute -top-6 -right-6 h-16 w-16 bg-[#E85C33] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/30 rotate-12">
                                <Star fill="currentColor" size={32} />
                            </div>

                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} className="text-[#E85C33] fill-[#E85C33]" />)}
                            </div>

                            <h3 className="text-2xl font-bold text-zinc-900 leading-snug mb-6 min-h-[120px]">
                                "{testimonials[index].quote}"
                            </h3>

                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden ring-2 ring-white">
                                    <span className="font-bold text-zinc-400">{testimonials[index].initials}</span>
                                </div>
                                <div>
                                    <div className="font-bold text-zinc-900">{testimonials[index].author}</div>
                                    <div className="text-sm text-zinc-500 font-medium">{testimonials[index].role}</div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress Indicators */}
                <div className="mt-8 flex gap-2">
                    {testimonials.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-[#E85C33]' : 'w-1.5 bg-zinc-300'}`}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

