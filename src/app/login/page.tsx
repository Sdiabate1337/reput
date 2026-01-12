"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Star, Shield, Zap, ArrowRight, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSent, setIsSent] = useState(false)

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsLoading(true)
        setError(null)

        // TODO: Implement real PostgreSQL auth
        try {
            // Placeholder - redirect to dashboard for now
            setIsSent(true)
            setIsLoading(false)
        } catch (err) {
            setError("Une erreur est survenue")
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

                    <div className="flex-1 flex flex-col justify-center py-12">
                        <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                            Bienvenue sur <span className="text-[#E85C33]">Reput.ai</span>
                        </h1>
                        <p className="text-zinc-500 text-lg mb-8">
                            Connectez-vous pour gérer votre réputation
                        </p>

                        {!isSent ? (
                            <form onSubmit={handleEmailLogin} className="space-y-4">
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

                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
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
                                            Continuer <ArrowRight size={18} className="ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="text-green-600" size={32} />
                                </div>
                                <h2 className="text-xl font-bold mb-2">Vérifiez votre email</h2>
                                <p className="text-zinc-500">
                                    Un lien de connexion a été envoyé à <strong>{email}</strong>
                                </p>
                            </div>
                        )}
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
