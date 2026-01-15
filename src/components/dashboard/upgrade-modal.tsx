
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

interface UpgradeModalProps {
    isOpen: boolean
    onClose: () => void
    feature?: string
}

export function UpgradeModal({ isOpen, onClose, feature }: UpgradeModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-0 shadow-2xl">
                <div className="bg-[#E85C33] p-6 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4">
                            <Sparkles size={24} className="text-white" />
                        </div>
                        <DialogTitle className="text-2xl font-bold mb-2">Passez au niveau supérieur</DialogTitle>
                        <DialogDescription className="text-white/80 text-center">
                            {feature ? `La fonctionnalité "${feature}" est réservée aux membres Pro.` : "Débloquez tout le potentiel de Reput.ai"}
                        </DialogDescription>
                    </div>
                </div>

                <div className="p-6 bg-white">
                    <div className="space-y-4 mb-6">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="text-[#E85C33] mt-0.5" size={20} />
                            <span className="text-sm text-zinc-600 font-medium">Réponses automatiques par IA</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="text-[#E85C33] mt-0.5" size={20} />
                            <span className="text-sm text-zinc-600 font-medium">Connexion WhatsApp Business</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="text-[#E85C33] mt-0.5" size={20} />
                            <span className="text-sm text-zinc-600 font-medium">Support Prioritaire 7j/7</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={onClose}>
                            Plus tard
                        </Button>
                        <Link href="/pricing" className="flex-1">
                            <Button className="w-full bg-[#E85C33] hover:bg-[#D54D26] font-bold gap-2">
                                <Zap size={16} fill="currentColor" />
                                Voir les offres
                            </Button>
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
