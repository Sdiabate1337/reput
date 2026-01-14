"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Phone, CheckCircle2, AlertTriangle, Send, Hourglass } from "lucide-react"
import { requestWhatsAppConnection, submitWhatsAppCode } from "@/actions/onboarding-whatsapp"

interface WhatsAppConnectionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentStatus?: 'PENDING' | 'REQUESTED' | 'CODE_SENT' | 'VERIFYING' | 'ACTIVE' | 'FAILED'
    establishmentId: string
}

export function WhatsAppConnectionDialog({
    open,
    onOpenChange,
    currentStatus = 'PENDING',
    establishmentId
}: WhatsAppConnectionDialogProps) {
    const [step, setStep] = useState(
        currentStatus === 'VERIFYING' ? 3 :
            currentStatus === 'CODE_SENT' ? 2 :
                currentStatus === 'REQUESTED' ? 1 :
                    currentStatus === 'ACTIVE' ? 4 : 0
    )
    const [phoneNumber, setPhoneNumber] = useState("")
    const [code, setCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Step 0: Request Connection
    const handleRequest = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await requestWhatsAppConnection(establishmentId, phoneNumber)
            if (res.success) {
                setStep(1) // Requested
            } else {
                setError(res.error || "Erreur")
            }
        } catch (e) {
            setError("Erreur de connexion")
        } finally {
            setIsLoading(false)
        }
    }

    // Step 2: Submit Code (if we are in Code Sent mode)
    // Note: Step 1 is just a "Waiting" screen, ideally user comes back when they receive the code.
    // We can add a button "J'ai reçu un code" to go to Step 2 manually.

    const handleSubmitCode = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await submitWhatsAppCode(establishmentId, code)
            if (res.success) {
                setStep(3) // Success
            } else {
                setError(res.error || "Code invalide")
            }
        } catch (e) {
            setError("Erreur")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Connexion WhatsApp</DialogTitle>
                    <DialogDescription>
                        Utilisez votre propre numéro pour échanger avec vos clients.
                    </DialogDescription>
                </DialogHeader>

                {step === 0 && (
                    <div className="space-y-4 py-4">
                        <div className="bg-orange-50 p-4 rounded-xl flex gap-3 text-orange-800 text-sm">
                            <AlertTriangle size={20} className="shrink-0" />
                            <p>Nous allons configurer votre numéro manuellement. Cela peut prendre quelques heures.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Votre Numéro WhatsApp Business</label>
                            <div className="flex gap-2">
                                <div className="h-10 px-3 bg-zinc-100 border border-zinc-200 rounded-md flex items-center text-zinc-500 text-sm">+212</div>
                                <Input
                                    placeholder="6 00 00 00 00"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                        <Button className="w-full bg-[#E85C33] hover:bg-[#D54D26]" onClick={handleRequest} disabled={isLoading || !phoneNumber}>
                            {isLoading ? <Loader2 className="animate-spin" /> : "Demander la connexion"}
                        </Button>

                        {/* If user already requested but came back to enter code */}
                        <div className="text-center pt-2">
                            <button onClick={() => setStep(2)} className="text-xs text-zinc-400 hover:text-zinc-600 underline">
                                J'ai déjà reçu mon code de vérification
                            </button>
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-6 py-8 text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                            <ClockIcon className="text-yellow-600" size={32} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Demande envoyée !</h3>
                            <p className="text-zinc-500 text-sm mt-2">
                                Notre équipe va initier la connexion. <br />
                                Vous recevrez un code SMS/WhatsApp de la part de Facebook/Twilio.
                            </p>
                        </div>
                        <Button variant="outline" className="w-full" onClick={() => setStep(2)}>
                            J'ai reçu le code
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 py-4">
                        <div className="bg-zinc-50 p-4 rounded-xl text-center">
                            <p className="text-sm text-zinc-600 mb-4">Entrez le code de vérification reçu sur votre mobile.</p>
                            <Input
                                className="text-center text-2xl tracking-widest h-14 font-mono uppercase"
                                placeholder="123 456"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                maxLength={8}
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                        <Button className="w-full bg-[#E85C33] hover:bg-[#D54D26]" onClick={handleSubmitCode} disabled={isLoading || !code}>
                            {isLoading ? <Loader2 className="animate-spin" /> : "Valider le code"}
                        </Button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 py-8 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
                            <Hourglass className="text-blue-600" size={32} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Code transmis !</h3>
                            <p className="text-zinc-500 text-sm mt-2">
                                Nous validons la connexion avec WhatsApp.<br />
                                Votre statut passera à <strong>Actif</strong> sous peu.
                            </p>
                        </div>
                        <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                            Fermer
                        </Button>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6 py-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="text-green-600" size={32} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Connexion Active !</h3>
                        </div>
                        <Button className="w-full bg-zinc-900 text-white" onClick={() => onOpenChange(false)}>
                            Terminer
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

function ClockIcon({ className, size }: { className?: string, size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
