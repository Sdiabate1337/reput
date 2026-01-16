
import { MessageSquare, Check, CheckCheck } from "lucide-react"

interface WhatsAppPreviewProps {
    message: string
    type: 'WELCOME' | 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
    establishmentName: string
}

export function WhatsAppPreview({ message, type, establishmentName }: WhatsAppPreviewProps) {
    const currentDate = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const displayMessage = message || "Votre message apparaîtra ici..."

    return (
        <div className="w-[340px] mx-auto bg-[#0b141a] rounded-[30px] overflow-hidden border border-zinc-800 shadow-2xl font-sans relative">
            {/* Header */}
            <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3 border-b border-[#202c33] z-10 relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {establishmentName.charAt(0)}
                </div>
                <div className="flex-1">
                    <div className="font-medium text-white text-base leading-tight">{establishmentName}</div>
                    <div className="text-xs text-zinc-400">En ligne</div>
                </div>
            </div>

            {/* Chat Area - Dark Pattern Background */}
            <div className="h-[550px] bg-[#0b141a] relative overflow-y-auto p-4 flex flex-col gap-4">
                {/* Background Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat z-0"></div>

                {/* Date Bubble */}
                <div className="flex justify-center z-10 my-2">
                    <span className="bg-[#1f2c34] text-[#8696a0] text-xs px-3 py-1.5 rounded-lg shadow-sm font-medium">
                        Aujourd'hui
                    </span>
                </div>

                {/* Secure Message Notice */}
                <div className="flex justify-center z-10 mb-4 px-4 text-center">
                    <div className="bg-[#1f2c34] text-[#ffd279] text-[10px] px-3 py-2 rounded-lg shadow-sm leading-relaxed max-w-[90%]">
                        🔒 Les messages sont chiffrés de bout en bout. Aucun tiers ne peut les lire.
                    </div>
                </div>

                {/* Message Bubble (Incoming / User Perspective - Gray/Dark) */}
                {/* Visual Trick: Creating the "Marhba" message as if it came from the Business */}
                <div className="flex flex-col items-start max-w-[90%] z-10 self-start group">
                    <div className="bg-[#202c33] rounded-lg rounded-tl-none p-3 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] text-[#e9edef] text-[14.2px] leading-[19px] relative selection:bg-[#202c33]">
                        {/* Triangle for bubble */}
                        <div className="absolute top-0 -left-2 w-0 h-0 border-[8px] border-transparent border-t-[#202c33] border-r-[#202c33]"></div>

                        <div className="whitespace-pre-wrap">
                            {displayMessage
                                .replace(/{{name}}/g, "Simo")
                                .replace(/{{link}}/g, "google.com/...")
                            }
                        </div>

                        <div className="flex justify-end items-center gap-1 mt-1 -mb-1">
                            <span className="text-[11px] text-[#8696a0]">{currentDate}</span>
                        </div>
                    </div>

                    {/* Interactive Buttons (If Welcome) */}
                    {type === 'WELCOME' && (
                        <div className="mt-2 w-full flex flex-col gap-2">
                            <button className="bg-[#202c33] hover:bg-[#2a3942] transition-colors text-[#00a884] font-medium text-sm py-2.5 px-4 rounded-lg shadow-sm text-center border border-[#233138]">
                                Top ! (5/5)
                            </button>
                            <button className="bg-[#202c33] hover:bg-[#2a3942] transition-colors text-[#00a884] font-medium text-sm py-2.5 px-4 rounded-lg shadow-sm text-center border border-[#233138]">
                                Bien (3-4/5)
                            </button>
                            <button className="bg-[#202c33] hover:bg-[#2a3942] transition-colors text-[#00a884] font-medium text-sm py-2.5 px-4 rounded-lg shadow-sm text-center border border-[#233138]">
                                Déçu (1-2/5)
                            </button>
                        </div>
                    )}
                </div>

                {/* Simulated User Response (Outgoing - Green) */}
                {(type === 'POSITIVE' || type === 'NEUTRAL' || type === 'NEGATIVE') && (
                    <div className="flex flex-col items-end max-w-[90%] z-10 self-end mt-2 animate-in slide-in-from-right-2 duration-300">
                        <div className="bg-[#005c4b] rounded-lg rounded-tr-none p-3 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] text-[#e9edef] text-[14.2px] leading-[19px] relative">
                            {/* Triangle */}
                            <div className="absolute top-0 -right-2 w-0 h-0 border-[8px] border-transparent border-t-[#005c4b] border-l-[#005c4b]"></div>

                            <div>
                                {type === 'POSITIVE' ? 'Top ! (5/5)' : type === 'NEUTRAL' ? 'Bien (3-4/5)' : 'Déçu (1-2/5)'}
                            </div>
                            <div className="flex justify-end items-center gap-1 mt-1 -mb-1">
                                <span className="text-[11px] text-[#8696a0]">{currentDate}</span>
                                <CheckCheck size={14} className="text-[#53bdeb]" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Follow up / Second Message from Business */}
                {(type === 'POSITIVE' || type === 'NEUTRAL' || type === 'NEGATIVE') && (
                    <div className="flex flex-col items-start max-w-[90%] z-10 self-start mt-2 animate-in slide-in-from-left-2 duration-500 delay-150">
                        <div className="bg-[#202c33] rounded-lg rounded-tl-none p-3 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] text-[#e9edef] text-[14.2px] leading-[19px] relative">
                            <div className="absolute top-0 -left-2 w-0 h-0 border-[8px] border-transparent border-t-[#202c33] border-r-[#202c33]"></div>

                            <div className="whitespace-pre-wrap">
                                {type === 'POSITIVE' && "Génial ! Toute l'équipe vous remercie. 🥰\n\nUn dernier petit clic pour nous donner de la force ? 💪"}
                                {type === 'NEUTRAL' && "Merci pour votre retour. Que pourrions-nous améliorer pour avoir 5 étoiles ?"}
                                {type === 'NEGATIVE' && "Nous sommes navrés d'apprendre cela. Pouvez-vous nous en dire plus pour que nous puissions rectifier le tir ?"}
                            </div>

                            {/* Link Preview (Positive) */}
                            {type === 'POSITIVE' && (
                                <div className="mt-2 bg-[#1f2c34] rounded-lg overflow-hidden border border-[#2a3942]">
                                    <div className="h-24 bg-zinc-800 flex items-center justify-center text-zinc-600">
                                        <span className="text-3xl">⭐</span>
                                    </div>
                                    <div className="p-2">
                                        <div className="text-xs text-[#8696a0]">Google Maps</div>
                                        <div className="text-sm text-[#e9edef] truncate">Laisser un avis</div>
                                    </div>
                                    <div className="bg-[#2a3942] p-2 text-center text-[#53bdeb] text-sm font-medium border-t border-[#374248] cursor-pointer hover:bg-[#374248]">
                                        Ouvrir le lien
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end items-center gap-1 mt-1 -mb-1">
                                <span className="text-[11px] text-[#8696a0]">{currentDate}</span>
                            </div>
                        </div>
                    </div>
                )}


            </div>

            {/* Footer */}
            <div className="bg-[#202c33] p-2 flex items-center gap-2 border-t border-[#2a3942] z-10 relative">
                <div className="p-2 text-[#8696a0]">
                    <span className="text-xl">😃</span>
                </div>
                <div className="p-2 text-[#8696a0]">
                    <span className="text-xl">➕</span>
                </div>
                <div className="flex-1 bg-[#2a3942] rounded-lg h-10 px-4 flex items-center text-[#8696a0] text-sm">
                    Message
                </div>
                <div className="p-2 text-[#8696a0]">
                    <span className="text-xl">🎤</span>
                </div>
            </div>
        </div>
    )
}
