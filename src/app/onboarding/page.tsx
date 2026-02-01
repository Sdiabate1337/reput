"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, Star, ArrowRight, Loader2, Check, QrCode, Download, Link as LinkIcon, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import {
    createEstablishment,
    updateEstablishment,
    validateGoogleMapsLink,
    getEstablishmentByUserId
} from "@/actions/establishments"
import { generateQRCode } from "@/actions/qr"
import { useAuth } from "@/lib/auth-context"

type Platform = 'google' | 'booking' | 'tripadvisor' | 'other'

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
    const [platform, setPlatform] = useState<Platform>('google')
    const [reviewLink, setReviewLink] = useState("")

    // QR Data
    const [qrData, setQrData] = useState<{ qrDataUrl: string; waLink: string } | null>(null)

    // Load existing data
    useEffect(() => {
        async function loadData() {
            if (!user) return
            const result = await getEstablishmentByUserId()
            if (result.success && result.data) {
                setEstablishmentId(result.data.id)
                setName(result.data.name)
                if (result.data.google_maps_link) {
                    setReviewLink(result.data.google_maps_link)
                    setStep(4) // Go to QR step
                } else {
                    setStep(2) // Name set, link missing
                }
            }
        }
        loadData()
    }, [user])

    // Auto-generate QR when step 4 is reached
    useEffect(() => {
        async function loadQR() {
            if (step === 4 && !qrData && user) {
                const result = await generateQRCode(user.id)
                if (result.success && result.data) {
                    setQrData(result.data)
                }
            }
        }
        loadQR()
    }, [step, qrData, user])

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

    // Step 2: Platform + Link
    const handleLinkSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            // Validate link
            const validation = await validateGoogleMapsLink(reviewLink)
            if (!validation.success || !validation.data?.valid) {
                setError("Lien invalide. Vérifiez le format.")
                setIsLoading(false)
                return
            }

            // Save link
            if (establishmentId) {
                const update = await updateEstablishment(establishmentId, {
                    google_maps_link: validation.data.normalizedLink || reviewLink
                })

                if (update.success) {
                    setStep(3) // Go to preview
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

    // Step 3: Generate QR and redirect to dashboard with modal
    const handleGenerateQR = async () => {
        if (!user) return
        setIsLoading(true)

        try {
            const result = await generateQRCode(user.id)
            if (result.success && result.data) {
                // Redirect to dashboard with showQrKit parameter to open modal
                router.push('/dashboard?showQrKit=true')
            } else {
                setError(result.error || "Erreur de génération QR")
                setIsLoading(false)
            }
        } catch (err) {
            setError("Une erreur est survenue")
            setIsLoading(false)
        }
    }

    // Download QR
    const downloadQr = () => {
        if (!qrData) return
        const link = document.createElement("a")
        link.href = qrData.qrDataUrl
        link.download = `qr-${name.toLowerCase().replace(/\s+/g, '-')}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Copy link
    const copyLink = () => {
        if (!qrData) return
        navigator.clipboard.writeText(qrData.waLink)
    }

    const platforms = [
        {
            id: 'google',
            label: 'Google Reviews',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
            )
        },
        {
            id: 'booking',
            label: 'Booking.com',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#003580">
                    <path d="M2.27 6.06v11.88h4.54c3.29 0 5.1-1.87 5.1-4.36 0-1.67-.82-3.03-2.35-3.62.94-.53 1.62-1.5 1.62-2.82 0-2.23-1.6-3.71-4.64-3.71H2.27v2.63zm3.84.04c1.13 0 1.77.47 1.77 1.32 0 .87-.64 1.35-1.77 1.35H5.2V6.1h.91zm.25 5.38c1.33 0 2.06.56 2.06 1.57 0 .99-.73 1.57-2.06 1.57H5.2v-3.14h1.16zm9.28-2.66c-2.54 0-4.36 1.87-4.36 4.31v1.14c0 2.45 1.82 4.32 4.36 4.32 2.52 0 4.34-1.87 4.34-4.32v-1.14c0-2.44-1.82-4.31-4.34-4.31zm1.38 5.45c0 .94-.56 1.56-1.38 1.56-.84 0-1.4-.62-1.4-1.56v-1.14c0-.93.56-1.56 1.4-1.56.82 0 1.38.63 1.38 1.56v1.14z" />
                </svg>
            )
        },
        {
            id: 'tripadvisor',
            label: 'TripAdvisor',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00AF87">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    <circle cx="8.5" cy="10" r="1.5" />
                    <circle cx="15.5" cy="10" r="1.5" />
                </svg>
            )
        },
        {
            id: 'other',
            label: 'Autre',
            icon: <LinkIcon className="w-5 h-5 text-zinc-500" />
        },
    ]

    return (
        <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <div className="flex justify-center mb-8">
                    <Logo />
                </div>

                <div className="bg-white rounded-3xl border border-zinc-100 shadow-xl p-8">
                    {/* Progress */}
                    <div className="flex items-center gap-2 mb-8">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`flex-1 h-2 rounded-full transition-colors duration-300 ${s <= step ? "bg-[#E85C33]" : "bg-zinc-100"
                                    }`}
                            />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {/* STEP 1: Name */}
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleNameSubmit}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Building2 className="text-[#E85C33]" size={32} />
                                    </div>
                                    <h1 className="text-2xl font-bold">Bienvenue sur ReviewMe</h1>
                                    <p className="text-zinc-500 mt-2">
                                        Rejoignez les premiers établissements marocains qui augmentent leurs avis Google automatiquement.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                                        Nom de votre établissement
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ex: Le Petit Bistro"
                                        className="w-full h-14 px-4 rounded-xl border border-zinc-200 focus:border-[#E85C33] focus:ring-2 focus:ring-orange-100 outline-none transition-all text-lg"
                                        required
                                    />
                                </div>

                                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                                <div className="flex items-center justify-center gap-4 text-xs text-zinc-400">
                                    <span className="flex items-center gap-1">✓ Gratuit</span>
                                    <span className="flex items-center gap-1">✓ Aucune CB</span>
                                    <span className="flex items-center gap-1">✓ Moins de 3 min</span>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading || !name}
                                    className="w-full h-14 rounded-xl bg-[#E85C33] hover:bg-[#d54d26] text-white font-bold text-base shadow-lg shadow-orange-500/10"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : <>Créer mon espace <ArrowRight size={18} className="ml-2" /></>}
                                </Button>
                            </motion.form>
                        )}

                        {/* STEP 2: Platform + Link */}
                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleLinkSubmit}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Star className="text-[#E85C33]" size={32} />
                                    </div>
                                    <h1 className="text-2xl font-bold">Où recevoir vos avis 5 étoiles?</h1>
                                    <p className="text-zinc-500 mt-2">
                                        Les clients satisfaits seront redirigés vers cette plateforme.
                                    </p>
                                </div>

                                {/* Platform selection */}
                                <div className="grid grid-cols-2 gap-3">
                                    {platforms.map((p) => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setPlatform(p.id as Platform)}
                                            className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${platform === p.id
                                                ? 'border-[#E85C33] bg-orange-50'
                                                : 'border-zinc-100 hover:border-zinc-200 bg-white'
                                                }`}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0">
                                                {p.icon}
                                            </div>
                                            <span className="text-sm font-medium text-left">{p.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                                        Collez votre lien d&apos;avis
                                    </label>
                                    <input
                                        type="url"
                                        value={reviewLink}
                                        onChange={(e) => setReviewLink(e.target.value)}
                                        placeholder="https://g.page/votre-resto/review"
                                        className="w-full h-14 px-4 rounded-xl border border-zinc-200 focus:border-[#E85C33] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                        required
                                    />
                                    <p className="text-xs text-zinc-400 mt-2">
                                        💡 Google Maps → Votre fiche → Partager → Copier le lien
                                    </p>
                                </div>

                                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                                <Button
                                    type="submit"
                                    disabled={isLoading || !reviewLink}
                                    className="w-full h-14 rounded-xl bg-[#E85C33] hover:bg-[#d54d26] text-white font-bold text-base shadow-lg shadow-orange-500/10"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : <>Continuer <ArrowRight size={18} className="ml-2" /></>}
                                </Button>

                                <div className="text-center">
                                    <button type="button" onClick={() => setStep(3)} className="text-sm text-zinc-400 hover:text-zinc-600">
                                        Configurer plus tard
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {/* STEP 3: Animation Preview */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Check className="text-green-600" size={32} />
                                    </div>
                                    <h1 className="text-2xl font-bold">Votre espace est prêt! 🎉</h1>
                                    <p className="text-zinc-500 mt-2">
                                        Voici comment ça fonctionne:
                                    </p>
                                </div>

                                {/* Simple animation */}
                                <div className="bg-zinc-50 rounded-2xl p-6 space-y-4">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <QrCode className="text-[#E85C33]" size={20} />
                                        </div>
                                        <div>
                                            <div className="font-medium">Client scanne votre QR</div>
                                            <div className="text-sm text-zinc-500">Sur table, menu ou comptoir</div>
                                        </div>
                                    </motion.div>

                                    <div className="border-l-2 border-dashed border-zinc-200 h-4 ml-5" />

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <Send className="text-green-500" size={20} />
                                        </div>
                                        <div>
                                            <div className="font-medium">Message WhatsApp auto</div>
                                            <div className="text-sm text-zinc-500">On lui demande son avis</div>
                                        </div>
                                    </motion.div>

                                    <div className="border-l-2 border-dashed border-zinc-200 h-4 ml-5" />

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <Star className="text-yellow-500" size={20} />
                                        </div>
                                        <div>
                                            <div className="font-medium">Avis 5★ sur Google</div>
                                            <div className="text-sm text-zinc-500">Les satisfaits sont redirigés</div>
                                        </div>
                                    </motion.div>
                                </div>

                                <Button
                                    onClick={handleGenerateQR}
                                    disabled={isLoading}
                                    className="w-full h-14 rounded-xl bg-[#E85C33] hover:bg-[#d54d26] text-white font-bold text-base shadow-lg shadow-orange-500/10"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : <>Générer mon QR <ArrowRight size={18} className="ml-2" /></>}
                                </Button>
                            </motion.div>
                        )}

                        {/* STEP 4: QR + Test */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-4">
                                    <h1 className="text-2xl font-bold">Voici votre QR Code!</h1>
                                </div>

                                {/* QR Display */}
                                {qrData ? (
                                    <div className="bg-zinc-50 rounded-2xl p-6 flex flex-col items-center">
                                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 mb-4">
                                            <img src={qrData.qrDataUrl} alt="QR Code" className="w-48 h-48 object-contain" />
                                        </div>
                                        <div className="flex gap-2 w-full max-w-xs">
                                            <Button onClick={downloadQr} className="flex-1 bg-[#E85C33] hover:bg-[#d54d26] text-white">
                                                <Download size={16} className="mr-2" /> PNG
                                            </Button>
                                            <Button onClick={copyLink} variant="outline" className="flex-1">
                                                <LinkIcon size={16} className="mr-2" /> Lien
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-zinc-50 rounded-2xl p-6 flex items-center justify-center h-64">
                                        <Loader2 className="animate-spin text-zinc-300" size={32} />
                                    </div>
                                )}

                                {/* Test via QR Scan */}
                                <div className="border-t border-zinc-100 pt-6">
                                    <h3 className="font-semibold mb-2">🧪 Testez l'expérience client!</h3>
                                    <p className="text-sm text-zinc-500 mb-4">
                                        Scannez le QR ci-dessus avec votre téléphone pour recevoir le <strong>vrai message</strong> avec les boutons interactifs.
                                    </p>

                                    <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                                                <QrCode className="text-green-600" size={18} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-green-800">Comment tester ?</div>
                                                <ol className="text-sm text-green-700 mt-2 space-y-1">
                                                    <li>1. Ouvrez l'appareil photo de votre téléphone</li>
                                                    <li>2. Scannez le QR Code affiché</li>
                                                    <li>3. Envoyez le message WhatsApp pré-rempli</li>
                                                    <li>4. Recevez le vrai template avec les 3 boutons!</li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Trial badge */}
                                <div className="text-center text-sm text-zinc-500">
                                    ✓ Essai gratuit de 14 jours activé
                                </div>

                                <Link
                                    href="/dashboard"
                                    className="block w-full h-14 rounded-xl bg-[#E85C33] hover:bg-[#d54d26] text-white font-bold text-base shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                                >
                                    Aller au Dashboard <ArrowRight size={18} />
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}
