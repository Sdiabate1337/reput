"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Layout, Code2, Globe } from "lucide-react"

interface ShowcaseModalProps {
    isOpen: boolean
    onClose: () => void
    establishmentId?: string
    rating: number
    reviewCount: number
}

export function ShowcaseModal({ isOpen, onClose, establishmentId, rating, reviewCount }: ShowcaseModalProps) {
    const [copied, setCopied] = useState(false)

    // Mock Widget Code
    const widgetCode = `<script src="https://cdn.reviewme.ma/widget.js" data-id="${establishmentId || 'YOUR_ID'}" async></script>
<div id="reviewme-badge"></div>`

    const handleCopy = () => {
        navigator.clipboard.writeText(widgetCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-[#FDFCF8]">
                <div className="p-6 border-b border-zinc-100 bg-white">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#E85C33]">
                                <Globe size={20} />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-zinc-900">Vitrine Digitale</DialogTitle>
                                <DialogDescription>
                                    Affichez votre réputation sur votre site web avec nos widgets certifiés.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    <Tabs defaultValue="badge" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-100/50">
                            <TabsTrigger value="badge" className="gap-2">
                                <Layout size={16} /> Badge Flottant
                            </TabsTrigger>
                            <TabsTrigger value="embed" className="gap-2">
                                <Code2 size={16} /> Intégration Liste
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="badge" className="space-y-6">
                            {/* Preview */}
                            <div className="border border-zinc-200 rounded-2xl p-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center relative min-h-[200px]">
                                <div className="absolute top-4 left-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Aperçu</div>

                                {/* Mock Widget */}
                                <div className="bg-white rounded-full shadow-lg border border-zinc-100 py-2 px-4 flex items-center gap-3 animate-in zoom-in duration-300">
                                    <div className="flex items-center gap-1">
                                        <div className="w-6 h-6 bg-[#E85C33] rounded-full flex items-center justify-center text-white text-[10px] font-bold">R</div>
                                        <span className="font-bold text-zinc-900">{rating}</span>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-zinc-200'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                        ))}
                                    </div>
                                    <span className="text-xs text-zinc-500 font-medium">{reviewCount} avis</span>
                                </div>
                            </div>

                            {/* Code Block */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-zinc-700">Code d'intégration</label>
                                    <span className="text-xs text-zinc-400">Copiez-collez ce code dans votre &lt;head&gt;</span>
                                </div>
                                <div className="relative group">
                                    <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-zinc-800">
                                        {widgetCode}
                                    </pre>
                                    <Button
                                        size="sm"
                                        onClick={handleCopy}
                                        className="absolute top-2 right-2 h-7 px-2 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm transition-all"
                                    >
                                        {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                                        {copied ? "Copié !" : "Copier"}
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="embed">
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
                                    <Code2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-zinc-900">Bientôt disponible</h3>
                                    <p className="text-sm text-zinc-500 max-w-xs mx-auto mt-1">
                                        L'intégration complète de la liste des avis sera disponible dans la version Pro+.
                                    </p>
                                </div>
                                <Button variant="outline" disabled>Bientôt</Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}
