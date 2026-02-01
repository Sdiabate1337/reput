"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, Save, Loader2, MessageSquare, Link as LinkIcon, Copy, CheckCircle2, History, AlertTriangle, RefreshCw, Sparkles, Star, MessageCircleQuestion, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { getEstablishmentByUserId, updateEstablishment } from "@/actions/establishments"
import { WhatsAppConnectionDialog } from "@/components/dashboard/whatsapp-connection-dialog"
import { Input } from "@/components/ui/input"
import { WhatsAppPreview } from "@/components/settings/whatsapp-preview"
import { MessageEditor } from "@/components/settings/message-editor"

type WhatsAppStatus = 'PENDING' | 'REQUESTED' | 'CODE_SENT' | 'VERIFYING' | 'ACTIVE' | 'FAILED'

export default function SettingsPage() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [activePreview, setActivePreview] = useState<'WELCOME' | 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'REQUEST'>('REQUEST')

    // Data
    const [name, setName] = useState("")
    const [adminPhone, setAdminPhone] = useState("")
    const [googleMapsLink, setGoogleMapsLink] = useState("")
    const [googlePlaceId, setGooglePlaceId] = useState("")
    const [customMessageNeutral, setCustomMessageNeutral] = useState("")
    const [customMessageNegative, setCustomMessageNegative] = useState("")
    const [customMessageWelcome, setCustomMessageWelcome] = useState("")
    const [customMessagePositive, setCustomMessagePositive] = useState("")
    const [customMessageRequest, setCustomMessageRequest] = useState("")
    const [
        whatsappStatus,
        setWhatsappStatus
    ] = useState<WhatsAppStatus>('PENDING')
    const [twilioNumber, setTwilioNumber] = useState("")
    const [plan, setPlan] = useState<'startup' | 'pro' | 'enterprise'>('startup')
    const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)
    const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null)

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
                setGooglePlaceId(data.google_place_id || "")
                setCustomMessageNeutral(data.custom_message_neutral || "")
                setCustomMessageNegative(data.custom_message_negative || "")
                setCustomMessageWelcome(data.custom_message_welcome || "")
                setCustomMessagePositive(data.custom_message_positive || "")
                setCustomMessageRequest(data.custom_message_request || "")
                setWhatsappStatus(data.whatsapp_onboarding_status || 'PENDING')
                setTwilioNumber(data.twilio_number || "")
                setPlan(data.plan || 'startup')
                setSubscriptionStatus(data.subscription_status)
                setTrialEndsAt(data.trial_ends_at)
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
                google_maps_link: googleMapsLink,
                google_place_id: googlePlaceId,
                custom_message_neutral: customMessageNeutral,
                custom_message_negative: customMessageNegative,
                custom_message_welcome: customMessageWelcome,
                custom_message_positive: customMessagePositive,
                custom_message_request: customMessageRequest
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

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700 flex items-center justify-between">
                                    <span>Google Place ID (Optionnel)</span>
                                    <a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 font-normal hover:underline">
                                        Comment le trouver ?
                                    </a>
                                </label>
                                <Input
                                    value={googlePlaceId}
                                    onChange={(e) => setGooglePlaceId(e.target.value)}
                                    placeholder="Ex: ChIJ..."
                                    className="h-12 bg-zinc-50 border-zinc-200 text-base font-mono"
                                />
                                <p className="text-[10px] text-zinc-400 font-medium">Recommandé pour rediriger directement vers la fenêtre "5 étoiles".</p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-zinc-100">
                                <h2 className="text-lg md:text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                    <MessageSquare size={20} className="text-[#E85C33]" />
                                    Personnalisation des Messages
                                </h2>

                                <div className="flex flex-col xl:flex-row gap-8 items-start">
                                    {/* Left: Editors */}
                                    <div className="flex-1 space-y-6 w-full">

                                        <MessageEditor
                                            label="Message de Bienvenue"
                                            subLabel="Envoyé après un scan QR Code"
                                            value={customMessageWelcome}
                                            onChange={setCustomMessageWelcome}
                                            icon={<Sparkles className="text-purple-500" size={20} />}
                                            onFocus={() => setActivePreview('WELCOME')}
                                            color="default"
                                        />

                                        <MessageEditor
                                            label="Message de Relance"
                                            subLabel="Envoyé manuellement pour demander un avis"
                                            value={customMessageRequest}
                                            onChange={setCustomMessageRequest}
                                            icon={<MessageSquare className="text-blue-500" size={20} />}
                                            onFocus={() => setActivePreview('REQUEST')}
                                            variables={['{{name}}']}
                                            color="default"
                                        />

                                        <MessageEditor
                                            label="Avis Positif (5/5)"
                                            subLabel="Demande d'avis Google"
                                            value={customMessagePositive}
                                            onChange={setCustomMessagePositive}
                                            variables={['{{name}}', '{{link}}']}
                                            icon={<Star className="text-yellow-500 fill-yellow-500" size={20} />}
                                            onFocus={() => setActivePreview('POSITIVE')}
                                            color="green"
                                        />

                                        <MessageEditor
                                            label="Avis Mitigé (3-4/5)"
                                            subLabel="Demande de feedback (Privé)"
                                            value={customMessageNeutral}
                                            onChange={setCustomMessageNeutral}
                                            icon={<MessageCircleQuestion className="text-orange-500" size={20} />}
                                            onFocus={() => setActivePreview('NEUTRAL')}
                                            color="orange"
                                        />

                                        <MessageEditor
                                            label="Avis Négatif (1-2/5)"
                                            subLabel="Message d'apaisement (Privé)"
                                            value={customMessageNegative}
                                            onChange={setCustomMessageNegative}
                                            icon={<ShieldAlert className="text-red-500" size={20} />}
                                            onFocus={() => setActivePreview('NEGATIVE')}
                                            color="red"
                                        />

                                    </div>

                                    {/* Right: Preview (Sticky) */}
                                    <div className="hidden xl:block w-[350px] sticky top-8 shrink-0">
                                        <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm">
                                            <h3 className="text-sm font-bold text-zinc-500 mb-4 text-center uppercase tracking-wider">Aperçu en direct</h3>
                                            <WhatsAppPreview
                                                message={
                                                    activePreview === 'WELCOME' ? customMessageWelcome :
                                                        activePreview === 'POSITIVE' ? customMessagePositive :
                                                            activePreview === 'NEUTRAL' ? customMessageNeutral :
                                                                activePreview === 'NEGATIVE' ? customMessageNegative :
                                                                    customMessageRequest // REQUEST
                                                }
                                                type={activePreview}
                                                establishmentName={name || "Mon Établissement"}
                                            />
                                            <p className="text-center text-xs text-zinc-400 mt-4">
                                                Ceci est une simulation. L'affichage réel peut varier selon l'appareil du client.
                                            </p>
                                        </div>
                                    </div>
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

                {/* Subscription Section */}
                <div className="pt-6 border-t border-zinc-100 mt-8">
                    <h3 className="text-sm font-bold text-zinc-900 mb-4">Abonnement</h3>
                    <div className="bg-zinc-50 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-zinc-900">
                                    {plan === 'pro' ? 'Plan Pro' : plan === 'enterprise' ? 'Enterprise' : 'Plan Startup'}
                                </span>
                                {subscriptionStatus === 'TRIAL' && (
                                    <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        Essai Gratuit
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-zinc-500">
                                {subscriptionStatus === 'TRIAL' && trialEndsAt ? (
                                    <>Fin de l'essai le {new Date(trialEndsAt).toLocaleDateString()}</>
                                ) : (
                                    <>Gérez votre facturation et votre plan.</>
                                )}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.location.href = '/pricing'}
                            className="h-9 text-xs"
                        >
                            Changer de plan
                        </Button>
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
