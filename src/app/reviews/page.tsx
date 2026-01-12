"use client"

import { motion } from "framer-motion"
import { MessageSquare } from "lucide-react"
import Link from "next/link"

export default function ReviewsPage() {
    return (
        <div className="min-h-screen bg-[#FDFCF8] p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900">Avis</h1>
                    <p className="text-zinc-500">Gérez vos avis clients</p>
                </div>

                {/* Empty State */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-zinc-100 p-12 text-center"
                >
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="text-[#E85C33]" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-2">Aucun avis</h2>
                    <p className="text-zinc-500 mb-6">
                        Vos avis apparaîtront ici une fois que vous aurez configuré votre établissement
                    </p>
                    <Link
                        href="/onboarding"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#E85C33] text-white font-bold rounded-xl hover:bg-[#d54d26] transition-colors"
                    >
                        Configurer
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}
