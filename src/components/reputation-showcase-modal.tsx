
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Star, Sparkles, Loader2, Quote, Award } from "lucide-react"
import { toPng } from "html-to-image"
import { cn } from "@/lib/utils"

interface ReputationShowcaseModalProps {
    isOpen: boolean
    onClose: () => void
    reviews: any[]
    companyName?: string
    avgRating?: string
}

export function ReputationShowcaseModal({ isOpen, onClose, reviews, companyName = "My Business", avgRating = "5.0" }: ReputationShowcaseModalProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [keywords, setKeywords] = useState<{ text: string; value: number }[]>([])

    // Extract positive keywords from reviews
    useEffect(() => {
        if (!isOpen || !reviews.length) return

        const processReviews = () => {
            const text = reviews
                .map(r => r.review_text || "")
                .join(" ")
                .toLowerCase()
                .replace(/[.,\/#!$%^&*;:{}=\-_~()]/g, "")

            const stopWords = new Set(["the", "and", "is", "washer", "to", "a", "it", "of", "in", "for", "with", "was", "very", "my", "on", "that", "this", "but", "so", "at", "as", "be", "we", "have", "you", "are", "had", "not", "great", "good"])

            const words = text.split(/\s+/)
            const counts: Record<string, number> = {}

            words.forEach(w => {
                if (w.length > 4 && !stopWords.has(w)) {
                    counts[w] = (counts[w] || 0) + 1
                }
            })

            return Object.entries(counts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6) // Top 6 impactful words only (Less is more)
                .map(([text, value]) => ({ text, value }))
        }

        setKeywords(processReviews())
    }, [isOpen, reviews])

    const handleDownload = async () => {
        if (!cardRef.current) return
        setIsGenerating(true)

        try {
            // High quality capture
            await new Promise(r => setTimeout(r, 800))
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 4, // Ultra high res for Retina
                backgroundColor: '#09090b', // Ensure background is captured correctly
                quality: 1.0
            })
            const link = document.createElement("a")
            link.download = `reputation-${companyName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`
            link.href = dataUrl
            link.click()
        } catch (err) {
            console.error("Failed to generate image", err)
        } finally {
            setIsGenerating(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl max-w-lg w-full flex flex-col items-center gap-6"
                >
                    <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold text-white">Share Your Excellence</h3>
                            <p className="text-zinc-400 text-xs">Create a stunning visual for your social media.</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-zinc-800 text-zinc-400 rounded-full hover:bg-zinc-700 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* THE PREMIUM CARD TO CAPTURE */}
                    <div className="w-full aspect-[4/5] relative group bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800" ref={cardRef}>
                        {/* Background Gradients */}
                        <div className="absolute top-0 right-0 w-[120%] h-[80%] bg-gradient-to-b from-[#E85C33]/20 via-purple-900/10 to-transparent blur-3xl -mr-20 -mt-20 opacity-60" />
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#E85C33]/10 to-transparent blur-3xl opacity-40" />

                        <div className="relative z-10 h-full flex flex-col justify-between p-10">

                            {/* Top Section */}
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-2 rounded-lg">
                                            <Award className="text-[#E85C33]" size={24} />
                                        </div>
                                        <span className="text-xs font-bold tracking-[0.2em] text-[#E85C33] uppercase">Certified Excellent</span>
                                    </div>
                                    <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
                                        {companyName}
                                    </h2>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="text-6xl font-black text-white tracking-tighter leading-none">
                                        {avgRating}
                                    </div>
                                    <div className="flex gap-1 mt-2 text-[#E85C33]">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                </div>
                            </div>

                            {/* Middle - Quote / Keywords */}
                            <div className="flex-1 flex flex-col justify-center py-8">
                                <div className="relative">
                                    <Quote className="absolute -top-6 -left-4 text-white/5 rotate-180" size={80} />
                                    <h3 className="text-white/40 text-sm uppercase tracking-widest font-bold mb-6 text-center">Customers say we are</h3>

                                    <div className="flex flex-wrap justify-center gap-3">
                                        {keywords.map((kw, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "px-6 py-3 rounded-full border backdrop-blur-sm transition-all",
                                                    i === 0 ? "bg-white text-black border-white font-black text-2xl shadow-[0_0_30px_rgba(255,255,255,0.3)]" :
                                                        i === 1 ? "bg-[#E85C33] text-white border-[#E85C33] font-bold text-xl shadow-[0_0_20px_rgba(232,92,51,0.4)]" :
                                                            "bg-white/5 text-zinc-200 border-white/10 font-medium text-lg"
                                                )}
                                            >
                                                {kw.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Footer */}
                            <div className="border-t border-white/10 pt-6 flex justify-between items-end">
                                <div>
                                    <p className="text-zinc-400 text-xs font-medium uppercase tracking-wide">Verified Reviews by</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="h-6 w-6 bg-[#E85C33] rounded-lg flex items-center justify-center text-white text-[10px] font-bold">R</div>
                                        <span className="text-white font-bold tracking-tight">Reput.ai</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                                        <span className="text-zinc-300 text-xs font-mono">2024 WINNER</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={handleDownload}
                            disabled={isGenerating}
                            className="group relative w-full h-12 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 overflow-hidden hover:bg-zinc-200 transition-all active:scale-95"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:animate-shine" />
                            {isGenerating ? <Loader2 className="animate-spin" /> : <Download size={18} />}
                            Download 4:5 Portrait (Instagram)
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

