"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Building2, MapPin, Phone, ArrowRight, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OnboardingPage() {
    const [step, setStep] = useState(1)
    const [name, setName] = useState("")
    const [googleLink, setGoogleLink] = useState("")
    const [phone, setPhone] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // TODO: Implement real onboarding with PostgreSQL
        setTimeout(() => {
            setIsLoading(false)
            setStep(step + 1)
        }, 1000)
    }

    return (
        <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white rounded-3xl border border-zinc-100 shadow-xl p-8"
            >
                {/* Progress */}
                <div className="flex items-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`flex-1 h-2 rounded-full ${s <= step ? "bg-[#E85C33]" : "bg-zinc-100"
                                }`}
                        />
                    ))}
                </div>

                {step === 1 && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Building2 className="text-[#E85C33]" size={32} />
                            </div>
                            <h1 className="text-2xl font-bold">Nom de votre établissement</h1>
                            <p className="text-zinc-500">Comment s&apos;appelle votre restaurant/hôtel ?</p>
                        </div>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Le Petit Bistro"
                            className="w-full h-14 px-4 rounded-xl border border-zinc-200 focus:border-[#E85C33] focus:ring-2 focus:ring-orange-100 outline-none transition-all text-lg"
                            required
                        />

                        <Button
                            type="submit"
                            disabled={isLoading || !name}
                            className="w-full h-14 rounded-xl bg-[#E85C33] hover:bg-[#d54d26] text-white font-bold text-base"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <>Continuer <ArrowRight size={18} className="ml-2" /></>}
                        </Button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <MapPin className="text-[#E85C33]" size={32} />
                            </div>
                            <h1 className="text-2xl font-bold">Lien Google Maps</h1>
                            <p className="text-zinc-500">Collez le lien de votre fiche Google</p>
                        </div>

                        <input
                            type="url"
                            value={googleLink}
                            onChange={(e) => setGoogleLink(e.target.value)}
                            placeholder="https://maps.google.com/..."
                            className="w-full h-14 px-4 rounded-xl border border-zinc-200 focus:border-[#E85C33] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        />

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 rounded-xl bg-[#E85C33] hover:bg-[#d54d26] text-white font-bold text-base"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <>Continuer <ArrowRight size={18} className="ml-2" /></>}
                        </Button>
                    </form>
                )}

                {step === 3 && (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <Check className="text-green-600" size={40} />
                        </div>
                        <h1 className="text-2xl font-bold">Configuration terminée !</h1>
                        <p className="text-zinc-500">
                            Votre établissement &quot;{name}&quot; est prêt à recevoir des avis.
                        </p>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#E85C33] text-white font-bold rounded-xl hover:bg-[#d54d26] transition-colors"
                        >
                            Accéder au Dashboard
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
