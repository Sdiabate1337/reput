"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Link as LinkIcon, Smartphone, QrCode, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateQRCode } from "@/actions/qr"
import { useAuth } from "@/lib/auth-context"

interface QrKitModalProps {
    isOpen: boolean
    onClose: () => void
}

export function QrKitModal({ isOpen, onClose }: QrKitModalProps) {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [qrData, setQrData] = useState<{ qrDataUrl: string, waLink: string } | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen && user) {
            loadQrCode()
        }
    }, [isOpen, user])

    async function loadQrCode() {
        setIsLoading(true)
        setError(null)
        try {
            // Need to pass userId explicitly if not in server context logic, 
            // but generateQRCode uses establishment query by user_id. 
            // The action expects userId as argument.
            if (!user) return
            const result = await generateQRCode(user.id)

            if (result.success && result.data) {
                setQrData(result.data)
            } else {
                setError(result.error || "Erreur de génération")
            }
        } catch (err) {
            setError("Impossible de charger le QR code")
        } finally {
            setIsLoading(false)
        }
    }

    const downloadQr = () => {
        if (!qrData) return
        const link = document.createElement("a")
        link.href = qrData.qrDataUrl
        link.download = "reput-qr-code.png"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const copyLink = () => {
        if (!qrData) return
        navigator.clipboard.writeText(qrData.waLink)
        // Could show toast here
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col md:flex-row max-h-[90vh]">

                            {/* Left: QR Display */}
                            <div className="md:w-1/2 p-8 bg-zinc-50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-100 relative">
                                {isLoading ? (
                                    <Loader2 className="animate-spin text-zinc-300" size={48} />
                                ) : error ? (
                                    <div className="text-center text-red-500">
                                        <p>{error}</p>
                                        <Button variant="outline" onClick={loadQrCode} className="mt-4">Réessayer</Button>
                                    </div>
                                ) : qrData ? (
                                    <>
                                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 mb-6">
                                            <img src={qrData.qrDataUrl} alt="QR Code" className="w-56 h-56 object-contain" />
                                        </div>
                                        <div className="flex gap-2 w-full">
                                            <Button onClick={downloadQr} className="flex-1 bg-[#E85C33] hover:bg-[#d54d26] text-white">
                                                <Download size={16} className="mr-2" /> PNG
                                            </Button>
                                            <Button onClick={copyLink} variant="outline" className="flex-1">
                                                <LinkIcon size={16} className="mr-2" /> Lien
                                            </Button>
                                        </div>
                                    </>
                                ) : null}
                            </div>

                            {/* Right: Info & Explanations */}
                            <div className="md:w-1/2 p-8 flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900">Mon QR Kit</h2>
                                        <p className="text-zinc-500 text-sm">Votre kit de collecte d&apos;avis</p>
                                    </div>
                                    <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="flex-1 flex flex-col justify-center">
                                    {/* Simple Usage Guide */}
                                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#E85C33]/10 via-orange-50 to-amber-50 border border-[#E85C33]/20 shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E85C33] to-orange-500 flex items-center justify-center shrink-0 shadow-md">
                                                <span className="text-white text-xl">📋</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-zinc-900 text-lg mb-2">Comment utiliser</h3>
                                                <p className="text-zinc-600 leading-relaxed">
                                                    Téléchargez le QR Code et imprimez-le sur vos <strong className="text-zinc-800">menus</strong>, <strong className="text-zinc-800">tables</strong> ou <strong className="text-zinc-800">au comptoir</strong>.
                                                </p>
                                                <p className="text-zinc-500 text-sm mt-3">
                                                    Vos clients n&apos;ont qu&apos;à le scanner pour laisser leur avis instantanément.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
