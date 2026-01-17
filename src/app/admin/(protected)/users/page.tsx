
import { getAllEstablishments } from "@/actions/admin"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {

    // Server-side fetch (Protected by check in action)
    const result = await getAllEstablishments()

    if (!result.success) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="p-4 bg-red-50 text-red-600 rounded-full">
                    <AlertCircle size={48} />
                </div>
                <h1 className="text-2xl font-bold">Accès Refusé</h1>
                <p className="text-zinc-500">{result.error}</p>
            </div>
        )
    }

    const establishments = result.data || []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
                    <p className="text-zinc-500 mt-1">Vue d'ensemble des établissements inscrits ({establishments.length})</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des Établissements</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Nom (Admin)</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Trial Fin</TableHead>
                                <TableHead>Quota</TableHead>
                                <TableHead className="text-right">Créé le</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {establishments.map((est) => (
                                <TableRow key={est.id}>
                                    <TableCell className="font-mono text-xs text-zinc-500">
                                        {est.id.slice(0, 8)}...
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{est.name}</span>
                                            {est.admin_phone && <span className="text-xs text-zinc-400">{est.admin_phone}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-zinc-600">
                                        {est.user_email}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={est.plan === 'pro' || est.plan === 'enterprise' ? 'default' : 'secondary'} className={est.plan === 'pro' ? 'bg-[#E85C33]' : ''}>
                                            {est.plan.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {est.subscription_status === 'ACTIVE' && <CheckCircle2 size={16} className="text-green-500" />}
                                            <span className="text-sm">{est.subscription_status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {est.trial_ends_at ? (
                                            <span className="text-xs text-zinc-500">
                                                {formatDistanceToNow(new Date(est.trial_ends_at), { addSuffix: true, locale: fr })}
                                            </span>
                                        ) : (
                                            <span className="text-zinc-300">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-zinc-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-zinc-900"
                                                    style={{ width: `${Math.min((est.outbound_quota_used / est.outbound_quota_limit) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-zinc-500">{est.outbound_quota_used}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-xs text-zinc-400">
                                        {new Date(est.created_at).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
