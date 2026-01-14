"use client"

import { ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DailyStats } from "@/actions/analytics"

interface SentimentEvolutionProps {
    data: DailyStats[]
}

export function SentimentEvolutionChart({ data }: SentimentEvolutionProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="col-span-4 shadow-sm border-zinc-100">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-zinc-900">Évolution du Sentiment</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-zinc-400">
                    Aucune donnée disponible
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-4 lg:col-span-3 shadow-sm border-zinc-100 overflow-hidden relative">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-zinc-900">Évolution de la Réputation</CardTitle>
                <p className="text-sm text-zinc-500">Suivi quotidien des avis positifs et négatifs</p>
            </CardHeader>
            <CardContent className="pl-0">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: "#71717a" }}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return `${date.getDate()}/${date.getMonth() + 1}`
                                }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: "#71717a" }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                            />
                            <Area
                                type="monotone"
                                dataKey="positive"
                                stroke="#22c55e"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorPos)"
                                name="Positifs"
                            />
                            <Area
                                type="monotone"
                                dataKey="negative"
                                stroke="#ef4444"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorNeg)"
                                name="Négatifs"
                            />
                            <Area
                                type="monotone"
                                dataKey="critical"
                                stroke="#dc2626"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                                fillOpacity={0}
                                name="Critiques"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
