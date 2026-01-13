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
                                        <p className="text-zinc-500 text-sm">QR Code & Puce NFC</p>
                                    </div>
                                    <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6 flex-1 overflow-y-auto">
                                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                        <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-2">
                                            <Info size={16} /> Ce qui est encodé
                                        </h3>
                                        <p className="text-sm text-blue-800 mb-2">
                                            Le QR Code et la puce NFC contiennent exactement le même lien :
                                        </p>
                                        <code className="block bg-white/50 p-2 rounded text-xs break-all text-blue-900 font-mono">
                                            {qrData?.waLink || 'https://wa.me/...'}
                                        </code>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 text-[#E85C33]">
                                                <QrCode size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-zinc-900">QR Code</h4>
                                                <p className="text-sm text-zinc-500">
                                                    Imprimez-le sur vos menus, cartes de visite ou chevalets de table.
                                                    Le client scanne avec sa caméra.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 text-[#E85C33]">
                                                <Smartphone size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-zinc-900">Puce NFC</h4>
                                                <p className="text-sm text-zinc-500">
                                                    Programmez vos tags NFC (si vous en avez) avec l&pos;URL ci-dessus.
                                                    Le client approche simplement son téléphone.
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
