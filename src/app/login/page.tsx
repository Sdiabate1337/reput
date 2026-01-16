"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Star, Shield, Zap, ArrowRight, Loader2, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { signup } from "@/actions/auth"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()
    const [mode, setMode] = useState<'login' | 'signup'>('login')
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Auth context
    const { signIn } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) return

        setIsLoading(true)
        setError(null)

        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)

        try {
            if (mode === 'login') {
                const result = await signIn(formData)
                if (result.success) {
                    router.push('/dashboard')
                } else {
                    setError(result.error || 'Erreur de connexion')
                }
            } else {
                const result = await signup(formData)
                if (result.success) {
                    // Auto-login after signup
                    const loginResult = await signIn(formData)
                    if (loginResult.success) {
                        router.push('/onboarding')
                    } else {
                        setError('Compte créé, veuillez vous connecter')
                        setMode('login')
                    }
                } else {
                    setError(result.error || 'Erreur lors de l\'inscription')
                }
            }
        } catch (err) {
            setError("Une erreur est survenue")
        } finally {
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
                            <span className="font-bold text-lg tracking-tight text-zinc-900">ReviewMe</span>
                        </Link>
                    </div>

                    <div className="flex-1 flex flex-col justify-center py-12">
                        <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                            {mode === 'login' ? 'Bienvenue sur ' : 'Rejoignez '}
                            <span className="text-[#E85C33]">ReviewMe</span>
                        </h1>
                        <p className="text-zinc-500 text-lg mb-8">
                            {mode === 'login'
                                ? 'Connectez-vous pour gérer votre réputation'
                                : 'Créez votre compte en quelques secondes'}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="vous@exemple.com"
                                        className="w-full h-14 pl-12 pr-4 rounded-xl border border-zinc-200 focus:border-[#E85C33] focus:ring-2 focus:ring-orange-100 outline-none transition-all text-base"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full h-14 pl-12 pr-4 rounded-xl border border-zinc-200 focus:border-[#E85C33] focus:ring-2 focus:ring-orange-100 outline-none transition-all text-base"
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 rounded-xl bg-[#E85C33] hover:bg-[#d54d26] text-white font-bold text-base shadow-lg shadow-orange-500/20"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
                                        <ArrowRight size={18} className="ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                className="text-zinc-500 hover:text-[#E85C33] font-medium transition-colors"
                            >
                                {mode === 'login'
                                    ? "Pas encore de compte ? S'inscrire"
                                    : "Déjà un compte ? Se connecter"}
                            </button>
                        </div>
                    </div>

                    <div className="text-center text-sm text-zinc-400">
                        En continuant, vous acceptez nos{" "}
                        <Link href="/terms" className="text-zinc-600 hover:text-[#E85C33]">
                            Conditions d&apos;utilisation
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Right: Hero */}
            <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="max-w-lg text-center">
                    <div className="flex justify-center gap-2 mb-8">
                        {[Star, Shield, Zap].map((Icon, i) => (
                            <div key={i} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-[#E85C33]">
                                <Icon size={24} />
                            </div>
                        ))}
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-zinc-900">
                        Transformez vos avis en croissance
                    </h2>
                    <p className="text-zinc-600 text-lg">
                        Collectez, analysez et répondez à vos avis clients automatiquement avec l&apos;IA.
                    </p>
                </div>
            </div>
        </div>
    )
}
