"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, Save, Loader2, MessageSquare, Link as LinkIcon, Copy, CheckCircle2, History, AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { getEstablishmentByUserId, updateEstablishment } from "@/actions/establishments"
import { WhatsAppConnectionDialog } from "@/components/dashboard/whatsapp-connection-dialog"
import { Input } from "@/components/ui/input"

type WhatsAppStatus = 'PENDING' | 'REQUESTED' | 'CODE_SENT' | 'VERIFYING' | 'ACTIVE' | 'FAILED'

export default function SettingsPage() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // Data
    const [name, setName] = useState("")
    const [adminPhone, setAdminPhone] = useState("")
    const [googleMapsLink, setGoogleMapsLink] = useState("")
    const [
        whatsappStatus,
        setWhatsappStatus
    ] = useState<WhatsAppStatus>('PENDING')
    const [twilioNumber, setTwilioNumber] = useState("")

    const [establishmentId, setEstablishmentId] = useState<string | null>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [isWhatsAppDialogOpen, setIsWhatsAppDialogOpen] = useState(false)

    useEffect(() => {
        if (user) loadSettings()
    }, [user])

    const loadSettings = async () => {
        setIsLoading(true)
        try {
            const estResult = await getEstablishmentByUserId()
            if (estResult.success && estResult.data) {
                const data = estResult.data
                setEstablishmentId(data.id)
                setName(data.name)
                setAdminPhone(data.admin_phone || "")
                setGoogleMapsLink(data.google_maps_link || "")
                setWhatsappStatus(data.whatsapp_onboarding_status || 'PENDING')
                setTwilioNumber(data.twilio_number || "")
            }
        } catch (error) {
            console.error("Error loading settings", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!establishmentId) return

        setIsSaving(true)
        setMessage(null)

        try {
            const result = await updateEstablishment(establishmentId, {
                name,
                admin_phone: adminPhone,
                google_maps_link: googleMapsLink
            })

            if (result.success) {
                setMessage({ type: 'success', text: 'Paramètres enregistrés' })
            } else {
                setMessage({ type: 'error', text: result.error || 'Erreur' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Une erreur est survenue' })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8]">
                <Loader2 className="animate-spin text-[#E85C33]" size={32} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FDFCF8] p-4 pb-32 md:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 md:mb-10">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                        <Settings className="text-zinc-700" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">Paramètres</h1>
                        <p className="text-sm md:text-base text-zinc-500 font-medium">Gérez votre établissement et vos connectivités</p>
                    </div>
                </div>

                <div className="grid gap-6 md:gap-8">
                    {/* WhatsApp Status Card */}
                    <div className="bg-white rounded-3xl border border-zinc-200 p-6 md:p-8 shadow-sm overflow-hidden relative">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-4">
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${whatsappStatus === 'ACTIVE' ? 'bg-green-100 text-green-600' :
                                    whatsappStatus === 'VERIFYING' ? 'bg-blue-100 text-blue-600' :
                                        'bg-orange-100 text-orange-600'
                                    }`}>
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <h2 className="text-lg md:text-xl font-bold text-zinc-900">Connexion WhatsApp</h2>
                                    <p className="text-zinc-500 text-sm mt-1 flex flex-wrap items-center gap-1">
                                        Status:
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${whatsappStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                            whatsappStatus === 'VERIFYING' ? 'bg-blue-100 text-blue-700' :
                                                'bg-orange-100 text-orange-700'
                                            }`}>
                                            {whatsappStatus === 'ACTIVE' ? 'Actif' :
                                                whatsappStatus === 'VERIFYING' ? 'Vérification...' :
                                                    whatsappStatus === 'PENDING' ? 'Non configuré' :
                                                        'En cours...'}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {whatsappStatus !== 'ACTIVE' && (
                                <Button
                                    onClick={() => setIsWhatsAppDialogOpen(true)}
                                    className={`${whatsappStatus === 'VERIFYING'
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'bg-[#E85C33] hover:bg-[#d54d26]'
                                        } text-white rounded-xl font-bold px-6 w-full md:w-auto h-12 md:h-10`}
                                >
                                    {whatsappStatus === 'PENDING' ? 'Connecter' : 'Continuer'}
                                </Button>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-zinc-100">
                            {whatsappStatus === 'ACTIVE' ? (
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 text-sm text-zinc-600 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="text-green-500 shrink-0" size={18} />
                                        <span>Numéro connecté :</span>
                                    </div>
                                    <code className="bg-white px-2 py-1 rounded border border-zinc-100 font-mono font-bold">{twilioNumber}</code>
                                </div>
                            ) : (
                                <div className="text-sm text-zinc-500 leading-relaxed">
                                    <p className="flex items-start gap-2 mb-2">
                                        <AlertTriangle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                                        <span>Configuration requise pour répondre aux avis.</span>
                                    </p>
                                    <p className="pl-6 text-xs md:text-sm">
                                        Nous connectons votre numéro via l'API officielle WhatsApp Business.
                                        <br className="hidden md:block" /> Aucun smartphone requis pour que ça fonctionne.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* General Form */}
                    <div className="bg-white rounded-3xl border border-zinc-200 p-6 md:p-8 shadow-sm">
                        <h2 className="text-lg md:text-xl font-bold text-zinc-900 mb-6">Informations Générales</h2>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700">Nom de l'établissement</label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-12 bg-zinc-50 border-zinc-200 text-base"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700">Numéro Admin</label>
                                    <Input
                                        value={adminPhone}
                                        onChange={(e) => setAdminPhone(e.target.value)}
                                        placeholder="+212..."
                                        className="h-12 bg-zinc-50 border-zinc-200 text-base"
                                    />
                                    <p className="text-[10px] text-zinc-400 font-medium">Pour les alertes urgentes</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700">Lien des Avis</label>
                                <div className="flex gap-3">
                                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                                        <LinkIcon size={20} />
                                    </div>
                                    <Input
                                        value={googleMapsLink}
                                        onChange={(e) => setGoogleMapsLink(e.target.value)}
                                        placeholder="https://g.page/..."
                                        className="h-12 bg-zinc-50 border-zinc-200 text-base"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
                                {message ? (
                                    <div className={`w-full md:w-auto p-3 rounded-lg text-sm font-medium flex items-center gap-2 justify-center md:justify-start ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                                        {message.text}
                                    </div>
                                ) : <div />}

                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full md:w-auto h-12 px-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-base"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" /> : "Enregistrer"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {establishmentId && (
                <WhatsAppConnectionDialog
                    open={isWhatsAppDialogOpen}
                    onOpenChange={(open) => {
                        setIsWhatsAppDialogOpen(open)
                        if (!open) loadSettings() // Refresh status on close
                    }}
                    establishmentId={establishmentId}
                    currentStatus={whatsappStatus}
                />
            )}
        </div>
    )
}
