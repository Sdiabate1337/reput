"use client"

import { useState } from "react"
import { Shield, Lock, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { adminLogin, registerAdmin } from "@/actions/admin-auth"

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [isRegistering, setIsRegistering] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)

        try {
            // Pick Action based on mode
            const action = isRegistering ? registerAdmin : adminLogin
            const result = await action(formData)

            if (result.success) {
                router.push('/admin/users')
            } else {
                if (result.error === 'ADMIN_NOT_REGISTERED') {
                    setIsRegistering(true)
                    setError(null)
                } else {
                    setError(result.error || "Erreur de connexion")
                }
            }
        } catch (err) {
            setError("Une erreur est survenue")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-6 text-zinc-50">
            <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center justify-center mb-4">
                        <Shield size={24} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isRegistering ? 'Activer Compte Admin' : 'Admin Gateway'}
                    </h1>
                    <p className="text-zinc-500 text-sm mt-2 text-center">
                        {isRegistering
                            ? "Votre email est autorisé. Définissez votre mot de passe."
                            : "Accès restreint au personnel autorisé"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@reput.ai"
                                className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none placeholder:text-zinc-600 text-sm"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none placeholder:text-zinc-600 text-sm"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium h-11"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <>{isRegistering ? 'Activer le compte' : 'Connexion'} <ArrowRight size={16} className="ml-2" /></>}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-zinc-600 font-mono">
                        SECURE LOGGING ENABLED<br />
                        IP ::1 (Local)
                    </p>
                </div>
            </div>
        </div>
    )
}
