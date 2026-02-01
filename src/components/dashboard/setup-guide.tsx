"use client"

import { ChevronRight, Phone, MapPin, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SetupGuideProps {
    establishment: {
        id: string
        admin_phone?: string | null
        google_maps_link?: string | null
    }
}

export function SetupGuide({ establishment }: SetupGuideProps) {
    const steps = [
        {
            key: 'admin',
            label: 'Numéro Admin',
            isDone: !!establishment.admin_phone,
            description: "Pour recevoir les alertes critiques.",
            href: '/settings',
            icon: Phone
        },
        {
            key: 'link',
            label: 'Lien Avis',
            isDone: !!establishment.google_maps_link,
            description: "Pour rediriger les clients satisfaits.",
            href: '/onboarding',
            icon: MapPin
        }
    ]

    const completedCount = steps.filter(s => s.isDone).length
    const progress = (completedCount / steps.length) * 100
    const isComplete = completedCount === steps.length

    if (isComplete) return null

    return (
        <div className="mb-8 p-6 rounded-[1.5rem] bg-gradient-to-r from-zinc-900 to-zinc-800 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <RefreshCw size={120} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Configuration requise</h3>
                    </div>
                    <p className="text-zinc-400 mb-6 max-w-md">
                        Pour que ReviewMe fonctionne à 100%, complétez ces étapes indispensables.
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2 max-w-xs">
                        <div
                            className="h-full bg-[#E85C33] transition-all duration-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-zinc-500 font-medium">
                        {completedCount}/{steps.length} complété(s)
                    </p>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto min-w-[300px]">
                    {steps.map((step) => (
                        <Link
                            key={step.key}
                            href={step.href}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-xl border transition-all select-none",
                                step.isDone
                                    ? "bg-white/5 border-white/5 text-zinc-400 cursor-default"
                                    : "bg-white/10 border-white/20 hover:bg-white/15 text-white hover:scale-[1.02] cursor-pointer"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center border", step.isDone ? "bg-green-500/20 border-green-500 text-green-500" : "border-zinc-500 text-transparent")}>
                                    <step.icon size={12} />
                                </div>
                                <div className="text-sm">
                                    <div className={cn("font-medium", step.isDone && "line-through")}>{step.label}</div>
                                    {!step.isDone && <div className="text-[10px] text-zinc-400">{step.description}</div>}
                                </div>
                            </div>
                            {!step.isDone && <ChevronRight size={16} className="text-zinc-500" />}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
