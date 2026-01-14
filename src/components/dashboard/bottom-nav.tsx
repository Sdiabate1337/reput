"use client"

import { BarChart2, QrCode, ClipboardList, Settings, Menu, PlusCircle, Send, X, Loader2, MessageSquare } from "lucide-react"
import { useState } from "react"
import { QrKitModal } from "@/components/dashboard/qr-kit-modal"
import { SendCampaignModal } from "@/components/dashboard/send-campaign-modal"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { getEstablishmentByUserId } from "@/actions/establishments"
import { getConversationsForEstablishment } from "@/actions/conversations"
import { Button } from "@/components/ui/button"

export function BottomNav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isQrModalOpen, setIsQrModalOpen] = useState(false)
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        setIsExporting(true)
        try {
            const estResult = await getEstablishmentByUserId()
            if (!estResult.success || !estResult.data) {
                alert("Erreur: Établissement non trouvé")
                return
            }
            const convResult = await getConversationsForEstablishment({
                establishmentId: estResult.data.id,
                limit: 1000
            })
            if (!convResult.success || !convResult.data) {
                alert("Erreur lors de la récupération des données")
                return
            }
            const headers = ['Date', 'Client Name', 'Phone', 'Source', 'Sentiment', 'Status', 'Messages Count']
            const rows = convResult.data.conversations.map(c => [
                new Date(c.created_at).toLocaleDateString(),
                c.client_name || 'Inconnu',
                c.client_phone,
                c.source,
                c.sentiment || 'N/A',
                c.status,
                (c.messages as any[]).length
            ])
            const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `avis_reput_${new Date().toISOString().slice(0, 10)}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setIsMenuOpen(false)
        } catch (error) {
            console.error("Export error", error)
            alert("Une erreur est survenue lors de l'export")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <>
            {/* Nav Bar */}
            <div className="fixed bottom-0 left-0 right-0 h-20 pb-4 bg-white/90 backdrop-blur-lg border-t border-zinc-200/50 md:hidden z-50 px-8 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.03)] transition-all">
                {/* Stats (Home) */}
                <Link href="/dashboard" className="flex flex-col items-center gap-1.5 text-zinc-400 hover:text-zinc-900 transition-colors">
                    <BarChart2 size={24} strokeWidth={2.5} />
                </Link>

                {/* Inbox */}
                <Link href="/reviews" className="flex flex-col items-center gap-1.5 text-zinc-400 hover:text-zinc-900 transition-colors">
                    <MessageSquare size={24} strokeWidth={2.5} />
                </Link>

                {/* Central Action Button */}
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="flex flex-col items-center justify-center -mt-8 bg-[#E85C33] text-white w-14 h-14 rounded-full shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                    <PlusCircle size={28} strokeWidth={2.5} />
                </button>

                <Link href="/settings" className="flex flex-col items-center gap-1.5 text-zinc-400 hover:text-zinc-900 transition-colors">
                    <Settings size={24} strokeWidth={2} />
                </Link>
            </div>

            {/* Slide-up Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 pb-24 md:hidden border-t border-zinc-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-zinc-900">Actions Rapides</h3>
                                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} className="rounded-full h-8 w-8 bg-zinc-100 text-zinc-500">
                                    <X size={18} />
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => { setIsCampaignModalOpen(true); setIsMenuOpen(false) }}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-orange-50 text-[#E85C33] border border-orange-100 active:scale-[0.98] transition-all"
                                >
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <Send size={20} />
                                    </div>
                                    <div className="text-left">
                                        <span className="block font-bold">Nouvelle Relance</span>
                                        <span className="text-xs opacity-80">Envoyer une demande manuelle</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => { setIsQrModalOpen(true); setIsMenuOpen(false) }}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-zinc-50 text-zinc-900 border border-zinc-100 active:scale-[0.98] transition-all"
                                >
                                    <div className="bg-white p-2 rounded-lg shadow-sm text-zinc-600">
                                        <QrCode size={20} />
                                    </div>
                                    <div className="text-left">
                                        <span className="block font-bold">Mon QR Code</span>
                                        <span className="text-xs text-zinc-500">Imprimer le kit</span>
                                    </div>
                                </button>

                                <button
                                    onClick={handleExport}
                                    disabled={isExporting}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-zinc-50 text-zinc-900 border border-zinc-100 active:scale-[0.98] transition-all"
                                >
                                    <div className="bg-white p-2 rounded-lg shadow-sm text-zinc-600">
                                        {isExporting ? <Loader2 className="animate-spin" size={20} /> : <ClipboardList size={20} />}
                                    </div>
                                    <div className="text-left">
                                        <span className="block font-bold">Exporter les Avis</span>
                                        <span className="text-xs text-zinc-500">Format CSV</span>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <QrKitModal
                isOpen={isQrModalOpen}
                onClose={() => setIsQrModalOpen(false)}
            />
            <SendCampaignModal
                isOpen={isCampaignModalOpen}
                onClose={() => setIsCampaignModalOpen(false)}
            />
        </>
    )
}
