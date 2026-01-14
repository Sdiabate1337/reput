"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function DateRangePicker() {
    return (
        <div className="flex items-center gap-2">
            <Select defaultValue="30">
                <SelectTrigger className="w-[180px] bg-white border-zinc-200">
                    <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="7">7 derniers jours</SelectItem>
                    <SelectItem value="30">30 derniers jours</SelectItem>
                    <SelectItem value="90">3 derniers mois</SelectItem>
                    <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
