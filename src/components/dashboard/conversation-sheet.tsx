"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Bot, User, Clock, AlertTriangle, Shield, CheckCircle2, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Conversation, ConversationMessage } from "@/types/database"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { toggleConversationAi, sendManualReply, closeConversation } from "@/actions/conversations"

interface ConversationSheetProps {
    conversation: Conversation | null
    isOpen: boolean
    onClose: () => void
    onUpdate: () => void
}

export function ConversationSheet({ conversation, isOpen, onClose, onUpdate }: ConversationSheetProps) {
    const [replyText, setReplyText] = useState("")
    const [isSending, setIsSending] = useState(false)
    const [aiEnabled, setAiEnabled] = useState(conversation?.ai_enabled ?? true)
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Sync state
    useEffect(() => {
        if (conversation) {
            setAiEnabled(conversation.ai_enabled ?? true)
        }
    }, [conversation])

    // Scroll to bottom
    useEffect(() => {
        if (isOpen && scrollRef.current) {
            setTimeout(() => {
                scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'auto' })
            }, 50)
        }
    }, [isOpen, conversation?.messages])

    // Focus input when manual mode enabled
    useEffect(() => {
        if (!aiEnabled && inputRef.current) {
            inputRef.current.focus()
        }
    }, [aiEnabled])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!replyText.trim() || !conversation) return

        setIsSending(true)
        try {
            const result = await sendManualReply(conversation.id, replyText)
            if (result.success) {
                setReplyText("")
                onUpdate()
            }
        } catch (error) {
            console.error("Failed to send", error)
        } finally {
            setIsSending(false)
        }
    }

    const handleToggleAi = async () => {
        if (!conversation) return
        const newState = !aiEnabled
        setAiEnabled(newState)
        await toggleConversationAi(conversation.id, newState)
        onUpdate()
    }

    const handleArchive = async () => {
        if (!conversation) return
        if (confirm("Voulez-vous clore cette conversation ? Le client repartira à zéro lors de son prochain message.")) {
            await closeConversation(conversation.id)
            onUpdate()
            onClose()
        }
    }

    if (!conversation) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-zinc-900/60 z-40 backdrop-blur-[2px]"
                    />

                    {/* Sheet Container */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                        className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-[#FAFAFA] shadow-2xl z-50 flex flex-col border-l border-white/20"
                    >
                        {/* 1. Header (Sticky) */}
                        <div className="bg-white border-b border-zinc-100 flex items-center justify-between px-4 py-3 md:px-6 md:py-4 shadow-sm z-20 shrink-0">
                            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-inner shrink-0 ${conversation.sentiment === 'POSITIVE' ? 'bg-green-100 text-green-700' :
                                    conversation.sentiment === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                        'bg-zinc-100 text-zinc-600'
                                    }`}>
                                    {conversation.client_name ? conversation.client_name[0].toUpperCase() : <User size={20} />}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-base md:text-lg text-zinc-900 leading-tight truncate">
                                        {conversation.client_name || conversation.client_phone}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-500">
                                        <span className="flex items-center gap-1 shrink-0">
                                            {conversation.source === 'QR_SCAN' ? '📱 Scan QR' : '📩 Inbound'}
                                        </span>
                                        <span>•</span>
                                        <span className={`font-medium ${conversation.sentiment === 'POSITIVE' ? 'text-green-600' :
                                            conversation.sentiment === 'CRITICAL' ? 'text-red-600' : 'text-zinc-600'
                                            }`}>
                                            {conversation.sentiment === 'POSITIVE' && 'Satisfait'}
                                            {conversation.sentiment === 'NEGATIVE' && 'Mécontent'}
                                            {conversation.sentiment === 'CRITICAL' && 'Critique'}
                                            {conversation.sentiment === 'NEUTRAL' && 'Neutre'}
                                            {!conversation.sentiment && 'Nouveau'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 md:gap-2 shrink-0">
                                {conversation.status !== 'CLOSED' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleArchive}
                                        className="flex items-center gap-2 text-zinc-600 border-zinc-200 hover:bg-zinc-50 h-9 px-3"
                                    >
                                        <Archive size={16} />
                                        <span className="hidden sm:inline">Clore</span>
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100">
                                    <X size={24} />
                                </Button>
                            </div>
                        </div>

                        {/* 2. Control Bar (Sticky) */}
                        <div className={`px-6 py-3 flex items-center justify-between text-sm border-b transition-colors duration-300 shrink-0 ${aiEnabled ? 'bg-white border-zinc-100' : 'bg-orange-50/50 border-orange-100'
                            }`}>
                            <div className="flex items-center gap-2.5">
                                <div className={`w-2 h-2 rounded-full ${aiEnabled ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-orange-500'}`} />
                                <span className={`font-medium ${aiEnabled ? 'text-zinc-600' : 'text-orange-700'}`}>
                                    {aiEnabled ? "L'IA pilote automatiquement" : "Mode manuel activé"}
                                </span>
                            </div>
                            <Button
                                size="sm"
                                onClick={handleToggleAi}
                                variant={aiEnabled ? "outline" : "default"}
                                className={`h-8 text-xs font-semibold shadow-sm transition-all ${aiEnabled
                                    ? 'border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                                    : 'bg-[#E85C33] hover:bg-[#d54d26] text-white border-transparent'
                                    }`}
                            >
                                {aiEnabled ? "Prendre la main" : "Réactiver l'IA"}
                            </Button>
                        </div>

                        {/* 3. Messages Area (Scrollable) */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFAFA]"
                        >
                            {(conversation.messages as ConversationMessage[]).map((msg, idx) => {
                                const isClient = msg.role === 'client'
                                return (
                                    <div
                                        key={idx}
                                        className={`flex gap-4 max-w-[85%] ${isClient ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm ${isClient ? 'bg-white text-zinc-400 border border-zinc-100' : 'bg-[#E85C33] text-white'
                                            }`}>
                                            {isClient ? <User size={14} /> : <Bot size={14} />}
                                        </div>

                                        <div className="flex flex-col gap-1 min-w-0">
                                            <div
                                                className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap break-words ${isClient
                                                    ? 'bg-white border border-zinc-100 text-zinc-800 rounded-tl-none'
                                                    : 'bg-[#E85C33] text-white rounded-tr-none shadow-orange-500/10'
                                                    }`}
                                            >
                                                {msg.content}
                                            </div>
                                            <span className={`text-[11px] px-1 ${isClient ? 'text-zinc-400 text-left' : 'text-zinc-400 text-right'
                                                }`}>
                                                {formatDistanceToNow(new Date(msg.timestamp), { locale: fr, addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="h-4" /> {/* Spacer */}
                        </div>

                        {/* 4. Input Area (Sticky Bottom) */}
                        <div className="p-5 bg-white border-t border-zinc-100 z-20 shrink-0">
                            {aiEnabled ? (
                                <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Bot className="text-zinc-300" size={24} />
                                        <p className="text-sm text-zinc-500">
                                            L'IA répond automatiquement aux messages.
                                        </p>
                                        <Button
                                            variant="link"
                                            onClick={handleToggleAi}
                                            className="text-[#E85C33] h-auto p-0 text-sm font-semibold hover:text-[#d54d26]"
                                        >
                                            Désactiver pour répondre
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSend} className="relative flex gap-3">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Écrivez votre réponse..."
                                        className="flex-1 h-12 pl-4 pr-12 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:border-[#E85C33] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-zinc-400"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isSending || !replyText.trim()}
                                        className="h-12 w-12 rounded-xl bg-[#E85C33] hover:bg-[#d54d26] text-white p-0 shrink-0 shadow-lg shadow-orange-500/20 transition-transform active:scale-95"
                                    >
                                        <Send size={20} className={isSending ? 'opacity-0' : 'ml-0.5'} />
                                    </Button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
