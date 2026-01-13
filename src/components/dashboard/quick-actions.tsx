"use client"

import { useState } from "react"
import { Send, QrCode, ClipboardList, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SendCampaignModal } from "@/components/dashboard/send-campaign-modal"
import { QrKitModal } from "@/components/dashboard/qr-kit-modal"
import { getEstablishmentByUserId } from "@/actions/establishments"
import { getConversationsForEstablishment } from "@/actions/conversations"

export function QuickActions() {
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false)
    const [isQrModalOpen, setIsQrModalOpen] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        setIsExporting(true)
        try {
            // 1. Get Establishment ID
            const estResult = await getEstablishmentByUserId()
            if (!estResult.success || !estResult.data) {
                alert("Erreur: Établissement non trouvé")
                return
            }

            // 2. Fetch all conversations (limit 1000 for MVP)
            const convResult = await getConversationsForEstablishment({
                establishmentId: estResult.data.id,
                limit: 1000
            })

            if (!convResult.success || !convResult.data) {
                alert("Erreur lors de la récupération des données")
                return
            }

            // 3. Generate CSV
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

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n')

            // 4. Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `avis_reput_${new Date().toISOString().slice(0, 10)}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

        } catch (error) {
            console.error("Export error", error)
            alert("Une erreur est survenue lors de l'export")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <>
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-zinc-900 mb-6">Actions Rapides</h2>

                <div className="space-y-4">
                    <Button
                        onClick={() => setIsCampaignModalOpen(true)}
                        className="w-full h-auto py-4 justify-start bg-orange-50 hover:bg-orange-100 text-[#E85C33] border border-orange-100 shadow-none group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm group-hover:scale-105 transition-transform text-[#E85C33]">
                            <Send size={20} />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-zinc-900">Nouvelle Relance</p>
                            <p className="text-xs text-zinc-500">Envoyer une demande d'avis manuelle</p>
                        </div>
                    </Button>

                    <Button
                        onClick={() => setIsQrModalOpen(true)}
                        className="w-full h-auto py-4 justify-start bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border border-zinc-100 shadow-none group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm group-hover:scale-105 transition-transform text-zinc-600">
                            <QrCode size={20} />
                        </div>
                        <div className="text-left">
                            <p className="font-bold">Mon QR Code</p>
                            <p className="text-xs text-zinc-500">Télécharger ou imprimer vos supports</p>
                        </div>
                    </Button>

                    <Button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full h-auto py-4 justify-start bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border border-zinc-100 shadow-none group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm group-hover:scale-105 transition-transform text-zinc-600">
                            {isExporting ? <Loader2 className="animate-spin" size={20} /> : <ClipboardList size={20} />}
                        </div>
                        <div className="text-left">
                            <p className="font-bold">Exporter les Avis</p>
                            <p className="text-xs text-zinc-500">Format CSV pour analyse</p>
                        </div>
                    </Button>
                </div>
            </div>

            <SendCampaignModal
                isOpen={isCampaignModalOpen}
                onClose={() => setIsCampaignModalOpen(false)}
            />

            <QrKitModal
                isOpen={isQrModalOpen}
                onClose={() => setIsQrModalOpen(false)}
            />
        </>
    )
}
