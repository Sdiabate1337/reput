"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { selectPlanForCurrentUser } from "@/actions/subscription"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, X, Star, Zap, Shield, MessageSquare, BarChart3, HelpCircle, ArrowRight, Menu, CheckCircle2, Minus, ChevronDown, Plus } from "lucide-react"
import { Logo } from "@/components/logo"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

function NavLink({ href, active, children }: { href: string, active?: boolean, children: React.ReactNode }) {
    return (
        <a href={href} className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${active ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'}`}>
            {children}
        </a>
    )
}

export default function PricingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isAnnual, setIsAnnual] = useState(true)
    const { user } = useAuth()
    const router = useRouter()
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

    const handleSelectPlan = async (plan: 'startup' | 'pro') => {
        if (!user) return
        setLoadingPlan(plan)
        try {
            const result = await selectPlanForCurrentUser(plan, isAnnual ? 'YEARLY' : 'MONTHLY')
            if (result.success) {
                if (result.data?.paymentUrl) {
                    window.location.href = result.data.paymentUrl
                } else {
                    router.push('/dashboard')
                }
            } else {
                alert("Erreur: " + result.error)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingPlan(null)
        }
    }

    return (
        <div className="min-h-screen bg-[#FDFCF8] text-zinc-900 font-sans selection:bg-orange-500/20">

            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 z-50">
                        <Logo />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-zinc-200/50 shadow-sm">
                        <NavLink href="/#features">Fonctionnalités</NavLink>
                        <NavLink href="/pricing" active>Tarifs</NavLink>
                        <NavLink href="/#testimonials">Témoignages</NavLink>
                        <Link href="/login" className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-full transition-all">
                            Se connecter
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login?intent=demo">
                            <Button className="rounded-full bg-[#E85C33] hover:bg-[#D54D26] text-white px-6 h-11 shadow-lg shadow-orange-500/20 font-semibold text-sm transition-all hover:scale-105 active:scale-95">
                                Réserver une démo
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden z-50 p-2 bg-white rounded-full shadow-sm border border-zinc-100" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-6 text-2xl font-bold">
                            <Link href="/#features" onClick={() => setIsMenuOpen(false)}>Fonctionnalités</Link>
                            <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="text-[#E85C33]">Tarifs</Link>
                            <Link href="/login" onClick={() => setIsMenuOpen(false)}>Se connecter</Link>
                            <Link href="/login?intent=demo" onClick={() => setIsMenuOpen(false)} className="text-[#E85C33]">Réserver une démo</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="pt-32 pb-20">

                {/* HEADER */}
                <section className="px-6 mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 mb-6 tracking-tight">
                        Des tarifs simples, sans <br />
                        <span className="text-[#E85C33]">mauvaises surprises</span>
                    </h1>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-10">
                        Choisissez le plan adapté à votre établissement.
                        <br className="hidden md:block" /> Sans engagement, annulable à tout moment.
                    </p>

                    {/* TOGGLE */}
                    <div className="flex items-center justify-center gap-4 mb-20">
                        <span className={cn("text-sm font-bold transition-colors", !isAnnual ? "text-zinc-900" : "text-zinc-400")}>Mensuel</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="w-16 h-9 bg-zinc-900 rounded-full p-1 relative transition-colors shadow-inner"
                        >
                            <div className={cn("w-7 h-7 bg-white rounded-full shadow-sm transition-transform duration-300", isAnnual ? "translate-x-7" : "translate-x-0")} />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className={cn("text-sm font-bold transition-colors", isAnnual ? "text-zinc-900" : "text-zinc-400")}>Annuel</span>
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">-20%</span>
                        </div>
                    </div>

                    {/* PRICING CARDS */}
                    <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-left">
                        {/* STARTUP */}
                        <PricingCard
                            title="Pack Startup"
                            price={isAnnual ? "290" : "390"}
                            planId="startup"
                            description="L'essentiel pour automatiser votre collecte d'avis."
                            user={user}
                            features={[
                                "QR Code WhatsApp (Inbound illimité)",
                                "Dashboard & Stats Live",

                                "1 Kit QR Physique offert",
                                "Sources: Google"
                            ]}
                            onSelect={() => handleSelectPlan('startup')}
                            isLoading={loadingPlan === 'startup'}
                        />

                        {/* PRO */}
                        <PricingCard
                            title="Pack Pro"
                            price={isAnnual ? "790" : "990"}
                            planId="pro"
                            description="Pour piloter votre réputation en pilote automatique."
                            popular
                            user={user}
                            features={[
                                "Tout du Pack Startup",
                                "IA: Auto-Réponse (Autonome)",
                                "Relances Manuelles WhatsApp (100/mois)",
                                "Alertes Admin WhatsApp (Critiques)",
                                isAnnual ? "10 Kits QR Physiques offerts" : "3 Kits QR Physiques offerts",
                                "Support Prioritaire"
                            ]}
                            onSelect={() => handleSelectPlan('pro')}
                            isLoading={loadingPlan === 'pro'}
                        />

                        {/* ENTERPRISE */}
                        <div className="p-8 rounded-[2.5rem] bg-zinc-900 text-white border border-zinc-800 flex flex-col h-full relative group transition-all duration-300 hover:shadow-2xl">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold mb-2">Grand Comptes</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed min-h-[40px]">
                                    Pour les chaînes et franchises.
                                </p>
                            </div>
                            <div className="mb-8">
                                <div className="text-3xl font-bold">Sur Mesure</div>
                                <div className="text-xs text-zinc-500 font-bold mt-2">Facturation centralisée</div>
                            </div>

                            <Link href="/login?intent=demo" className="mb-8 block">
                                <Button className="w-full rounded-2xl h-12 font-bold bg-white text-zinc-900 hover:bg-zinc-100">
                                    Contacter l'équipe
                                </Button>
                            </Link>

                            <div className="space-y-4 flex-1">
                                {[
                                    "Gestion Multi-établissements",
                                    "API & Webhooks",
                                    "Quota Relances Illimité",
                                    "Account Manager dédié",
                                    "Formation équipes"
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm font-medium text-zinc-300">
                                        <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-zinc-500" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* COMPARISON TABLE */}
                <section className="px-6 mb-32 max-w-5xl mx-auto">
                    <h3 className="text-2xl font-bold text-center mb-12">Comparatif détaillé</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 border-b border-zinc-200">
                                <tr>
                                    <th className="py-4 px-6 font-bold text-zinc-900 w-1/3">Fonctionnalité</th>
                                    <th className="py-4 px-6 font-bold text-zinc-900 text-center">Startup</th>
                                    <th className="py-4 px-6 font-bold text-[#E85C33] text-center">Pro</th>
                                    <th className="py-4 px-6 font-bold text-zinc-900 text-center">Empire</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {/* COLLECTE */}
                                <tr className="bg-zinc-50/50"><td colSpan={4} className="py-3 px-6 font-bold text-zinc-500 text-xs uppercase tracking-widest mt-4">Collecte & Canaux</td></tr>
                                <TableRow feature="QR Code WhatsApp" starter={true} pro={true} business={true} />
                                <TableRow feature="Kit QR Physique offert" starter="1 Kit" pro={isAnnual ? "10 Kits" : "3 Kits"} business="Sur mesure" />
                                <TableRow feature="Relances Manuelles WhatsApp" starter={false} pro="100 / mois" business="Illimité" />
                                <TableRow feature="Import CSV" starter={true} pro={true} business={true} />

                                {/* IA & REPONSES */}
                                <tr className="bg-zinc-50/50"><td colSpan={4} className="py-3 px-6 font-bold text-zinc-500 text-xs uppercase tracking-widest mt-4">Intelligence Artificielle</td></tr>

                                <TableRow feature="Auto-Réponse Avis Google" starter={false} pro={true} business={true} />
                                <TableRow feature="Analyse de Sentiment" starter={true} pro={true} business={true} />
                                <TableRow feature="Détection Langue" starter={true} pro={true} business={true} />

                                {/* GESTION */}
                                <tr className="bg-zinc-50/50"><td colSpan={4} className="py-3 px-6 font-bold text-zinc-500 text-xs uppercase tracking-widest mt-4">Gestion & Alertes</td></tr>
                                <TableRow feature="Dashboard Live" starter={true} pro={true} business={true} />
                                <TableRow feature="Alertes Critiques (WhatsApp Admin)" starter={false} pro={true} business={true} />
                                <TableRow feature="Multi-établissements" starter={false} pro={false} business={true} />
                            </tbody>
                        </table>
                        <div className="mt-4 text-xs text-zinc-400 text-center italic">
                            * Coût kit supplémentaire : 250 MAD / unité
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="px-6 mb-32 max-w-3xl mx-auto">
                    <h3 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h3>
                    <div className="space-y-4">
                        <FAQItem question="Le numéro WhatsApp est-il inclus ?" answer="Oui, nous vous guidons pour connecter votre propre numéro WhatsApp Business ou utiliser notre numéro partagé pour démarrer instantanément." />
                        <FAQItem question="Comment fonctionne le Kit QR ?" answer="Dés votre inscription, nous personnalisons un kit (Chevalet de comptoir + Stickers) que nous vous expédions via Amana (Livraison 24-48h partout au Maroc)." />
                        <FAQItem question="Puis-je annuler à tout moment ?" answer="Absolument. Nos offres mensuelles sont sans engagement. Vous pouvez arrêter quand vous voulez depuis votre espace client." />
                        <FAQItem question="Qu'est-ce que l'Auto-Réponse Google ?" answer="Le Pack Pro permet à l'IA de répondre automatiquement aux avis publiés sur votre fiche Google Maps (Intégration Bientôt Dispatchée). Sur WhatsApp, l'IA assiste déjà nativement tous les échanges." />
                    </div>
                </section>

            </main>

            {/* FOOTER */}
            <footer className="max-w-7xl mx-auto px-6 pt-10 pb-20 border-t border-zinc-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <Logo />
                    </div>

                    <div className="flex gap-8 text-sm font-semibold text-zinc-500">
                        <Link href="/#features" className="hover:text-zinc-900 transition-colors">Fonctionnalités</Link>
                        <Link href="/pricing" className="hover:text-zinc-900 transition-colors">Tarifs</Link>
                        <a href="#" className="hover:text-zinc-900 transition-colors">Contact</a>
                    </div>

                    <div className="text-zinc-400 text-sm font-medium">
                        © 2026 ReviewMe Inc.
                    </div>
                </div>
            </footer>
        </div>
    )
}

function TableRow({ feature, starter, pro, business }: any) {
    return (
        <tr className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
            <td className="py-4 px-6 font-medium text-zinc-700">{feature}</td>
            <td className="py-4 px-6 text-center">
                {renderValue(starter)}
            </td>
            <td className="py-4 px-6 text-center bg-orange-50/20 font-medium">
                {renderValue(pro, "text-[#E85C33]")}
            </td>
            <td className="py-4 px-6 text-center font-bold">
                {renderValue(business)}
            </td>
        </tr>
    )
}

function renderValue(val: any, colorClass?: string) {
    if (val === true) return <Check className={cn("mx-auto h-5 w-5 text-green-500", colorClass)} />
    if (val === false) return <Minus className="mx-auto h-4 w-4 text-zinc-300" />
    return <span className={cn("text-zinc-900", colorClass)}>{val}</span>
}

function FAQItem({ question, answer }: any) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="border border-zinc-100 rounded-2xl p-6 bg-white cursor-pointer hover:border-zinc-200 transition-colors" onClick={() => setIsOpen(!isOpen)}>
            <div className="flex justify-between items-center gap-4">
                <h4 className="font-bold text-lg text-zinc-900">{question}</h4>
                <div className={cn("p-2 bg-zinc-50 rounded-full transition-transform duration-300", isOpen && "rotate-180")}>
                    <ChevronDown size={20} className="text-zinc-500" />
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pt-4 text-zinc-500 leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function PricingCard({ title, price, planId, description, user, features, onSelect, isLoading, popular }: any) {
    return (
        <div className={cn("p-8 rounded-[2.5rem] bg-white border flex flex-col h-full relative group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1", popular ? "border-[#E85C33] shadow-lg shadow-orange-500/10" : "border-zinc-200 shadow-sm")}>
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#E85C33] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/20">
                    Le plus populaire
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed min-h-[40px]">{description}</p>
            </div>

            <div className="mb-8">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-zinc-900">{price}</span>
                    <span className="text-lg font-bold text-zinc-400">Dhs</span>
                    <span className="text-zinc-400 font-medium">/mois</span>
                </div>
                <div className="text-xs text-zinc-400 font-medium mt-2">Facturé annuellement (HT)</div>
            </div>

            <Button
                onClick={onSelect}
                disabled={isLoading}
                className={cn("mb-8 w-full rounded-2xl h-12 font-bold transition-all", popular ? "bg-[#E85C33] hover:bg-[#D54D26] text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900")}
            >
                {isLoading ? <Loader2 className="animate-spin" /> : (user ? "Choisir ce plan" : "Commencer l'essai")}
            </Button>

            <div className="space-y-4 flex-1">
                {features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-sm font-medium text-zinc-600">
                        <CheckCircle2 size={18} className={cn("mt-0.5 flex-shrink-0", popular ? "text-[#E85C33]" : "text-zinc-400")} />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
