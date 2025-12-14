"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Check, Star, Shield, Zap, BarChart3, Globe, MessageSquare, Menu, X, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans selection:bg-indigo-500/30 overflow-hidden">
      {/* GLOBAL BACKGROUND NOISE */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] bg-noise mix-blend-overlay"></div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:py-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl px-4 py-3 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-black font-bold shadow-sm">
                <span className="text-sm">R</span>
              </div>
              <span className="font-bold text-lg tracking-tight">Reput.ai</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Pricing</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">Log in</Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-lg shadow-zinc-900/20 dark:shadow-white/20">Start Free</Button>
              </Link>
            </div>

            <button className="md:hidden p-2 text-zinc-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xl flex flex-col gap-4 md:hidden">
              <a href="#features" className="text-sm font-medium px-2 py-1" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#pricing" className="text-sm font-medium px-2 py-1" onClick={() => setIsMenuOpen(false)}>Pricing</a>
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-zinc-900 text-white">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">
        {/* HERO SECTION */}
        <section className="px-4 mb-24 md:mb-32 relative">
          <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
              AI Auto-Response 2.0 is live
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-8xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              Reputation <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500">on Autopilot.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              The all-in-one command center for your reviews. Monitor, analyze, and reply in seconds with AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="h-14 px-8 w-full sm:w-auto text-base bg-zinc-900 text-white hover:bg-zinc-800 hover:scale-105 transition-all duration-200 dark:bg-white dark:text-black rounded-full shadow-xl shadow-indigo-500/10">
                  Start Free Trial <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="#demo" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="h-14 px-8 w-full sm:w-auto text-base bg-white dark:bg-zinc-900 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 rounded-full">
                  View Live Demo
                </Button>
              </Link>
            </motion.div>

            {/* HIGH FIDELITY DASHBOARD MOCK */}
            <motion.div
              style={{ opacity, scale }}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, type: "spring" }}
              className="relative mt-24 mx-auto max-w-6xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-transparent to-transparent z-20 dark:from-black h-full w-full pointer-events-none" />

              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_80px_-15px_rgba(255,255,255,0.05)] overflow-hidden p-2 ring-1 ring-black/5">
                {/* Mock Window Header */}
                <div className="h-10 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 flex items-center px-4 gap-2 rounded-t-xl mb-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="mx-auto w-64 h-6 bg-zinc-100 dark:bg-zinc-800 rounded-md flex items-center justify-center text-[10px] text-zinc-400 font-medium">reput.ai/dashboard</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] h-[600px] bg-zinc-50/50 dark:bg-zinc-950">
                  {/* Mock Sidebar */}
                  <div className="hidden md:flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 gap-4">
                    <div className="h-8 w-32 bg-zinc-200/50 dark:bg-zinc-800 rounded-md animate-pulse" />
                    <div className="space-y-2 mt-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-9 w-full bg-white dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 shadow-sm opacity-60" />
                      ))}
                      <div className="h-9 w-full bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-md flex items-center px-3 gap-3">
                        <div className="w-4 h-4 bg-indigo-500 rounded" />
                        <div className="w-20 h-2 bg-zinc-200 dark:bg-zinc-700 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Mock Content */}
                  <div className="p-6 md:p-8 overflow-hidden relative">
                    <div className="flex items-center justify-between mb-8">
                      <div className="space-y-2">
                        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                        <div className="h-4 w-64 bg-zinc-100 dark:bg-zinc-800/50 rounded" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-10 w-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm" />
                        <div className="h-10 w-32 rounded-lg bg-zinc-900 dark:bg-white shadow-lg" />
                      </div>
                    </div>

                    <div className="grid gap-6">
                      {/* Mock Review Card 1 */}
                      <MockReviewCard
                        author="Sarah Miller"
                        rating={5}
                        source="G"
                        content="Absolutely unified my workflow. The AI responses are surprisingly human. Highly recommend for any business owner."
                        sentiment="positive"
                      />
                      {/* Mock Review Card 2 */}
                      <MockReviewCard
                        author="David Chen"
                        rating={4}
                        source="B"
                        content="Great tool, saved me hours this week alone. Would love to see more integration options soon."
                        sentiment="neutral"
                      />
                    </div>

                    {/* Fade out bottom of mock */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="py-20 border-y border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-zinc-400 mb-10 uppercase tracking-widest">Trusted by 2,000+ businesses worldwide</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for logos */}
              {['Acme Corp', 'Global Stay', 'RestoBar', 'TravelWise', 'RateMaster'].map((logo, i) => (
                <span key={i} className="text-2xl font-bold font-serif text-zinc-600 dark:text-zinc-400">{logo}</span>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES BENTO GRID */}
        <section id="features" className="py-32 px-4 bg-zinc-50/50 dark:bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-white">Everything you need to master your reputation.</h2>
              <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed">Stop manually checking 5 different sites. Reput.ai brings everything into one command center.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={Globe}
                title="Unified Inbox"
                description="Connect Google, Booking, TripAdvisor and more. See every review in one feed."
                className="md:col-span-2 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-900/50"
              />
              <FeatureCard
                icon={Zap}
                title="AI Auto-Reply"
                description="Let AI draft personalized, professional responses in your brand voice. Approve with one click."
                className="bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30"
              />
              <FeatureCard
                icon={BarChart3}
                title="Sentiment Analytics"
                description="Understand your customers. Track sentiment trends and catch issues before they escalate."
              />
              <FeatureCard
                icon={Shield}
                title="Negative Guard"
                description="Get instant alerts for 1-star reviews so you can recover the customer immediately."
              />
              <FeatureCard
                icon={MessageSquare}
                title="Smart Templates"
                description="Save your best responses and reuse them. Consistency is key to trust."
                className="md:col-span-1"
              />
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Simple, transparent pricing.</h2>
              <p className="text-xl text-zinc-500 dark:text-zinc-400">Start for free, upgrade as you grow.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
              <PricingCard
                title="Starter"
                price="$0"
                description="Perfect for small businesses just starting out."
                features={['1 Location', '100 reviews/mo', 'Basic Analytics', 'Manual Replies']}
                buttonText="Start Free"
              />
              <PricingCard
                title="Pro"
                price="$49"
                popular
                description="Automate your growth with AI powers."
                features={['5 Locations', 'Unlimited reviews', 'AI Auto-Response', 'Advanced Sentiment', 'Priority Support']}
                buttonText="Start Pro Trial"
              />
              <PricingCard
                title="Agency"
                price="$199"
                description="Manage reputation at scale."
                features={['Unlimited Locations', 'Team Roles', 'White Label Reports', 'API Access', 'Dedicated Manager']}
                buttonText="Contact Sales"
              />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-xs">
                R
              </div>
              <span className="font-bold text-sm">Reput.ai</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Privacy</a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Terms</a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Twitter</a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">LinkedIn</a>
            </div>
            <p className="text-xs text-zinc-400">© 2024 Reput.ai Inc.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}

// --- COMPONENTS WITH REFINED UI ---

function FeatureCard({ icon: Icon, title, description, className }: any) {
  return (
    <div className={cn(
      "p-8 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] transition-all duration-300 group overflow-hidden relative",
      className
    )}>
      <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none mix-blend-soft-light" />

      <div className="relative z-10">
        <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
          <Icon size={22} className="stroke-[1.5]" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-50 tracking-tight">{title}</h3>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  )
}

function PricingCard({ title, price, description, features, buttonText, popular }: any) {
  return (
    <div className={cn(
      "p-8 rounded-3xl border flex flex-col relative bg-white dark:bg-zinc-900 transition-all duration-300",
      popular
        ? "border-indigo-500 ring-4 ring-indigo-500/10 shadow-2xl scale-100 md:scale-105 z-10"
        : "border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl opacity-90 hover:opacity-100"
    )}>
      {/* Background Noise for Cards */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none mix-blend-soft-light rounded-3xl" />

      {popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-full shadow-lg ring-4 ring-white dark:ring-zinc-950">
          Most Popular
        </div>
      )}

      <div className="mb-8 relative z-10">
        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{title}</h3>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{price}</span>
          <span className="text-sm font-medium text-zinc-500">/month</span>
        </div>
        <p className="text-sm text-zinc-500 mt-4 leading-relaxed font-medium">{description}</p>
      </div>

      <ul className="space-y-4 mb-8 flex-1 relative z-10">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <div className="h-5 w-5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
              <Check size={12} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            {feature}
          </li>
        ))}
      </ul>

      <Link href="/login" className="w-full relative z-10">
        <Button className={cn(
          "w-full h-12 rounded-xl text-sm font-semibold shadow-sm transition-all",
          popular
            ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
            : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
        )}>
          {buttonText}
        </Button>
      </Link>
    </div>
  )
}

function MockReviewCard({ author, rating, source, content, sentiment }: any) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-zinc-950/5 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none mix-blend-soft-light" />
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full opacity-60",
        sentiment === 'positive' ? "bg-emerald-500" : "bg-zinc-300"
      )} />

      <div className="flex justify-between items-start mb-3 pl-2">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-500">
            {author.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">{author}</div>
            <div className="flex text-amber-400 text-[10px] gap-0.5 mt-0.5">
              {[...Array(rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
            </div>
          </div>
        </div>
        <div className="h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
          {source}
        </div>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pl-2 relative z-10">
        "{content}"
      </p>

      <div className="mt-4 pl-2 flex items-center gap-2 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-7 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center gap-2 cursor-pointer">
          <Zap size={12} /> Generate Reply
        </div>
      </div>
    </div>
  )
}
