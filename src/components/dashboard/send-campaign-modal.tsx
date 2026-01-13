"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, User, Phone, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sendReviewRequest } from "@/actions/outbound"

interface SendCampaignModalProps {
    isOpen: boolean
    onClose: () => void
}

export function SendCampaignModal({ isOpen, onClose }: SendCampaignModalProps) {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !phone) return

        setIsLoading(true)
        setStatus('idle')

        try {
            const result = await sendReviewRequest({ clientName: name, clientPhone: phone })

            if (result.success) {
                setStatus('success')
                setTimeout(() => {
                    onClose()
                    // Reset form after close animation
                    setTimeout(() => {
                        setName("")
                        setPhone("")
                        setStatus('idle')
                    }, 300)
                }, 2000)
            } else {
                setStatus('error')
                setErrorMessage(result.error || "Erreur lors de l'envoi")
            }
        } catch (error) {
            setStatus('error')
            setErrorMessage("Une erreur est survenue")
        } finally {
            setIsLoading(false)
        }
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
                        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-zinc-50/50">
                                <div>
                                    <h3 className="text-lg font-bold text-zinc-900">Nouvelle Relance</h3>
                                    <p className="text-sm text-zinc-500">Envoyer une demande d&apos;avis manuelle</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                {status === 'success' ? (
                                    <div className="text-center py-8 space-y-4">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <h4 className="text-xl font-bold text-zinc-900">Message Envoyé !</h4>
                                        <p className="text-zinc-500">Votre client a reçu la demande d&apos;avis.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-700">Nom du client</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Karim Ben..."
                                                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-zinc-200 focus:border-[#E85C33] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-700">Numéro WhatsApp</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="+212 6..."
                                                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-zinc-200 focus:border-[#E85C33] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                            <p className="text-xs text-zinc-400 flex items-center gap-1">
                                                <AlertCircle size={12} />
                                                Le numéro doit avoir WhatsApp installé
                                            </p>
                                        </div>

                                        {status === 'error' && (
                                            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg flex items-center gap-2">
                                                <AlertCircle size={16} />
                                                {errorMessage}
                                            </p>
                                        )}

                                        <div className="pt-2">
                                            <Button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full h-14 rounded-xl bg-[#E85C33] hover:bg-[#d54d26] text-white font-bold text-base shadow-lg shadow-orange-500/20"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="animate-spin" />
                                                ) : (
                                                    <>
                                                        Envoyer la demande <Send size={18} className="ml-2" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
