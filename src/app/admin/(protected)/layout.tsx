
import Link from "next/link"
import { Shield } from "lucide-react"
import { getAdminStatus } from "@/actions/admin-auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const isAdmin = await getAdminStatus()
    if (!isAdmin) {
        redirect('/admin/login')
    }

    return (
        <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
            <header className="bg-white border-b border-zinc-200 h-16 flex items-center px-8 justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2 font-bold text-lg">
                    <Shield className="text-red-600" />
                    <span>Admin Gateway</span>
                </div>
                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link href="/admin/users" className="hover:text-red-600 transition-colors">Users</Link>
                    <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-600">Retour App</Link>
                </div>
            </header>
            <main className="p-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    )
}
