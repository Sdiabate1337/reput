"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, Save, Loader2, MessageSquare, Link as LinkIcon, Copy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { getEstablishmentByUserId, getWebhookUrl, updateEstablishment } from "@/actions/establishments"

export default function SettingsPage() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Data
    const [name, setName] = useState("")
    const [adminPhone, setAdminPhone] = useState("")
    const [twilioNumber, setTwilioNumber] = useState("")
    const [webhookUrl, setWebhookUrl] = useState("")
    const [establishmentId, setEstablishmentId] = useState<string | null>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        async function loadSettings() {
            if (!user) return
            setIsLoading(true)
            try {
                // 1. Get Establishment
                const estResult = await getEstablishmentByUserId()
                if (estResult.success && estResult.data) {
                    setEstablishmentId(estResult.data.id)
                    setName(estResult.data.name)
                    setAdminPhone(estResult.data.admin_phone || "") // Load existing
                    setTwilioNumber(estResult.data.twilio_number || "Non configuré (Sandbox)")
                }

                // 2. Get Webhook URL
                const hookResult = await getWebhookUrl()
                if (hookResult.success && hookResult.data) {
                    setWebhookUrl(hookResult.data.url)
                }
            } catch (error) {
                console.error("Error loading settings", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadSettings()
    }, [user])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!establishmentId) return

        setIsSaving(true)
        setMessage(null)

        try {
            // Update name AND adminPhone
            const result = await updateEstablishment(establishmentId, { name, admin_phone: adminPhone })
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

    const copyWebhook = () => {
        navigator.clipboard.writeText(webhookUrl)
        // Simple toast
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#E85C33]" size={32} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FDFCF8] p-6 md:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center">
                        <Settings className="text-zinc-600" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900">Paramètres</h1>
                        <p className="text-zinc-500">Gérez votre établissement et connectivité</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* General Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-zinc-100 p-8"
                    >
                        <h2 className="text-lg font-bold text-zinc-900 mb-6">Général</h2>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Nom de l'établissement</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:border-[#E85C33] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Numéro Admin (Alertes Critiques)</label>
                                <input
                                    type="text"
                                    value={adminPhone}
                                    onChange={(e) => setAdminPhone(e.target.value)}
                                    placeholder="+212..."
                                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:border-[#E85C33] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                />
                                <p className="text-xs text-zinc-400">Reçoit les alertes WhatsApp en cas d'avis critique/grave.</p>
                            </div>

                            {message && (
                                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message.type === 'success' && <CheckCircle2 size={16} />}
                                    {message.text}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="w-full h-12 rounded-xl bg-[#E85C33] hover:bg-[#d54d26] text-white font-bold"
                            >
                                {isSaving ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <Save size={18} className="mr-2" /> Enregistrer
                                    </>
                                )}
                            </Button>
                        </form>
                    </motion.div>

                    {/* WhatsApp Configuration (US-1.3) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl border border-zinc-100 p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-zinc-900">Configuration WhatsApp</h2>
                                <p className="text-sm text-zinc-500">Connexion à Twilio</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                                <p className="text-sm font-medium text-zinc-500 mb-1">Numéro Connecté</p>
                                <p className="text-zinc-900 font-mono">{twilioNumber}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Webhook URL</label>
                                <div className="flex gap-2">
                                    <code className="flex-1 bg-zinc-100 p-3 rounded-xl text-xs font-mono text-zinc-600 truncate">
                                        {webhookUrl || "Chargement..."}
                                    </code>
                                    <Button onClick={copyWebhook} variant="outline" size="icon" className="shrink-0">
                                        <Copy size={16} />
                                    </Button>
                                </div>
                                <p className="text-xs text-zinc-400">
                                    À configurer dans votre console Twilio pour recevoir les messages.
                                </p>
                            </div>

                            <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-sm leading-relaxed">
                                <p className="font-bold mb-2 flex items-center gap-2">
                                    <LinkIcon size={16} /> Instructions
                                </p>
                                <ol className="list-decimal list-inside space-y-1 ml-1 opacity-90">
                                    <li>Créez un compte sur Twilio.com</li>
                                    <li>Achetez un numéro compatible WhatsApp</li>
                                    <li>Dans "Messaging &gt; Senders &gt; WhatsApp", configurez le Webhook ci-dessus.</li>
                                    <li>Contactez le support pour valider votre numéro Business API.</li>
                                </ol>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
