"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ArrowRight, Star, Shield, Zap, BarChart3, MessageSquare, Menu, X, Check, Play, ChevronRight, Quote, Download, Inbox, Clock, ChevronDown, Share2, Bot, Sparkles, CheckCircle2, MousePointer2, User, TrendingUp, Search, Coffee, Wifi, ThumbsUp, Mail, MessageCircle, Phone, QrCode, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

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
            <NavLink href="/pricing">Tarifs</NavLink>
            <NavLink href="/#testimonials">Témoignages</NavLink>
            <NavLink href="#about">À propos</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="font-medium text-sm text-zinc-600 hover:text-zinc-900 transition-colors">Se connecter</Link>
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
              <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>Tarifs</Link>
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>Se connecter</Link>
              <Link href="/login?intent=demo" onClick={() => setIsMenuOpen(false)} className="text-[#E85C33]">Réserver une démo</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-20 overflow-hidden">

        {/* HERO SECTION */}
        {/* HERO SECTION */}
        <section className="relative px-6 mb-32 pt-10">
          {/* Modern Grid Background */}
          <div className="absolute inset-0 z-0 h-full w-full pointer-events-none bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

          {/* Noise Texture */}
          <div className="absolute inset-0 z-0 opacity-40 bg-noise mix-blend-soft-light pointer-events-none" />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">

            {/* Hero Copy */}
            <motion.div
              style={{ opacity: heroOpacity }}
              className="max-w-3xl"
            >
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100/50 text-[#E85C33] text-sm font-bold mb-8 shadow-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-[#E85C33] animate-pulse" />
                  La référence pour les établissements premium
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter text-zinc-900 leading-[1.05] mb-8"
                >
                  Ne laissez plus le hasard dicter <br />
                  <span className="whitespace-nowrap">
                    votre <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#E85C33] to-[#ef8e72] relative inline-block pr-2">
                      Réputation.
                      <svg className="absolute w-full h-4 -bottom-2 left-0 text-[#E85C33]/20" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" /></svg>
                    </span>
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl text-zinc-600 mb-8 leading-relaxed font-medium max-w-lg"
                >
                  Automatisez la collecte et la réponse aux avis. Transformez chaque interaction client en une opportunité de chiffre d'affaires.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  <Link href="/login?intent=demo">
                    <Button size="lg" className="rounded-full bg-[#E85C33] hover:bg-[#D54D26] text-white h-14 px-8 text-base shadow-xl shadow-orange-500/20 font-bold transition-transform hover:-translate-y-1 w-full sm:w-auto">
                      Voir une démo
                    </Button>
                  </Link>
                  <Link href="/login" className="group flex items-center gap-3 pl-2 pr-6 py-2 rounded-full bg-white border border-zinc-200/60 text-zinc-600 font-semibold hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm hover:shadow-md w-full sm:w-auto h-14">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowRight size={16} className="text-[#E85C33]" />
                    </div>
                    <span>Essai gratuit 14 jours</span>
                  </Link>
                </motion.div>

              </motion.div>

              {/* Trusted by section removed */}
            </motion.div>

            {/* Hero Visuals - Premium Floating Cards CLUSTER */}
            <motion.div
              style={{ scale: heroScale, opacity: heroOpacity }}
              className="relative h-[700px] hidden lg:block perspective-1000"
            >
              {/* Abstract Background Blobs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#FBECE6] rounded-full blur-[100px] opacity-60 mix-blend-multiply animate-pulse" />
              <div className="absolute top-[10%] right-[0%] w-[400px] h-[400px] bg-purple-100 rounded-full blur-[90px] opacity-40 mix-blend-multiply" />
              <div className="absolute bottom-[10%] left-[0%] w-[300px] h-[300px] bg-orange-100 rounded-full blur-[80px] opacity-50 mix-blend-multiply" />


              {/* 1. TOP RIGHT: REVENUE IMPACT (The "North Star" metric) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 50, y: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                className="absolute top-[2%] right-[-2%] z-30"
              >
                <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] border border-white hover:z-40 transition-all hover:scale-110 duration-500 w-[240px]">
                  <div className="flex items-center gap-2 mb-2 text-zinc-500">
                    <TrendingUp size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Impact Revenu</span>
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-extrabold text-zinc-900">+18%</span>
                    <span className="text-sm font-medium text-emerald-600 mb-1">vs M-1</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, delay: 1 }}
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                    />
                  </div>
                </div>
              </motion.div>


              {/* 2. TOP LEFT: TIME SAVED (Efficiency) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -30, y: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, type: "spring" }}
                className="absolute top-[12%] left-[-10%] z-20"
              >
                <div className="bg-white/70 backdrop-blur-md p-4 rounded-[1.8rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] border border-white/60 hover:bg-white hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#E85C33]">
                      <Clock size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase">Temps Gagné</div>
                      <div className="text-xl font-bold text-zinc-900 leading-tight">12h <span className="text-sm font-medium text-zinc-400">/sem</span></div>
                    </div>
                  </div>
                </div>
              </motion.div>


              {/* 3. CENTER: RANKING DOMINANCE (The Core Visual) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, type: "spring" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[340px]"
              >
                <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(232,92,51,0.2)] border border-white p-6 ring-1 ring-white/60 hover:scale-[1.02] transition-transform duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E85C33] rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-500/30">
                        <Trophy size={20} fill="currentColor" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Classement</div>
                        <div className="text-lg font-extrabold text-zinc-900">Top 3 Régional</div>
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg">Target: #1</span>
                  </div>

                  <div className="space-y-3 relative">
                    {/* Your Biz */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-md border border-zinc-100 relative z-10 scale-105 transform -translate-x-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-zinc-900 text-sm">1. Vous</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star size={12} className="text-amber-400" fill="currentColor" />
                        <span className="font-bold text-zinc-900 text-sm">4.9</span>
                      </div>
                    </div>
                    {/* Competitor */}
                    <div className="flex items-center justify-between p-3 rounded-xl opacity-50 grayscale pl-4">
                      <span className="font-medium text-zinc-500 text-sm">2. Concurrent</span>
                      <span className="font-medium text-zinc-400 text-sm">4.5</span>
                    </div>
                  </div>
                </div>
              </motion.div>


              {/* 4. BOTTOM RIGHT: AUTO-REPLY (Operational Excellence) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 40, y: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, type: "spring" }}
                className="absolute bottom-[10%] right-[-5%] z-20"
              >
                <div className="bg-white/80 backdrop-blur-md p-4 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white max-w-[260px] hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Bot size={14} />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Réponse Auto</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-auto">Active</span>
                  </div>
                  <p className="text-xs text-zinc-600 italic bg-zinc-50 p-2.5 rounded-xl border border-zinc-100/50 leading-relaxed">
                    "Merci Paul ! Ravi que l'expérience vous ait plu..."
                  </p>
                </div>
              </motion.div>


              {/* 5. BOTTOM LEFT: CUSTOMER SATISFACTION (NPS) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -40, y: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9, type: "spring" }}
                className="absolute bottom-[5%] left-[0%] z-20"
              >
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-[1.8rem] shadow-lg border border-white/50 w-[180px] hover:bg-white hover:scale-105 transition-all">
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-zinc-900 mb-1">NPS 78</div>
                    <div className="flex justify-center gap-1 mb-1">
                      <Star size={10} className="text-amber-400" fill="currentColor" />
                      <Star size={10} className="text-amber-400" fill="currentColor" />
                      <Star size={10} className="text-amber-400" fill="currentColor" />
                      <Star size={10} className="text-amber-400" fill="currentColor" />
                      <Star size={10} className="text-amber-400" fill="currentColor" />
                    </div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase">Satisfaction Client</div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </section>




        {/* DASHBOARD PREVIEW */}
        {/* DASHBOARD PREVIEW */}
        <section className="mb-40 px-6 relative">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0 h-full w-full pointer-events-none bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FBECE6]/50 rounded-full blur-[120px] opacity-40 mix-blend-multiply pointer-events-none" />

          <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-zinc-900 mb-6">
              Transformez le bruit <br className="hidden md:block" /> en <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#E85C33] to-[#ef8e72] relative inline-block pr-2">signaux clairs.</span>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto relative group z-10">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-[2.5rem] blur-xl opacity-40 group-hover:opacity-60 transition duration-1000" />

            <div className="relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-visible border border-white ring-1 ring-white/50">
              {/* Browser Chrome */}
              <div className="h-14 bg-white/60 border-b border-zinc-100/80 flex items-center px-6 gap-3 backdrop-blur-md">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]/50 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]/50 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]/50 shadow-sm" />
                </div>
                <div className="ml-6 flex-1 max-w-lg">
                  <div className="bg-zinc-50/50 border border-zinc-200/50 rounded-lg px-4 py-1.5 flex items-center gap-3 text-[11px] text-zinc-400 font-medium shadow-inner">
                    <Shield size={12} className="text-zinc-400" />
                    <span className="text-zinc-500 md:hidden">reput.ai</span>
                    <span className="text-zinc-500 hidden md:inline tracking-tight">app.reput.ai/tableau-de-bord</span>
                  </div>
                </div>
              </div>

              {/* Main Dashboard UI */}
              <div className="p-6 md:p-8 bg-gradient-to-b from-white/40 to-white/10 rounded-b-[2.5rem]">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">
                      <span className="md:hidden">Aperçu</span>
                      <span className="hidden md:inline">Tableau de bord</span>
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-500 font-medium mt-1">Bonjour, voici votre réputation en un coup d'œil.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button className="rounded-xl bg-[#E85C33] hover:bg-[#D54D26] text-white shadow-lg shadow-orange-500/20 transition-all h-9 font-bold border border-orange-400/20 text-xs px-4">
                      <Share2 size={14} className="mr-2" /> Vitrine
                    </Button>
                    <Button variant="outline" className="rounded-xl border-zinc-200/60 text-zinc-600 hover:bg-white h-9 bg-white/50 backdrop-blur-sm font-medium shadow-sm text-xs px-3">
                      <Clock size={14} className="mr-2" /> 30 Jours <ChevronDown size={12} className="ml-2 opacity-50" />
                    </Button>
                    <Button variant="outline" className="rounded-xl border-zinc-200/60 text-zinc-600 hover:bg-white h-9 bg-white/50 backdrop-blur-sm font-medium shadow-sm px-2.5">
                      <Download size={14} />
                    </Button>
                  </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                  {/* Card 1: Trust Score */}
                  <div className="p-6 rounded-[1.5rem] bg-white/60 backdrop-blur-md border border-white/60 shadow-sm flex flex-col justify-between min-h-[180px] hover:shadow-lg hover:bg-white/80 transition-all duration-300 group">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-100/50 group-hover:scale-110 transition-transform">
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Score de Confiance</span>
                      </div>
                      <div className="text-4xl md:text-5xl leading-none font-bold text-zinc-900 tracking-tighter mb-2">3.5</div>
                      <div className="text-xs text-zinc-500 font-medium flex items-center gap-2">
                        sur 5.0
                        <span className="bg-emerald-50 border border-emerald-100/50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold">+0.2 cette semaine</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wide">
                        <span>Taux de Réponse</span>
                        <span>60%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-100">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "60%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-zinc-900 rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Pending Reviews (Orange focal point) */}
                  <div className="p-6 rounded-[1.5rem] bg-gradient-to-br from-[#E85C33] to-[#ef8e72] text-white shadow-xl shadow-orange-500/20 flex flex-col justify-between min-h-[180px] relative overflow-hidden group border border-orange-400/20">
                    <div className="absolute top-0 right-0 p-6 opacity-10 scale-125 transform group-hover:scale-110 transition-transform duration-1000 ease-out">
                      <MessageSquare size={100} fill="currentColor" />
                    </div>
                    {/* Noise & Texture */}
                    <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)]" />

                    <div>
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-inner">
                          <Inbox size={18} className="text-white" />
                        </div>
                        <span className="bg-white/10 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm animate-pulse">Action Requise</span>
                      </div>
                      <div className="relative z-10">
                        <div className="text-4xl md:text-5xl leading-none font-bold tracking-tighter mb-1 drop-shadow-sm">43</div>
                        <div className="font-medium text-orange-50/90 text-sm">Avis en attente</div>
                      </div>
                    </div>
                    <Button className="w-full bg-white text-[#E85C33] hover:bg-orange-50 font-bold rounded-xl h-10 relative z-10 mt-4 shadow-lg shadow-black/5 border border-white/20 text-xs transition-colors">
                      Aller à la boîte de réception <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                  {/* Card 3: Sources */}
                  <div className="p-6 rounded-[1.5rem] bg-white/60 backdrop-blur-md border border-white/60 shadow-sm flex flex-col min-h-[180px] hover:shadow-lg hover:bg-white/80 transition-all duration-300 group">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100/50 group-hover:scale-110 transition-transform">
                        <div className="w-3 h-3 rounded-full border-[2px] border-blue-500/60" />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sources</span>
                    </div>
                    <div className="space-y-4 flex-1 flex flex-col justify-center">
                      {[
                        { name: 'Google', count: 101, color: 'bg-blue-500' },
                        { name: 'Interne', count: 5, color: 'bg-zinc-400' },
                        { name: 'Booking', count: 1, color: 'bg-blue-800' }
                      ].map((source, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-bold text-zinc-700">
                            <span className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${source.color}`} /> {source.name}
                            </span>
                            <span>{source.count}</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-100">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: i === 0 ? '90%' : i === 1 ? '10%' : '5%' }}
                              transition={{ duration: 1, delay: 0.2 * i }}
                              className={`h-full ${source.color} rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Row 2: Charts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Trend Chart */}
                  <div className="md:col-span-2 p-6 rounded-[1.5rem] bg-white/60 backdrop-blur-md border border-white/60 shadow-sm min-h-[260px] hover:shadow-lg hover:bg-white/80 transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-base font-bold text-zinc-900 tracking-tight">Tendance de Réputation</h4>
                        <p className="text-xs text-zinc-500 font-medium">Évolution sur les 14 derniers jours</p>
                      </div>
                      <div className="hidden md:flex bg-zinc-100/50 p-1 rounded-xl border border-zinc-200/50">
                        <div className="px-3 py-1 bg-white rounded-lg text-[10px] font-bold shadow-sm text-zinc-900 border border-zinc-200/50">Note</div>
                        <div className="px-3 py-1 rounded-lg text-[10px] font-bold text-zinc-500 hover:text-zinc-700 cursor-pointer transition-colors">Volume</div>
                      </div>
                    </div>
                    <div className="h-40 relative w-full group">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#E85C33" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#E85C33" stopOpacity="0" />
                          </linearGradient>
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>
                        <path d="M0 35 C 20 35, 30 25, 50 25 S 80 32, 100 32" fill="none" stroke="#E85C33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
                        <path d="M0 35 C 20 35, 30 25, 50 25 S 80 32, 100 32 V 50 H 0 Z" fill="url(#chartGradient)" />

                        {/* Points */}
                        <circle cx="50" cy="25" r="3" fill="white" stroke="#E85C33" strokeWidth="2" className="group-hover:scale-150 transition-transform origin-center cursor-pointer shadow-md" />
                      </svg>
                      {/* Axis Labels */}
                      <div className="absolute inset-0 flex flex-col justify-between text-[8px] text-zinc-300 font-bold pointer-events-none py-1">
                        <span>5.0</span>
                        <span>4.0</span>
                        <span>2.0</span>
                        <div className="flex justify-between text-zinc-400 font-medium mt-auto pt-2 px-1">
                          <span>Dec 13</span>
                          <span>Dec 15</span>
                          <span>Dec 16</span>
                          <span>Dec 17</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="p-6 rounded-[1.5rem] bg-white/60 backdrop-blur-md border border-white/60 shadow-sm min-h-[260px] hover:shadow-lg hover:bg-white/80 transition-all duration-300 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-base font-bold text-zinc-900 tracking-tight">Activité Récente</h4>
                      <div className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-all cursor-pointer"><ArrowRight size={14} className="-rotate-45" /></div>
                    </div>
                    <div className="space-y-4 flex-1">
                      {[1, 2, 3].map((item, i) => (
                        <div key={i} className="flex gap-4 group cursor-pointer hover:bg-white/50 p-2 -mx-2 rounded-xl transition-colors">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ring-4 ring-offset-0 ring-opacity-20 ${i === 0 ? 'bg-red-500 ring-red-500' : i === 1 ? 'bg-amber-500 ring-amber-500' : 'bg-red-500 ring-red-500'}`} />
                          <div>
                            <p className="text-xs font-bold text-zinc-800 line-clamp-2 leading-relaxed group-hover:text-zinc-900 transition-colors">"{i === 0 ? "Grosse déception au Le Grand Hôtel, le service était..." : i === 1 ? "Correct sans plus. Le petit déjeuner manquait de..." : "Honteux ! Il y avait des punaises dans le lit..."}"</p>
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className="text-[10px] text-zinc-400 font-medium group-hover:text-zinc-500">{i === 0 ? "Jean Pierre" : i === 1 ? "Alex" : "Julie"}</span>
                              <div className="w-0.5 h-0.5 rounded-full bg-zinc-300" />
                              <span className="text-[10px] text-zinc-400 font-bold uppercase flex items-center gap-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Google
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Floating Cards Container for Mobile Stacking */}
              <div className="p-6 md:p-0 flex flex-col gap-4 md:block relative">
                {/* FLOATING CARD 1: Ratings Chart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -50 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
                  className="relative md:absolute md:-bottom-12 md:-left-12 bg-white/95 backdrop-blur-xl p-6 rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] md:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-white/50 ring-1 ring-zinc-200/50 w-full md:w-72 z-20"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-zinc-900">Notes au fil du temps</h4>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">+4.2%</span>
                  </div>
                  <div className="h-24 relative overflow-hidden">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#E85C33" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#E85C33" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 40 C 20 40, 40 10, 100 5 V 50 H 0 Z" fill="url(#g1)" />
                      <path d="M0 40 C 20 40, 40 10, 100 5" fill="none" stroke="#E85C33" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>
                </motion.div>

                {/* FLOATING CARD 2: Sentiment Analysis */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 50 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.7, type: "spring" }}
                  className="relative md:absolute md:-bottom-20 md:-right-12 bg-white/95 backdrop-blur-xl p-6 rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] md:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-white/50 ring-1 ring-zinc-200/50 w-full md:w-72 z-30 mt-4 md:mt-0"
                >
                  <h4 className="text-sm font-bold text-zinc-900 mb-6">Analyse de Sentiment</h4>
                  <div className="flex justify-between items-end text-center gap-2">
                    <div className="flex flex-col items-center gap-2 flex-1 group cursor-default">
                      <div className="w-10 h-10 bg-red-50/50 rounded-xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                      </div>
                      <div className="h-1.5 w-full bg-red-100 rounded-full overflow-hidden"><motion.div initial={{ height: 0 }} whileInView={{ height: "100%" }} transition={{ delay: 0.5 }} className="h-full w-[10%] bg-red-500 rounded-full" /></div>
                      <span className="text-xs font-bold text-zinc-400">1</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-1 group cursor-default">
                      <div className="w-10 h-10 bg-amber-50/50 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="8" y1="15" x2="16" y2="15" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                      </div>
                      <div className="h-1.5 w-full bg-amber-100 rounded-full overflow-hidden"><motion.div initial={{ height: 0 }} whileInView={{ height: "100%" }} transition={{ delay: 0.6 }} className="h-full w-[25%] bg-amber-500 rounded-full" /></div>
                      <span className="text-xs font-bold text-zinc-400">3</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-1 group cursor-default">
                      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100/50 group-hover:scale-110 transition-transform">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                      </div>
                      <div className="h-1.5 w-full bg-emerald-100 rounded-full overflow-hidden"><motion.div initial={{ height: 0 }} whileInView={{ height: "100%" }} transition={{ delay: 0.7 }} className="h-full w-[90%] bg-emerald-500 rounded-full" /></div>
                      <span className="text-lg font-bold text-emerald-600">42</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-full pl-1 pr-4 py-1 shadow-sm">
              <span className="bg-[#E85C33] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NOUVEAU</span>
              <span className="text-sm font-medium text-zinc-600">Voir la visite produit</span>
            </div>
          </div>
        </section >

        {/* THE PROBLEM SECTION */}
        <section className="w-full bg-[#E85C33] py-24 md:py-32 mb-32 overflow-hidden relative group">
          {/* Texture & Gradients */}
          <div className="absolute inset-0 bg-noise opacity-30 mix-blend-soft-light pointer-events-none" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-400/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-500/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 mix-blend-screen" />

          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-sm font-bold tracking-wide w-fit shadow-lg shadow-orange-900/10">
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                Le problème
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Votre réputation en ligne est votre <span className="font-serif italic text-orange-100">premier vendeur</span>, ne le laissez pas à l'abandon.
              </h2>
              <p className="text-orange-100 text-xl leading-relaxed opacity-90 max-w-lg font-medium">
                Remerciez à temps ceux qui vous recommandent, gérez les mécontents à temps. Avant qu'il ne soit trop tard.
              </p>
            </div>

            {/* Right Content - Chart Card - Enhanced */}
            <div className="relative group perspective-1000">
              {/* Refined Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-300 to-amber-300 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

              <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] relative z-10 w-full aspect-[4/3] flex flex-col transform transition-transform duration-500 hover:rotate-x-2 border border-white/60 ring-1 ring-white/40">
                {/* Legend */}
                <div className="flex gap-6 mb-8 text-[11px] font-bold uppercase tracking-widest justify-end">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                    <span className="text-zinc-400">Avant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E85C33] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E85C33] shadow-sm"></span>
                    </span>
                    <span className="text-[#E85C33]">Avec Reput.ai</span>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="relative flex-1 w-full flex items-center justify-center">
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 inset-y-4 flex flex-col justify-between pointer-events-none opacity-30">
                    <div className="w-full h-px bg-zinc-200 border-t border-dashed border-zinc-300" />
                    <div className="w-full h-px bg-zinc-200 border-t border-dashed border-zinc-300" />
                    <div className="w-full h-px bg-zinc-200 border-t border-dashed border-zinc-300" />
                    <div className="w-full h-px bg-zinc-200 border-t border-dashed border-zinc-300" />
                  </div>

                  {/* Lines SVG */}
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradientGrowth" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#E85C33" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#FB923C" stopOpacity="1" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Old Way Line (Flat/Dipping) */}
                    <motion.path
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      d="M0,120 C50,115 100,130 150,125 C200,120 250,140 400,135"
                      fill="none"
                      stroke="#e4e4e7"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="8 8"
                    />

                    {/* Growth Line (Exponential) */}
                    <motion.path
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                      d="M0,120 C80,115 120,100 180,90 C240,80 300,50 400,20"
                      fill="none"
                      stroke="url(#gradientGrowth)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      filter="url(#glow)"
                      className="drop-shadow-lg"
                    />

                    {/* Floating Data Point */}
                    <motion.g
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.5, type: "spring" }}
                    >
                      <circle cx="300" cy="50" r="8" fill="white" stroke="#E85C33" strokeWidth="4" className="shadow-lg" />
                      <foreignObject x="270" y="-10" width="120" height="50">
                        <div className="bg-zinc-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-full text-center shadow-xl transform -translate-x-4 -translate-y-8 flex items-center justify-center gap-1">
                          <TrendingUp size={12} className="text-emerald-400" /> +45% Ventes
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 rotate-45" />
                        </div>
                      </foreignObject>
                    </motion.g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* CONCRETE IMPACT SECTION */}
        <section className="mb-40 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 mb-6 tracking-tight">
                Ce que Reput.ai change <span className="text-[#E85C33]">concrètement</span>
              </h2>
              <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed font-medium">
                Nous automatisons la collecte, la réponse et le pilotage de vos avis pour transformer chaque retour en levier de croissance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
              {/* Card 1: Collecte Intelligente */}
              <div className="bg-white p-10 lg:p-12 rounded-[3.5rem] border border-zinc-100 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.06)] hover:shadow-[0_60px_120px_-20px_rgba(232,92,51,0.1)] transition-all duration-500 flex flex-col justify-between h-[520px] overflow-hidden relative group cursor-default">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-125">
                  <MessageCircle size={240} />
                </div>

                {/* Visual Area */}
                <div className="flex-1 flex items-center justify-center mb-10 relative">
                  {/* Glowing blobs */}
                  <div className="absolute w-32 h-32 bg-green-200/40 rounded-full blur-3xl -left-10 -top-10 animate-pulse" />
                  <div className="absolute w-32 h-32 bg-blue-200/40 rounded-full blur-3xl -right-10 -bottom-10 animate-pulse delay-700" />

                  <div className="flex items-center gap-8 relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#25D366] to-[#128c7e] rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_20px_40px_-12px_rgba(37,211,102,0.5)] transform -rotate-12 transition-transform duration-500 group-hover:rotate-0 border-[6px] border-white z-10"><MessageCircle size={42} fill="currentColor" /></div>
                    <div className="w-24 h-24 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] transform rotate-12 transition-transform duration-500 group-hover:rotate-0 border-[6px] border-white z-10"><QrCode size={42} /></div>
                  </div>

                  {/* Animated Connection Line */}
                  <svg className="absolute w-[140%] h-full pointer-events-none top-8" viewBox="0 0 400 200">
                    <path d="M 0 100 Q 200 180 400 100" stroke="#E85C33" strokeWidth="3" fill="none" className="opacity-0 group-hover:opacity-20 transition-opacity duration-700" strokeDasharray="8 8">
                      <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
                    </path>
                  </svg>
                </div>

                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-zinc-900 mb-4 group-hover:text-[#E85C33] transition-colors duration-300">Collecte intelligente</h3>
                  <p className="text-zinc-500 font-medium leading-relaxed text-xl">
                    Enquêtes brandées aux couleurs de votre marque. WhatsApp ou QR Code.
                  </p>
                </div>
              </div>

              {/* Card 2: Pilotage Clair */}
              <div className="bg-white p-10 lg:p-12 rounded-[3.5rem] border border-zinc-100 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.06)] hover:shadow-[0_60px_120px_-20px_rgba(59,130,246,0.1)] transition-all duration-500 flex flex-col justify-between h-[520px] overflow-hidden relative group cursor-default">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-700 transform group-hover:-rotate-12 group-hover:scale-125">
                  <BarChart3 size={240} />
                </div>

                {/* Visual Area */}
                <div className="flex-1 flex flex-col items-center justify-center gap-6 mb-10">
                  <div className="flex gap-4">
                    <span className="bg-gradient-to-b from-zinc-50 to-zinc-100 border border-zinc-200 text-zinc-600 px-6 py-3 rounded-full font-bold text-lg shadow-sm">NPS : 72</span>
                    <span className="bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-200 text-blue-700 px-6 py-3 rounded-full font-bold text-lg shadow-sm flex items-center gap-2">CSAT <Star size={18} fill="currentColor" /> : 94%</span>
                  </div>
                  <div className="bg-white border border-zinc-100 px-10 py-6 rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] flex items-center gap-5 group-hover:scale-105 transition-transform duration-500 relative">
                    <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-emerald-400 to-green-500 opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-100 relative z-10" />
                    <span className="font-bold text-zinc-900 text-2xl relative z-10">Note : 4.9<span className="text-zinc-400 text-lg">/5</span></span>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-zinc-900 mb-4 group-hover:text-[#E85C33] transition-colors duration-300">Pilotage clair</h3>
                  <p className="text-zinc-500 font-medium leading-relaxed text-xl">
                    Dashboard unifié pour piloter votre e-réputation. Analysez vos performances par canal et par établissement.
                  </p>
                </div>
              </div>

              {/* Card 3: Gain de Temps */}
              <div className="bg-white p-10 lg:p-12 rounded-[3.5rem] border border-zinc-100 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.06)] hover:shadow-[0_60px_120px_-20px_rgba(251,146,60,0.1)] transition-all duration-500 flex flex-col justify-between h-[520px] overflow-hidden relative group cursor-default">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-700 transform group-hover:translate-x-10">
                  <Zap size={240} />
                </div>

                {/* Visual Area */}
                <div className="flex-1 flex items-center justify-center mb-10 pl-8">
                  <div className="relative w-full max-w-[340px]">
                    <div className="absolute -left-6 top-0 w-12 h-12 bg-white rounded-full border border-zinc-100 flex items-center justify-center z-10 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] text-zinc-400"><User size={20} /></div>
                    <div className="bg-white p-5 rounded-[2rem] rounded-tl-none mb-6 text-base text-zinc-500 border border-zinc-100 ml-4 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] font-medium">
                      Super service, merci beaucoup !
                    </div>

                    <div className="absolute -right-6 top-24 w-12 h-12 bg-gradient-to-br from-[#E85C33] to-[#ff8c69] rounded-full ring-4 ring-white flex items-center justify-center z-10 text-white shadow-xl"><Sparkles size={20} /></div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 rounded-[2rem] rounded-tr-none text-base text-zinc-800 border border-orange-100/50 ml-auto mr-4 shadow-[0_10px_30px_-10px_rgba(232,92,51,0.15)] w-fit relative group-hover:-translate-y-2 transition-transform duration-500 ease-out backdrop-blur-sm">
                      <span className="font-bold text-[#E85C33] block mb-1 text-xs uppercase tracking-wide">Réponse IA générée</span>
                      Merci pour votre retour ! Ravi que vous ayez apprécié...
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-zinc-900 mb-4 group-hover:text-[#E85C33] transition-colors duration-300">Gain de temps</h3>
                  <p className="text-zinc-500 font-medium leading-relaxed text-xl">
                    Laissez notre IA rédiger des réponses parfaites et personnalisées en quelques secondes.
                  </p>
                </div>
              </div>

              {/* Card 4: Conversion */}
              <div className="bg-white p-10 lg:p-12 rounded-[3.5rem] border border-zinc-100 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.06)] hover:shadow-[0_60px_120px_-20px_rgba(16,185,129,0.1)] transition-all duration-500 flex flex-col justify-between h-[520px] overflow-hidden relative group cursor-default">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-700">
                  <Share2 size={240} />
                </div>

                {/* Visual Area */}
                <div className="flex-1 flex items-center justify-center mb-10 perspective-[1000px]">
                  <div className="bg-white border border-zinc-200/60 p-6 rounded-3xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] w-[80%] rotate-y-12 rotate-x-12 group-hover:rotate-y-0 group-hover:rotate-x-0 transition-transform duration-700 ease-out relative z-10">
                    <div className="absolute -top-4 -right-4 bg-zinc-900 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg ring-4 ring-white">Widget</div>
                    <div className="flex items-center gap-1.5 text-[#E85C33] mb-4">
                      <Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" />
                    </div>
                    <div className="h-3 w-3/4 bg-zinc-100 rounded-full mb-3" />
                    <div className="h-3 w-1/2 bg-zinc-100 rounded-full" />
                  </div>

                  {/* Floating QR Code */}
                  <div className="absolute bg-gradient-to-br from-[#E85C33] to-[#d4481f] w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-[0_20px_40px_-10px_rgba(232,92,51,0.4)] -left-2 top-1/2 -translate-y-1/2 -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500 border-4 border-white z-20">
                    <QrCode size={32} />
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-zinc-900 mb-4 group-hover:text-[#E85C33] transition-colors duration-300">Convertissez & Fidélisez</h3>
                  <p className="text-zinc-500 font-medium leading-relaxed text-xl">
                    Affichez votre réputation sur votre site avec nos widgets et collectez des avis via QR codes.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section >
        <section className="mb-32 px-4 md:px-6 relative">
          {/* Background Gradient Blob */}
          <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 mix-blend-multiply pointer-events-none" />

          <div className="max-w-6xl mx-auto bg-white/60 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.05)] border border-white/60 ring-1 ring-white/50 overflow-visible relative">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left Column: Copy */}
              <div className="relative z-10 order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full pl-1.5 pr-3 py-1 mb-6 shadow-sm">
                  <span className="bg-[#E85C33] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">Pilote Auto</span>
                  <span className="text-xs font-bold text-[#E85C33] flex items-center gap-1"><Sparkles size={10} /> Intégration GPT-4o</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-6 leading-[1.1] tracking-tight">
                  Réponses automatiques sur <span className="font-serif italic text-[#E85C33]">WhatsApp & Google.</span>
                </h3>
                <p className="text-lg text-zinc-600 mb-8 leading-relaxed font-medium">
                  Notre IA répond instantanément via WhatsApp ET sur vos avis Google, TripAdvisor ou Booking. Vous choisissez la plateforme, nous gérons les réponses.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    "Auto-réponse WhatsApp (conversations clients)",
                    "Auto-réponse Google Reviews (Pack Pro)",
                    "Multi-plateformes : Google, TripAdvisor, Booking",
                    "Escalade intelligente pour les avis négatifs"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border border-orange-100/50">
                        <Check size={14} className="text-[#E85C33] stroke-[3px]" />
                      </div>
                      <span className="text-base text-zinc-700 font-medium group-hover:text-zinc-900 transition-colors">{item}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full md:w-auto rounded-xl bg-[#E85C33] text-white hover:bg-[#d54d26] h-12 px-8 text-base font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all hover:-translate-y-0.5">
                  Commencer l'automatisation <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>

              {/* Right Column: Visual Demo */}
              <div className="relative order-1 lg:order-2 mb-8 lg:mb-0 perspective-1000">
                {/* Decorative elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-orange-200/30 to-blue-50/30 rounded-full blur-3xl -z-10 animate-pulse" />

                {/* Main Demo Card */}
                <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden relative transform hover:rotate-y-2 transition-transform duration-500 ring-1 ring-white/50">
                  {/* Header */}
                  <div className="bg-white/50 border-b border-zinc-100 p-5 flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-[#E85C33] to-[#ff8f6b] rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                        <Bot size={18} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Agent IA</div>
                        <div className="text-xs font-bold text-zinc-800">Réponse Automatique</div>
                      </div>
                    </div>
                    <div className="flex gap-1.5 opacity-50">
                      <div className="w-2 h-2 rounded-full bg-zinc-300" />
                      <div className="w-2 h-2 rounded-full bg-zinc-300" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    {/* User Review */}
                    <div className="bg-white rounded-2xl p-5 mb-8 border border-zinc-100 shadow-sm relative">
                      {/* Quote Icon */}
                      <div className="absolute -top-3 -left-2 bg-[#E85C33] w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm text-white">
                        <MessageSquare size={14} fill="currentColor" />
                      </div>

                      <div className="flex items-center justify-between mb-3 ml-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-zinc-900">Sarah M.</span>
                          <span className="text-[10px] text-zinc-400 font-medium px-2 py-0.5 bg-zinc-100 rounded-full">Google Review</span>
                        </div>
                        <div className="flex text-amber-400 gap-0.5 filter drop-shadow-sm">
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                        </div>
                      </div>
                      <p className="text-[13px] text-zinc-600 italic leading-relaxed pl-1">"J'ai adoré l'ambiance ! Le personnel était incroyablement sympa..."</p>
                    </div>

                    {/* AI Reply Simulation */}
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold text-[#E85C33] uppercase tracking-wider flex items-center gap-1.5 bg-orange-50 px-2 py-1 rounded-md border border-orange-100/50">
                          <Sparkles size={10} /> Génération de réponse...
                        </span>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50/80 to-white/50 rounded-2xl p-5 border border-orange-100 shadow-inner min-h-[110px]">
                        <p className="text-sm text-zinc-800 leading-relaxed font-medium">
                          <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, ease: "linear" }}
                          >
                            Merci beaucoup Sarah ! 🧡 Nous sommes ravis de savoir que vous avez apprécié l'ambiance et notre café.
                          </motion.span>
                          <span className="inline-block w-1.5 h-4 bg-[#E85C33] ml-1 align-middle animate-pulse rounded-full" />
                        </p>
                      </div>

                      {/* Floating Cursor Animation */}
                      <motion.div
                        className="absolute -bottom-6 -right-6 z-20 pointer-events-none hidden md:block"
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        whileInView={{ x: -140, y: -50, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      >
                        <div className="bg-zinc-900 text-white px-3 py-1.5 rounded-full rounded-tl-none font-bold text-[10px] shadow-xl flex items-center gap-1.5 border border-white/20">
                          <MousePointer2 size={12} className="-rotate-90" fill="currentColor" /> Réponse Auto
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-3 backdrop-blur-sm">
                    <div className="px-5 py-2.5 bg-white border border-zinc-200 text-zinc-400 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-50 cursor-pointer transition-colors shadow-sm">Éditer</div>
                    <div className="px-5 py-2.5 bg-[#E85C33] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer hover:bg-[#d54d26] transition-all transform hover:scale-105">
                      <CheckCircle2 size={12} /> Publié
                    </div>
                  </div>
                </div>

                {/* Floating Stat Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white flex items-center gap-3 scale-90 md:scale-100 z-30 hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-200/50">
                    <Clock size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Temps Gagné</div>
                    <div className="text-lg font-extrabold text-zinc-900 leading-none">12h <span className="text-zinc-400 text-xs font-medium">/ sem</span></div>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </section>


        {/* BANNER 1 - DARK PREMIUM CTA */}
        <section className="mb-32 w-full bg-zinc-900 py-24 md:py-32 relative overflow-hidden group">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />

          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">À quel point votre réputation <br className="hidden md:block" /> compte pour vous ?</h3>
            <p className="text-zinc-400 mb-10 max-w-xl mx-auto text-lg font-medium leading-relaxed">
              Ne laissez pas un avis négatif sans réponse. Dans le jeu de la réputation, la vitesse est reine.
            </p>
            <Link href="/login">
              <Button className="rounded-full bg-white text-zinc-900 hover:bg-zinc-100 px-10 h-14 text-lg shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] font-bold transition-all hover:scale-105">
                Prendre le contrôle
              </Button>
            </Link>
          </div>
        </section>

        {/* QR KIT PHYSIQUE SECTION */}
        <section className="mb-32 px-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-100/30 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Left: Visual */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-orange-100 to-amber-50 rounded-full blur-3xl opacity-60" />

                {/* QR Kit Box Visual */}
                <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-[3rem] p-10 shadow-[0_40px_80px_-20px_rgba(232,92,51,0.15)] border border-white ring-1 ring-white/50">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#E85C33] to-[#ff8c69] rounded-3xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                      <QrCode size={36} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Inclus dans votre offre</div>
                      <div className="text-2xl font-extrabold text-zinc-900">Kit QR Premium</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { icon: <Shield size={18} />, text: "Support plexiglass haute qualité" },
                      { icon: <Inbox size={18} />, text: "Livraison offerte" },
                      { icon: <Sparkles size={18} />, text: "Design personnalisé à votre marque" },
                      { icon: <Zap size={18} />, text: "QR dynamique (modifiable)" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50/80 to-white rounded-2xl border border-orange-100/50 group hover:shadow-md hover:border-orange-200/50 transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-[#E85C33]/10 flex items-center justify-center text-[#E85C33] group-hover:bg-[#E85C33] group-hover:text-white transition-all duration-300">
                          {item.icon}
                        </div>
                        <span className="text-base font-medium text-zinc-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute -top-6 -right-6 bg-[#E85C33] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-orange-500/30 flex items-center gap-2"
                >
                  <Check size={16} strokeWidth={3} /> Livré chez vous
                </motion.div>
              </div>

              {/* Right: Copy */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full pl-1.5 pr-3 py-1 shadow-sm">
                  <span className="bg-[#E85C33] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">Différenciant</span>
                  <span className="text-xs font-bold text-[#E85C33]">Inclus dans tous les packs</span>
                </div>

                <h3 className="text-4xl md:text-5xl font-extrabold text-zinc-900 leading-tight tracking-tight">
                  On vous livre votre <span className="font-serif italic text-[#E85C33]">Kit QR.</span>
                </h3>

                <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                  Pas de bricolage, pas d'impression maison. Nous vous envoyons un support professionnel prêt à poser sur vos tables ou comptoir. Vos clients scannent, vous récoltez les avis.
                </p>

                <div className="flex flex-wrap gap-3 pt-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 bg-white px-4 py-2.5 rounded-full border border-zinc-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all">
                    <Clock size={14} className="text-[#E85C33]" />
                    Prêt en 48h
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 bg-white px-4 py-2.5 rounded-full border border-zinc-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all">
                    <Inbox size={14} className="text-[#E85C33]" />
                    Livraison Maroc entier
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 bg-white px-4 py-2.5 rounded-full border border-zinc-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all">
                    <Zap size={14} className="text-[#E85C33]" />
                    QR modifiable
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE: ANALYTICS */}
        <section className="mb-32 px-6 relative">
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-orange-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 mix-blend-multiply pointer-events-none" />

          <div className="max-w-6xl mx-auto bg-white/60 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 shadow-[0_40px_100px_-30px_rgba(232,92,51,0.08)] border border-white/60 ring-1 ring-white/50 overflow-hidden relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left Column: Copy */}
              <div className="space-y-8 relative z-10">
                <div className="inline-flex items-center gap-2 bg-orange-50/80 border border-orange-100 rounded-full pl-1.5 pr-3 py-1 shadow-sm">
                  <span className="bg-[#E85C33] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">Analyses</span>
                  <span className="text-xs font-bold text-[#E85C33]">Analyse de Sentiment</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-extrabold text-zinc-900 leading-[1.1] tracking-tight">
                  Décodez les avis de <span className="font-serif italic text-[#E85C33]">vos clients.</span>
                </h3>
                <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                  Est-ce le petit-déjeuner ? Le bruit ? Le WiFi ? Notre IA lit entre les lignes pour vous dire exactement quoi corriger pour obtenir cette 5ème étoile.
                </p>

                <div className="grid gap-6">
                  <div className="flex gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-[#E85C33] shadow-sm border border-orange-100 group-hover:bg-[#E85C33] group-hover:text-white transition-all duration-300">
                      <Search size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg mb-1">Suivi de Mots-clés</h4>
                      <p className="text-zinc-500 text-sm leading-relaxed">Suivez l'évolution de termes spécifiques comme "Propreté" ou "Personnel" dans le temps.</p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="rounded-xl border-orange-200 text-[#E85C33] hover:bg-orange-50 hover:border-orange-300 px-8 h-12 font-bold shadow-sm bg-white/50 backdrop-blur-sm transition-all hover:shadow-md">
                  Explorer les Analyses
                </Button>
              </div>

              {/* Right Column: Visual Demo */}
              <div className="relative perspective-1000">
                {/* Decorative elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-bl from-orange-100/50 to-amber-50/50 rounded-full blur-3xl -z-10" />

                <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(232,92,51,0.1)] p-6 md:p-10 relative transform hover:rotate-x-2 transition-transform duration-500 ring-1 ring-white/60">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h4 className="text-xl font-bold text-zinc-900 tracking-tight">Dimensions Clés</h4>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1">Impact sur la Note Globale</p>
                    </div>
                    <div className="bg-zinc-100/80 p-1 rounded-xl flex text-xs font-bold text-zinc-500 border border-zinc-200/50">
                      <span className="bg-white text-zinc-900 shadow-sm px-3 py-1.5 rounded-lg border border-black/5">Positif</span>
                      <span className="px-3 py-1.5 hover:text-zinc-700 cursor-pointer transition-colors">Négatif</span>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Keyword 1: Coffee */}
                    <div className="group">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl text-[#E85C33] border border-orange-100/50 shadow-sm group-hover:scale-110 transition-transform"><Coffee size={16} /></div>
                          <span className="font-bold text-zinc-800 text-sm">Café</span>
                        </div>
                        <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">+4.8 Impact</span>
                      </div>
                      <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "92%" }}
                          transition={{ duration: 1, delay: 0 }}
                          className="h-full bg-gradient-to-r from-[#E85C33] to-[#ff8c69] rounded-full shadow-[0_0_10px_rgba(232,92,51,0.3)]"
                        />
                      </div>
                    </div>

                    {/* Keyword 2: Staff */}
                    <div className="group">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl text-[#E85C33] border border-orange-100/50 shadow-sm group-hover:scale-110 transition-transform"><User size={16} /></div>
                          <span className="font-bold text-zinc-800 text-sm">Amabilité du Staff</span>
                        </div>
                        <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">+3.2 Impact</span>
                      </div>
                      <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "75%" }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-[#E85C33] to-[#ff8c69] rounded-full shadow-[0_0_10px_rgba(232,92,51,0.3)]"
                        />
                      </div>
                    </div>

                    {/* Keyword 3: WiFi */}
                    <div className="group">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl text-[#E85C33] border border-orange-100/50 shadow-sm group-hover:scale-110 transition-transform"><Wifi size={16} /></div>
                          <span className="font-bold text-zinc-800 text-sm">Connexion WiFi</span>
                        </div>
                        <span className="text-red-500 font-bold text-sm bg-red-50 px-2 py-0.5 rounded-md border border-red-100/50">-2.1 Impact</span>
                      </div>
                      <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "45%" }}
                          transition={{ duration: 1, delay: 0.4 }}
                          className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* TESTIMONIALS */}
        <section id="testimonials" className="mb-40 px-6">
          <div className="max-w-7xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6">Transformez vos clients heureux en <br /> nouveaux clients.</h2>
          </div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Je passais 2h par jour sur les avis. Maintenant 10 minutes. Le ROI est immédiat."
              author="Marc Dubois"
              role="Propriétaire, Le Petit Bistro"
              image="https://i.pravatar.cc/150?u=1"
            />
            <TestimonialCard
              quote="Reput.ai a détecté un avis 1 étoile sur une chambre froide 5 minutes après sa publication. On a réglé ça avant le départ du client."
              author="Sarah Jenkins"
              role="DG, Hôtel Horizon"
              image="https://i.pravatar.cc/150?u=2"
              highlight
            />
            <TestimonialCard
              quote="La fonction 'Brouillon' est magique. Ça sonne exactement comme moi, sans les fautes."
              author="David Chen"
              role="Manager, Blue Bay Resort"
              image="https://i.pravatar.cc/150?u=3"
            />
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="mb-20 px-6">
          <div className="max-w-7xl mx-auto bg-zinc-900 rounded-[3rem] p-16 md:p-32 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-zinc-950" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-10">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight">Prêt à prendre le contrôle ?</h2>
              <p className="text-xl text-zinc-400 max-w-xl mx-auto">Rejoignez +2,000 entreprises qui grandissent avec Reput.ai. Pas de carte requise.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login?intent=demo" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto rounded-full bg-[#E85C33] hover:bg-[#D54D26] text-white px-10 h-16 text-lg font-bold shadow-2xl shadow-orange-500/20">
                    Réserver une démo
                  </Button>
                </Link>
                <Link href="#demo" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto rounded-full border-zinc-700 text-white hover:bg-zinc-800 hover:text-white px-10 h-16 text-lg font-bold bg-transparent">
                    Parler à un vendeur
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-zinc-600 font-medium uppercase tracking-widest">Annulable à tout moment • Installation instantanée</p>
            </div>
          </div>
        </section >

        {/* FOOTER */}
        < footer className="max-w-7xl mx-auto px-6 pt-10 pb-20 border-t border-zinc-200" >
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
        </footer >

      </main >
    </div >
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-full transition-all">
      {children}
    </a>
  )
}

function FloatingCard({ className, delay, author, text, stars, accent }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay, type: "spring" }}
      className={cn(
        "absolute bg-white p-5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-zinc-100 w-72 flex flex-col gap-3",
        accent && "border-[#E85C33]/20 ring-4 ring-[#E85C33]/5",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-1 text-[#E58C33]">
          {[...Array(stars)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
        </div>
        <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-400">G</div>
      </div>
      <p className="text-sm font-medium text-zinc-800 leading-snug">"{text}"</p>
      <div className="flex items-center gap-2 mt-1">
        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white", accent ? "bg-[#E85C33]" : "bg-zinc-300")}>
          {author.charAt(0)}
        </div>
        <span className="text-xs font-semibold text-zinc-400">{author}</span>
      </div>
    </motion.div>
  )
}

function TestimonialCard({ quote, author, role, image, highlight }: any) {
  return (
    <div className={cn(
      "p-10 rounded-[2.5rem] flex flex-col justify-between h-full transition-transform hover:-translate-y-1 duration-300 pointer-events-none md:pointer-events-auto",
      highlight ? "bg-zinc-900 text-white shadow-2xl" : "bg-white text-zinc-900 border border-zinc-100 shadow-sm"
    )}>
      <Quote className={cn("mb-6 opacity-20", highlight ? "text-white" : "text-zinc-900")} size={40} />
      <p className={cn("text-xl font-medium leading-relaxed mb-8", highlight ? "text-zinc-200" : "text-zinc-600")}>
        "{quote}"
      </p>
      <div className="flex items-center gap-4">
        <Image src={image} alt={author} width={48} height={48} className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10" />
        <div>
          <div className="font-bold">{author}</div>
          <div className={cn("text-sm", highlight ? "text-zinc-400" : "text-zinc-500")}>{role}</div>
        </div>
      </div>
    </div>
  )
}
