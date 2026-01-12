"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // TODO: Implement real save
        setTimeout(() => setIsLoading(false), 1000)
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
                        <p className="text-zinc-500">Gérez votre compte</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-zinc-100 p-8"
                >
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Nom</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Votre nom"
                                className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:border-[#E85C33] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="vous@exemple.com"
                                className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:border-[#E85C33] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 rounded-xl bg-[#E85C33] hover:bg-[#d54d26] text-white font-bold"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <Save size={18} className="mr-2" /> Enregistrer
                                </>
                            )}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
