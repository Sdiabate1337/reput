"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ArrowRight, Star, Shield, Zap, BarChart3, MessageSquare, Menu, X, Check, Play, ChevronRight, Quote, Download, Inbox, Clock, ChevronDown, Share2, Bot, Sparkles, CheckCircle2, MousePointer2, User, TrendingUp, Search, Coffee, Wifi, ThumbsUp } from "lucide-react"
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
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#testimonials">Stories</NavLink>
            <NavLink href="#about">About</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="font-medium text-sm text-zinc-600 hover:text-zinc-900 transition-colors">Log in</Link>
            <Link href="/login?intent=demo">
              <Button className="rounded-full bg-[#E85C33] hover:bg-[#D54D26] text-white px-6 h-11 shadow-lg shadow-orange-500/20 font-semibold text-sm transition-all hover:scale-105 active:scale-95">
                Book a Demo
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
              <Link href="#features" onClick={() => setIsMenuOpen(false)}>Features</Link>
              <Link href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>Log in</Link>
              <Link href="/login?intent=demo" onClick={() => setIsMenuOpen(false)} className="text-[#E85C33]">Book a Demo</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-20 overflow-hidden">

        {/* HERO SECTION */}
        <section className="relative px-6 mb-32 pt-10 md:pt-20">
          {/* Modern Grid Background - Fixed Hydration & Visibility */}
          <div className="absolute inset-0 z-0 h-full w-full pointer-events-none bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">

            {/* Hero Copy */}
            <motion.div
              style={{ opacity: heroOpacity }}
              className="max-w-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#E85C33] text-xs font-bold uppercase tracking-wider mb-6"
              >
                <Zap size={12} fill="currentColor" />
                New: AI Context Awareness
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-5xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tight text-zinc-900 leading-[1.05] mb-6"
              >
                Turn Reviews into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E85C33] to-[#ef8e72] relative inline-block">
                  Revenue.
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#E85C33]/20" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" /></svg>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-zinc-600 mb-8 leading-relaxed font-medium max-w-lg"
              >
                The automated reputation engine that monitors, analyzes, and responds to reviews 24/7. <span className="text-zinc-900 font-semibold">Boost your local ranking in weeks.</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <Link href="/login?intent=demo">
                  <Button size="lg" className="rounded-full bg-[#E85C33] hover:bg-[#D54D26] text-white h-14 px-8 text-base shadow-xl shadow-orange-500/20 font-bold transition-transform hover:-translate-y-1 w-full sm:w-auto">
                    Book a Demo
                  </Button>
                </Link>
                <Link href="#features" className="group flex items-center gap-3 pl-2 pr-6 py-2 rounded-full bg-white border border-zinc-200 text-zinc-600 font-semibold hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm w-full sm:w-auto h-14">
                  <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={16} fill="currentColor" className="text-zinc-500 ml-0.5" />
                  </div>
                  <span>See how it works</span>
                </Link>
              </motion.div>

              <div className="mt-10 flex items-center gap-4 text-sm font-medium text-zinc-500">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <Image key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-white bg-zinc-100" />
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-[#E85C33]">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                  </div>
                  <p className="text-xs text-zinc-400">Trusted by <span className="text-zinc-700 font-bold">2,000+ businesses</span></p>
                </div>
              </div>
            </motion.div>

            {/* Hero Visuals - Floating Cards */}
            <motion.div
              style={{ scale: heroScale, opacity: heroOpacity }}
              className="relative h-[600px] hidden lg:block"
            >
              {/* Abstract Background Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FBECE6] rounded-full blur-3xl opacity-60" />

              {/* Floating Review Card 1 - TIME SAVED */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
                className="absolute top-[10%] right-[10%] md:right-[50px] z-20"
              >
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white/50 max-w-[260px] transform rotate-[-2deg] transition-transform hover:rotate-0 hover:scale-105 duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex text-amber-400 gap-0.5">
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border border-emerald-100">
                      <Clock size={10} /> 50h saved/mo
                    </div>
                  </div>
                  <p className="text-sm text-zinc-700 font-medium leading-relaxed mb-3">
                    "The AI drafts are <span className="text-zinc-900 font-bold bg-orange-100/50 px-1 rounded">100% human-like</span>. My team loves it."
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-500">SM</div>
                    <span className="text-xs font-bold text-zinc-400">Sophie M.</span>
                  </div>
                </div>
              </motion.div>

              {/* HERO FEATURE: AI AGENT CARD */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[340px] bg-white/95 backdrop-blur-xl rounded-[28px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[1.5px] border-white p-6"
              >
                <div className="flex items-center gap-4 mb-5 border-b border-zinc-100 pb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl flex items-center justify-center text-[#E85C33] shadow-inner">
                    <Bot size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">AI Auto-Pilot</div>
                    <div className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      Active
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-zinc-50/80 p-4 rounded-2xl border border-zinc-100 relative group cursor-default transition-colors hover:bg-zinc-50">
                    <div className="flex text-amber-400 gap-0.5 mb-2">
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                    </div>
                    <p className="text-xs text-zinc-600 italic leading-relaxed line-clamp-2">"Impressive service! The team went above and beyond to make our stay comfortable."</p>
                  </div>

                  <div className="relative pl-4 border-l-2 border-[#E85C33]/20">
                    <div className="text-[10px] font-extrabold text-[#E85C33] mb-1.5 flex items-center gap-1.5 uppercase tracking-wider"><Sparkles size={10} /> AI Drafting</div>
                    <p className="text-sm text-zinc-800 leading-relaxed font-medium">
                      Thank you! We're thrilled <br /> to hear you had a great experience.
                      <span className="inline-block w-1.5 h-4 bg-[#E85C33] ml-1 align-middle animate-pulse rounded-full" />
                    </p>

                    {/* Cursor Overlay */}
                    <div className="absolute -bottom-3 -right-2 bg-zinc-900 text-white text-[10px] px-3 py-1.5 rounded-full rounded-tl-none font-bold shadow-xl flex items-center gap-1.5 transform translate-x-4 translate-y-4 border-[3px] border-white">
                      <MousePointer2 size={10} className="-rotate-90" fill="currentColor" /> Auto-Reply
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Review Card 3 */}
              <FloatingCard
                className="bottom-20 right-20 z-20"
                delay={0.6}
                author="Le Petit Chef"
                text="Finally a dashboard that makes sense. Love it."
                stars={4}
              />
            </motion.div>
          </div>
        </section>

        {/* DASHBOARD PREVIEW */}
        <section className="mb-40 px-6">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-6">
              Turn noise into <span className="text-[#E85C33]">clear signals.</span>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-br from-orange-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000" />

            <div className="relative bg-[#Fdfcf8] rounded-3xl shadow-2xl overflow-visible border border-zinc-200/50">
              {/* Browser Chrome */}
              <div className="h-12 bg-white border-b border-zinc-100 flex items-center px-4 gap-2 rounded-t-3xl">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e] border border-[#d89e24]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840] border border-[#1aab29]" />
                </div>
                <div className="ml-4 flex-1 max-w-lg">
                  <div className="bg-zinc-100/50 border border-zinc-200/50 rounded-md px-3 py-1 flex items-center gap-2 text-[10px] text-zinc-400 font-medium">
                    <Shield size={10} className="text-zinc-500" />
                    <span className="text-zinc-500 md:hidden">reput.ai</span>
                    <span className="text-zinc-500 hidden md:inline">app.reput.ai/dashboard</span>
                  </div>
                </div>
              </div>

              {/* Main Dashboard UI */}
              <div className="p-6 md:p-8 bg-[#Fdfcf8] rounded-b-3xl overflow-hidden">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">
                      <span className="md:hidden">Overview</span>
                      <span className="hidden md:inline">Dashboard</span>
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-500 font-medium mt-1">Good afternoon, here is your reputation at a glance.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button className="rounded-lg bg-[#E85C33] hover:bg-[#D54D26] text-white shadow-sm transition-all h-9 font-bold border border-orange-400/20 text-xs px-3">
                      <Share2 size={14} className="mr-2" /> Showcase
                    </Button>
                    <Button variant="outline" className="rounded-lg border-zinc-200 text-zinc-600 hover:bg-zinc-50 h-9 bg-white font-medium shadow-sm text-xs px-3">
                      <Clock size={14} className="mr-2" /> 30 Days <ChevronDown size={12} className="ml-2 opacity-50" />
                    </Button>
                    <Button variant="outline" className="rounded-lg border-zinc-200 text-zinc-600 hover:bg-zinc-50 h-9 bg-white font-medium shadow-sm px-2.5">
                      <Download size={14} />
                    </Button>
                  </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                  {/* Card 1: Trust Score */}
                  <div className="p-6 rounded-2xl bg-gradient-to-b from-white to-zinc-50/50 border border-zinc-200/60 shadow-sm flex flex-col justify-between min-h-[180px] hover:shadow-md transition-shadow duration-500">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-100/50">
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Trust Score</span>
                      </div>
                      <div className="text-4xl md:text-5xl leading-none font-bold text-zinc-900 tracking-tighter mb-2">3.5</div>
                      <div className="text-xs text-zinc-500 font-medium flex items-center gap-2">
                        out of 5.0
                        <span className="bg-emerald-50 border border-emerald-100/50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold">+0.2 this week</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wide">
                        <span>Response Rate</span>
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
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#E85C33] to-[#D54D26] text-white shadow-lg shadow-orange-500/20 flex flex-col justify-between min-h-[180px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 scale-125 transform group-hover:scale-110 transition-transform duration-1000 ease-out">
                      <MessageSquare size={100} fill="currentColor" />
                    </div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />

                    <div>
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg">
                          <Inbox size={18} className="text-white" />
                        </div>
                        <span className="bg-white/10 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">Action Required</span>
                      </div>
                      <div className="relative z-10">
                        <div className="text-4xl md:text-5xl leading-none font-bold tracking-tighter mb-1">43</div>
                        <div className="font-medium text-orange-50/90 text-sm">Pending Reviews</div>
                      </div>
                    </div>
                    <Button className="w-full bg-white text-[#E85C33] hover:bg-orange-50 font-bold rounded-lg h-10 relative z-10 mt-4 shadow-sm border border-white/20 text-xs">
                      Go to Inbox <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                  {/* Card 3: Sources */}
                  <div className="p-6 rounded-2xl bg-gradient-to-b from-white to-zinc-50/50 border border-zinc-200/60 shadow-sm flex flex-col min-h-[180px] hover:shadow-md transition-shadow duration-500">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100/50">
                        <div className="w-3 h-3 rounded-full border-[2px] border-blue-500/60" />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sources</span>
                    </div>
                    <div className="space-y-4 flex-1 flex flex-col justify-center">
                      {[
                        { name: 'Google', count: 101, color: 'bg-blue-500' },
                        { name: 'Internal', count: 5, color: 'bg-zinc-400' },
                        { name: 'Booking', count: 1, color: 'bg-blue-800' }
                      ].map((source, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-bold text-zinc-700">
                            <span className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${source.color}`} /> {source.name}
                            </span>
                            <span>{source.count}</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-100/50">
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
                  <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-b from-white to-zinc-50/30 border border-zinc-200/60 shadow-sm min-h-[260px]">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-base font-bold text-zinc-900 tracking-tight">Reputation Trend</h4>
                        <p className="text-xs text-zinc-500 font-medium">Rating evolution over the last 14 days</p>
                      </div>
                      <div className="hidden md:flex bg-zinc-100/80 p-1 rounded-lg border border-zinc-200/50">
                        <div className="px-3 py-1 bg-white rounded-md text-[10px] font-bold shadow-sm text-zinc-900 border border-zinc-200/50">Rating</div>
                        <div className="px-3 py-1 rounded-md text-[10px] font-bold text-zinc-500 hover:text-zinc-700 cursor-pointer transition-colors">Volume</div>
                      </div>
                    </div>
                    <div className="h-40 relative w-full">
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
                        <path d="M0 35 C 20 35, 30 25, 50 25 S 80 32, 100 32" fill="none" stroke="#E85C33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M0 35 C 20 35, 30 25, 50 25 S 80 32, 100 32 V 50 H 0 Z" fill="url(#chartGradient)" />

                        {/* Points */}
                        <circle cx="50" cy="25" r="2" fill="white" stroke="#E85C33" strokeWidth="2" />
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
                  <div className="p-6 rounded-2xl bg-gradient-to-b from-white to-zinc-50/30 border border-zinc-200/60 shadow-sm min-h-[260px]">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-base font-bold text-zinc-900 tracking-tight">Recent Activity</h4>
                      <div className="w-6 h-6 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-all cursor-pointer"><ArrowRight size={12} className="-rotate-45" /></div>
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3].map((item, i) => (
                        <div key={i} className="flex gap-3 group cursor-pointer">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ring-4 ring-offset-0 ring-opacity-20 ${i === 0 ? 'bg-red-500 ring-red-500' : i === 1 ? 'bg-amber-500 ring-amber-500' : 'bg-red-500 ring-red-500'}`} />
                          <div>
                            <p className="text-xs font-bold text-zinc-800 line-clamp-2 leading-relaxed group-hover:text-zinc-900 transition-colors">"{i === 0 ? "Grosse déception au Le Grand Hôtel, le service était..." : i === 1 ? "Correct sans plus. Le petit déjeuner manquait de..." : "Honteux ! Il y avait des punaises dans le lit..."}"</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
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
                    <h4 className="text-sm font-bold text-zinc-900">Ratings over time</h4>
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
                  <h4 className="text-sm font-bold text-zinc-900 mb-6">Sentiment Analysis</h4>
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
              <span className="bg-[#E85C33] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
              <span className="text-sm font-medium text-zinc-600">See the product tour</span>
            </div>
          </div>
        </section>


        {/* FEATURE: AUTOMATE */}
        <section className="mb-32 px-4 md:px-6">
          <div className="max-w-6xl mx-auto bg-white rounded-3xl md:rounded-[3rem] p-6 md:p-16 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.08)] border border-zinc-100 overflow-visible relative">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

              {/* Left Column: Copy */}
              <div className="relative z-10 order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full pl-1 pr-3 py-1 mb-6">
                  <span className="bg-[#E85C33] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Auto-Pilot</span>
                  <span className="text-xs font-bold text-[#E85C33]">GPT-4o Integration</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-4 md:mb-6 leading-tight">Reputation management on Autopilot.</h3>
                <p className="text-base md:text-lg text-zinc-500 mb-6 md:mb-8 leading-relaxed">
                  Let AI handle the 80% of standard reviews with human-like accuracy. You just approve, and we publish. It's like having a full-time reputation manager, for free.
                </p>

                <div className="space-y-3 md:space-y-4 mb-8">
                  {[
                    "Replies generated in your brand voice",
                    "Multi-language support (Detects & Replies)",
                    "Smart escalation for negative reviews"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-[#E85C33] stroke-[3px]" />
                      </div>
                      <span className="text-sm md:text-base text-zinc-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full md:w-auto rounded-full bg-zinc-900 text-white hover:bg-zinc-800 h-12 px-6 text-base font-medium shadow-lg hover:shadow-xl transition-all">
                  Start automating now <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>

              {/* Right Column: Visual Demo */}
              <div className="relative order-1 lg:order-2 mb-8 lg:mb-0">
                {/* Decorative elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-orange-100/30 to-blue-50/30 rounded-full blur-3xl -z-10" />

                {/* Main Demo Card */}
                <div className="bg-white rounded-2xl md:rounded-[2rem] border border-zinc-200/60 shadow-2xl overflow-hidden relative">
                  {/* Header */}
                  <div className="bg-zinc-50/50 border-b border-zinc-100 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-lg border border-zinc-200 flex items-center justify-center text-[#E85C33]">
                        <Bot size={18} />
                      </div>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">AI Assistant Agent</span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6">
                    {/* User Review */}
                    <div className="bg-zinc-50 rounded-2xl p-4 mb-6 border border-zinc-100 relative">
                      <div className="absolute -left-2 top-6 w-2 h-4 bg-zinc-50 border-l border-b border-zinc-100 transform rotate-45" />
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><User size={12} /></div>
                          <span className="text-xs font-bold text-zinc-700">Sarah M.</span>
                        </div>
                        <div className="flex text-amber-400 gap-0.5">
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                        </div>
                      </div>
                      <p className="text-sm text-zinc-600 italic">"Absolutely loved the ambiance! The staff was incredibly friendly..."</p>
                    </div>

                    {/* AI Reply Simulation */}
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-[#E85C33] flex items-center gap-1"><Sparkles size={12} /> Generating Reply...</span>
                      </div>
                      <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100/50 min-h-[100px]">
                        <p className="text-sm text-zinc-700 leading-relaxed">
                          <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, ease: "linear" }}
                          >
                            Thank you so much Sarah! 🧡 We're thrilled to hear you enjoyed the ambiance and our coffee.
                          </motion.span>
                          <span className="inline-block w-1.5 h-4 bg-[#E85C33] ml-1 align-middle animate-pulse" />
                        </p>
                      </div>

                      {/* Floating Cursor Animation */}
                      <motion.div
                        className="absolute -bottom-8 -right-8 z-20 pointer-events-none hidden md:block"
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        whileInView={{ x: -140, y: -60, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      >
                        <div className="bg-[#E85C33] text-white px-3 py-1.5 rounded-full rounded-tl-none font-bold text-xs shadow-lg flex items-center gap-1">
                          <MousePointer2 size={12} className="-rotate-90" fill="currentColor" /> Auto-Reply
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 border-t border-zinc-100 bg-zinc-50/30 flex justify-end gap-2">
                    <div className="px-4 py-2 bg-white border border-zinc-200 text-zinc-400 rounded-lg text-xs font-bold uppercase tracking-wider">Edit</div>
                    <div className="px-4 py-2 bg-[#E85C33] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/20 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Published
                    </div>
                  </div>
                </div>

                {/* Floating Stat Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-6 right-4 md:right-auto md:-left-6 bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl border border-zinc-100 flex items-center gap-3 scale-90 md:scale-100 origin-bottom-right md:origin-center z-30"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Clock size={16} className="md:w-5 md:h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] md:text-xs text-zinc-500 font-bold uppercase">Time Saved</div>
                    <div className="text-sm md:text-lg font-bold text-zinc-900">12h / week</div>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </section>


        {/* BANNER 1 - DARK PREMIUM CTA */}
        <section className="px-6 mb-32">
          <div className="max-w-5xl mx-auto bg-zinc-900 rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden group">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">How serious are you <br className="hidden md:block" /> about review management?</h3>
              <p className="text-zinc-400 mb-10 max-w-xl mx-auto text-lg font-medium leading-relaxed">
                Don't let a bad review sit unanswered for days. In the reputation game, speed is everything.
              </p>
              <Link href="/login">
                <Button className="rounded-full bg-white text-zinc-900 hover:bg-zinc-100 px-10 h-14 text-lg shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] font-bold transition-all hover:scale-105">
                  Take Control Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURE: ANALYTICS */}
        <section className="mb-32 px-6">
          <div className="max-w-6xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.08)] border border-zinc-100 overflow-hidden relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left Column: Copy */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full pl-1 pr-3 py-1">
                  <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Insights</span>
                  <span className="text-xs font-bold text-blue-600">Sentiment Analysis</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-zinc-900 leading-tight">Decode your guest feedback.</h3>
                <p className="text-lg text-zinc-500 leading-relaxed">
                  Is it the breakfast? The noise? The WiFi? Our AI reads between the lines of every review to tell you exactly what to fix to get that 5th star.
                </p>

                <div className="grid gap-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                      <Search size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg">Keyword Tracking</h4>
                      <p className="text-zinc-500 text-sm">Monitor specific terms like "Cleanliness" or "Staff" over time.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-[#E85C33]">
                      <BarChart3 size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg">Competitor Benchmarking</h4>
                      <p className="text-zinc-500 text-sm">See how your "Breakfast" score compares to the hotel next door.</p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="rounded-full border-zinc-200 text-zinc-900 hover:bg-zinc-50 px-8 h-12 font-bold shadow-sm">
                  Explore Insights
                </Button>
              </div>

              {/* Right Column: Visual Demo */}
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-bl from-blue-50/50 to-orange-50/50 rounded-full blur-3xl -z-10" />

                <div className="bg-white rounded-[2rem] border border-zinc-200/60 shadow-2xl p-6 md:p-8 relative">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="text-xl font-bold text-zinc-900">Keyword Insights</h4>
                      <p className="text-sm text-zinc-500">Impact on Global Rating</p>
                    </div>
                    <div className="bg-zinc-100 p-1 rounded-lg flex text-xs font-bold text-zinc-500">
                      <span className="bg-white text-zinc-900 shadow-sm px-3 py-1 rounded-md">Positive</span>
                      <span className="px-3 py-1 hover:text-zinc-700 cursor-pointer">Negative</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Keyword 1: Coffee */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-zinc-100 rounded-lg text-zinc-500"><Coffee size={14} /></div>
                          <span className="font-bold text-zinc-700">Coffee</span>
                        </div>
                        <span className="text-emerald-600 font-bold text-sm">+4.8 Impact</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "92%" }}
                          transition={{ duration: 1, delay: 0 }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Keyword 2: Staff */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-zinc-100 rounded-lg text-zinc-500"><User size={14} /></div>
                          <span className="font-bold text-zinc-700">Staff Friendliness</span>
                        </div>
                        <span className="text-emerald-600 font-bold text-sm">+3.2 Impact</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "75%" }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Keyword 3: WiFi */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-zinc-100 rounded-lg text-zinc-500"><Wifi size={14} /></div>
                          <span className="font-bold text-zinc-700">WiFi Connection</span>
                        </div>
                        <span className="text-red-500 font-bold text-sm">-2.1 Impact</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "45%" }}
                          transition={{ duration: 1, delay: 0.4 }}
                          className="h-full bg-red-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Alert Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3"
                  >
                    <div className="p-2 bg-white rounded-full text-red-500 shadow-sm h-fit"><TrendingUp size={16} /></div>
                    <div>
                      <h5 className="font-bold text-red-900 text-sm">Critical Alert</h5>
                      <p className="text-xs text-red-700 mt-0.5">WiFi complaints have increased by 15% this week.</p>
                    </div>
                  </motion.div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="mb-40 px-6">
          <div className="max-w-7xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6">Turn happy customers into <br /> more customers.</h2>
          </div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="I used to spend 2 hours a day on reviews. Now I spend 10 minutes. The ROI is immediate."
              author="Marc Dubois"
              role="Owner, Le Petit Bistro"
              image="https://i.pravatar.cc/150?u=1"
            />
            <TestimonialCard
              quote="Reput.ai caught a 1-star review about a cold room 5 minutes after it was posted. We fixed it before the guest checked out."
              author="Sarah Jenkins"
              role="GM, Horizon Hotel"
              image="https://i.pravatar.cc/150?u=2"
              highlight
            />
            <TestimonialCard
              quote="The 'Draft Response' feature is magic. It sounds exactly like me, but without the typos."
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
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight">Ready to take control?</h2>
              <p className="text-xl text-zinc-400 max-w-xl mx-auto">Join 2,000+ businesses growing with Reput.ai today. No credit card required.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login?intent=demo" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto rounded-full bg-[#E85C33] hover:bg-[#D54D26] text-white px-10 h-16 text-lg font-bold shadow-2xl shadow-orange-500/20">
                    Book a Demo
                  </Button>
                </Link>
                <Link href="#demo" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto rounded-full border-zinc-700 text-white hover:bg-zinc-800 hover:text-white px-10 h-16 text-lg font-bold bg-transparent">
                    Talk to Sales
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-zinc-600 font-medium uppercase tracking-widest">Cancel anytime • Instant setup</p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="max-w-7xl mx-auto px-6 pt-10 pb-20 border-t border-zinc-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">R</div>
              <span className="font-bold text-zinc-900">Reput.ai</span>
            </div>

            <div className="flex gap-8 text-sm font-semibold text-zinc-500">
              <a href="#" className="hover:text-zinc-900 transition-colors">Features</a>
              <a href="#" className="hover:text-zinc-900 transition-colors">Pricing</a>
              <a href="#" className="hover:text-zinc-900 transition-colors">Blog</a>
              <a href="#" className="hover:text-zinc-900 transition-colors">Careers</a>
              <a href="#" className="hover:text-zinc-900 transition-colors">Contact</a>
            </div>

            <div className="text-zinc-400 text-sm font-medium">
              © 2025 Reput.ai Inc.
            </div>
          </div>
        </footer>

      </main>
    </div>
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
