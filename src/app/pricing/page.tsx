"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Check, CheckCircle2, ChevronDown, Menu, X, Minus, HelpCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function PricingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isAnnual, setIsAnnual] = useState(true)

    return (
        <div className="min-h-screen bg-[#FDFCF8] text-zinc-900 font-sans selection:bg-orange-500/20">

            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 z-50">
                        <div className="h-10 w-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-zinc-900/10">R</div>
                        <span className="font-bold text-xl tracking-tight text-zinc-900">Reput.ai</span>
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
                        Des tarifs adaptés à votre <br />
                        <span className="text-[#E85C33]">croissance</span>
                    </h1>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-10">
                        Une tarification transparente basée sur le volume d'avis que vous traitez.
                        <br className="hidden md:block" /> Commencez petit, grandissez sans limites.
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
                        {/* STARTER */}
                        <PricingCard
                            title="Starter"
                            price={isAnnual ? "290" : "390"}
                            description="Pour les petites entreprises qui débutent leur gestion de réputation."
                            features={[
                                "Jusqu'à 50 avis/mois",
                                "Sources: Google & Facebook",
                                "1 Utilisateur",
                                "Collecte par QR Code & Email",
                                "Réponses IA (Validation manuelle)",
                                "Dashboard essentiel"
                            ]}
                        />

                        {/* PRO */}
                        <PricingCard
                            title="Pro"
                            price={isAnnual ? "790" : "990"}
                            description="Le choix idéal pour les entreprises en croissance."
                            popular
                            features={[
                                "Jusqu'à 200 avis/mois",
                                "Sources: + WhatsApp & TripAdvisor",
                                "3 Utilisateurs",
                                "Campagnes SMS & WhatsApp",
                                "Réponses IA Auto-pilot",
                                "Analyses sémantiques",
                                "Widget Site Web"
                            ]}
                        />

                        {/* BUSINESS */}
                        <PricingCard
                            title="Business"
                            price={isAnnual ? "1,490" : "1,890"}
                            description="Pour les établissements à fort volume."
                            features={[
                                "Jusqu'à 500 avis/mois",
                                "Toutes les sources d'avis",
                                "Utilisateurs illimités",
                                "Support Prioritaire (WhatsApp)",
                                "Accès API & Webhooks",
                                "Gestion Multi-établissements",
                                "Rapports personnalisés"
                            ]}
                        />
                    </div>
                </section>

                {/* COMPARISON TABLE */}
                <section className="px-6 mb-32 max-w-5xl mx-auto">
                    <h3 className="text-2xl font-bold text-center mb-12">Comparatif détaillé des fonctionnalités</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 border-b border-zinc-200">
                                <tr>
                                    <th className="py-4 px-6 font-bold text-zinc-900 w-1/3">Fonctionnalité</th>
                                    <th className="py-4 px-6 font-bold text-zinc-900 text-center">Starter</th>
                                    <th className="py-4 px-6 font-bold text-[#E85C33] text-center">Pro</th>
                                    <th className="py-4 px-6 font-bold text-zinc-900 text-center">Business</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {/* COLLECTE */}
                                <tr className="bg-zinc-50/50"><td colSpan={4} className="py-3 px-6 font-bold text-zinc-500 text-xs uppercase tracking-widest mt-4">Collecte</td></tr>
                                <TableRow feature="Demandes par Email" starter={true} pro={true} business={true} />
                                <TableRow feature="QR Code Packs" starter={true} pro={true} business={true} />
                                <TableRow feature="Demandes SMS" starter={false} pro={true} business={true} />
                                <TableRow feature="Demandes WhatsApp" starter={false} pro={true} business={true} />

                                {/* REPONSES */}
                                <tr className="bg-zinc-50/50"><td colSpan={4} className="py-3 px-6 font-bold text-zinc-500 text-xs uppercase tracking-widest mt-4">Réponses IA</td></tr>
                                <TableRow feature="Génération de brouillons" starter={true} pro={true} business={true} />
                                <TableRow feature="Personnalisation du ton" starter="Basique" pro="Avancé" business="Expert" />
                                <TableRow feature="Mode Auto-pilot" starter={false} pro={true} business={true} />
                                <TableRow feature="Support Multilingue" starter={true} pro={true} business={true} />

                                {/* ANALYTICS */}
                                <tr className="bg-zinc-50/50"><td colSpan={4} className="py-3 px-6 font-bold text-zinc-500 text-xs uppercase tracking-widest mt-4">Analyses</td></tr>
                                <TableRow feature="Dashboard Performance" starter={true} pro={true} business={true} />
                                <TableRow feature="Analyse de Sentiment" starter={false} pro={true} business={true} />
                                <TableRow feature="Rapports PDF/Excel" starter={false} pro={true} business={true} />
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-12 p-8 bg-zinc-900 rounded-3xl text-center text-white relative overflow-hidden">
                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <h4 className="text-2xl font-bold">Besoin de plus de 500 avis/mois ?</h4>
                            <p className="text-zinc-400 max-w-lg">
                                Contactez notre équipe commerciale pour une offre sur mesure adaptée aux réseaux de franchises et grands comptes.
                            </p>
                            <Link href="/login?intent=demo">
                                <Button className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-full px-8 h-12 font-bold">Contacter les ventes</Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="px-6 mb-32 max-w-3xl mx-auto">
                    <h3 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h3>
                    <div className="space-y-4">
                        <FAQItem question="Puis-je changer de forfait à tout moment ?" answer="Oui, vous pouvez passer à un forfait supérieur ou inférieur à tout moment. Les changements prennent effet à la prochaine période de facturation." />
                        <FAQItem question="Que se passe-t-il si je dépasse mon quota d'avis ?" answer="Nous ne bloquons pas l'accès. Si vous dépassez votre quota deux mois de suite, nous vous contacterons pour vous proposer un passage au plan supérieur." />
                        <FAQItem question="Y a-t-il un engagement de durée ?" answer="Non, nos offres mensuelles sont sans engagement. En choisissant le paiement annuel, vous vous engagez pour 12 mois mais bénéficiez de 20% de réduction." />
                        <FAQItem question="Comment fonctionne la connexion aux plateformes ?" answer="C'est très simple. Connectez vos comptes Google Business et Facebook en 2 clics lors de l'inscription. Nous importons automatiquement vos avis." />
                    </div>
                </section>

            </main>

            {/* FOOTER */}
            <footer className="max-w-7xl mx-auto px-6 pt-10 pb-20 border-t border-zinc-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">R</div>
                        <span className="font-bold text-zinc-900">Reput.ai</span>
                    </div>

                    <div className="flex gap-8 text-sm font-semibold text-zinc-500">
                        <Link href="/#features" className="hover:text-zinc-900 transition-colors">Fonctionnalités</Link>
                        <Link href="/pricing" className="hover:text-zinc-900 transition-colors">Tarifs</Link>
                        <a href="#" className="hover:text-zinc-900 transition-colors">Blog</a>
                        <a href="#" className="hover:text-zinc-900 transition-colors">Carrières</a>
                        <a href="#" className="hover:text-zinc-900 transition-colors">Contact</a>
                    </div>

                    <div className="text-zinc-400 text-sm font-medium">
                        © 2025 Reput.ai Inc.
                    </div>
                </div>
            </footer>
        </div>
    )
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode, active?: boolean }) {
    return (
        <Link href={href} className={cn("px-4 py-2 text-sm font-medium rounded-full transition-all", active ? "bg-white text-zinc-900 shadow-sm font-bold" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50")}>
            {children}
        </Link>
    )
}

function PricingCard({ title, price, description, features, popular }: any) {
    return (
        <div className={cn("p-8 rounded-[2.5rem] bg-white border flex flex-col h-full relative group transition-all duration-300 hover:-translate-y-2", popular ? "border-[#E85C33] shadow-xl shadow-orange-500/10 scale-105 z-10" : "border-zinc-100 shadow-sm hover:shadow-lg")}>
            {popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#E85C33] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    LE PLUS POPULAIRE
                </div>
            )}
            <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed min-h-[40px]">{description}</p>
            </div>
            <div className="mb-8">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{popular ? price : price}</span>
                    <span className="text-xl font-bold text-zinc-400">Dhs</span>
                    <span className="text-zinc-400 text-sm font-medium ml-1">/mois</span>
                </div>
                <div className="text-xs text-green-600 font-bold mt-2">Facturé annuellement</div>
            </div>

            <Link href="/login?intent=signup" className="mb-8 block">
                <Button className={cn("w-full rounded-2xl h-12 font-bold", popular ? "bg-[#E85C33] hover:bg-[#D54D26]" : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200")}>
                    Commencer
                </Button>
            </Link>

            <div className="space-y-4 flex-1">
                {features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-sm font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors">
                        <CheckCircle2 size={18} className={cn("mt-0.5 flex-shrink-0", popular ? "text-[#E85C33]" : "text-zinc-400")} />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>
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
