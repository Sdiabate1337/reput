"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, ThumbsUp, MessageCircle, AlertCircle } from "lucide-react"

interface AnalyticsKPIProps {
    metrics: {
        responseRate: number
        averageSentiment: number
        totalVolume: number
        negativeCount: number
        avgResponseTime?: number | null
    }
}

export function AnalyticsKPI({ metrics }: AnalyticsKPIProps) {
    const hasData = metrics.totalVolume > 0

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white border-zinc-100 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                        <MessageCircle size={16} />
                        Total Avis
                    </div>
                    <div className="text-2xl font-bold text-zinc-900">
                        {metrics.totalVolume}
                    </div>
                    {hasData && <p className="text-xs text-zinc-400 font-medium">Sur la période</p>}
                </CardContent>
            </Card>

            <Card className="bg-white border-zinc-100 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                        <ThumbsUp size={16} />
                        Score Satisfaction
                    </div>
                    <div className="text-2xl font-bold text-zinc-900">
                        {hasData ? metrics.averageSentiment : "-"}<span className="text-lg text-zinc-400 font-normal">/100</span>
                    </div>
                    <div className="w-full bg-zinc-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${metrics.averageSentiment >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`}
                            style={{ width: `${hasData ? metrics.averageSentiment : 0}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white border-zinc-100 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                        <AlertCircle size={16} className="text-red-500" />
                        Avis Négatifs
                    </div>
                    <div className="text-2xl font-bold text-zinc-900">
                        {hasData ? metrics.negativeCount : "-"}
                    </div>
                    {hasData && <p className="text-xs text-red-600 font-medium">Critiques & Négatifs</p>}
                </CardContent>
            </Card>

            <Card className="bg-white border-zinc-100 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                        <AlertCircle size={16} />
                        Taux Récupération
                    </div>
                    <div className="text-2xl font-bold text-zinc-900">
                        {hasData ? `${metrics.responseRate}%` : "-"}
                    </div>
                    {hasData && <p className="text-xs text-zinc-400">Clients insatisfaits gérés</p>}
                </CardContent>
            </Card>
        </div>
    )
}
