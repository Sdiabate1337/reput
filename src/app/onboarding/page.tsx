"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Building2, MapPin, ArrowRight, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    createEstablishment,
    updateEstablishment,
    validateGoogleMapsLink,
    getEstablishmentByUserId
} from "@/actions/establishments"
import { useAuth } from "@/lib/auth-context"

export default function OnboardingPage() {
    const router = useRouter()
    const { user } = useAuth()

    // State
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Data
    const [establishmentId, setEstablishmentId] = useState<string | null>(null)
    const [name, setName] = useState("")
    const [googleLink, setGoogleLink] = useState("")

    // Load existing data
    useEffect(() => {
        async function loadData() {
            if (!user) return
            const result = await getEstablishmentByUserId()
            if (result.success && result.data) {
                setEstablishmentId(result.data.id)
                setName(result.data.name)
                if (result.data.google_maps_link) {
                    setGoogleLink(result.data.google_maps_link)
                    setStep(3) // Already done
                } else {
                    setStep(2) // Name set, link missing
                }
            }
        }
        loadData()
    }, [user])

    // Step 1: Create Establishment Name
    const handleNameSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const result = await createEstablishment({ name })

            if (result.success && result.data) {
                setEstablishmentId(result.data.id)
                setStep(2)
            } else {
                setError(result.error || "Erreur lors de la création")
            }
        } catch (err) {
            setError("Une erreur est survenue")
        } finally {
            setIsLoading(false)
        }
    }

    // Step 2: Google Maps Link
    const handleLinkSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            // Validate link
            const validation = await validateGoogleMapsLink(googleLink)
            if (!validation.success || !validation.data?.valid) {
                setError("Lien Google Maps invalide. Utilisez un lien 'maps.google.com' ou 'foo.gl'.")
                setIsLoading(false)
                return
            }

            // Save link
            if (establishmentId) {
                const update = await updateEstablishment(establishmentId, {
                    google_maps_link: validation.data.normalizedLink || googleLink
                })

                if (update.success) {
                    setStep(3)
                } else {
                    setError(update.error || "Erreur de sauvegarde")
                }
            }
        } catch (err) {
            setError("Une erreur est survenue")
        } finally {
            setIsLoading(false)
        }
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
                            className={`flex-1 h-2 rounded-full transition-colors duration-300 ${s <= step ? "bg-[#E85C33]" : "bg-zinc-100"
                                }`}
                        />
                    ))}
                </div>

                {step === 1 && (
                    <form onSubmit={handleNameSubmit} className="space-y-6">
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

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <Button
                            type="submit"
                            disabled={isLoading || !name}
                            className="w-full h-14 rounded-xl bg-[#E85C33] hover:bg-[#d54d26] text-white font-bold text-base shadow-lg shadow-orange-500/10"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <>Continuer <ArrowRight size={18} className="ml-2" /></>}
                        </Button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleLinkSubmit} className="space-y-6">
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
                            required
                        />

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 rounded-xl bg-[#E85C33] hover:bg-[#d54d26] text-white font-bold text-base shadow-lg shadow-orange-500/10"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <>Continuer <ArrowRight size={18} className="ml-2" /></>}
                        </Button>

                        <div className="text-center">
                            <button type="button" onClick={() => setStep(3)} className="text-sm text-zinc-400 hover:text-zinc-600">
                                Passer pour l'instant
                            </button>
                        </div>
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
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#E85C33] text-white font-bold rounded-xl hover:bg-[#d54d26] transition-colors shadow-lg shadow-orange-500/20"
                        >
                            Accéder au Dashboard
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
