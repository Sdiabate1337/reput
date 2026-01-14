"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext<{
    value: string
    onValueChange: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
} | null>(null)

export function Select({
    defaultValue,
    value: controlledValue,
    onValueChange,
    children,
}: {
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
}) {
    const [value, setValue] = React.useState(defaultValue || "")
    const [open, setOpen] = React.useState(false)

    const handleValueChange = (newValue: string) => {
        setValue(newValue)
        if (onValueChange) onValueChange(newValue)
    }

    return (
        <SelectContext.Provider value={{ value: controlledValue ?? value, onValueChange: handleValueChange, open, setOpen }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    )
}

export function SelectTrigger({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error("SelectTrigger must be used within Select")

    return (
        <button
            type="button"
            onClick={() => context.setOpen(!context.open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    )
}

export function SelectValue({
    placeholder,
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }) {
    const context = React.useContext(SelectContext)
    return (
        <span className={cn("block truncate", className)} {...props}>
            {context?.value ? (
                context.value === "7" ? "7 derniers jours" :
                    context.value === "30" ? "30 derniers jours" :
                        context.value === "90" ? "3 derniers mois" :
                            context.value === "year" ? "Cette année" :
                                context.value
            ) : (
                placeholder
            )}
        </span>
    )
}

export function SelectContent({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    const context = React.useContext(SelectContext)
    if (!context || !context.open) return null

    return (
        <div
            className={cn(
                "absolute top-full mt-1 z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white text-zinc-950 shadow-md animate-in fade-in-0 zoom-in-95",
                className
            )}
            {...props}
        >
            <div className="p-1">{children}</div>
        </div>
    )
}

export function SelectItem({
    value,
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
    const context = React.useContext(SelectContext)
    const isSelected = context?.value === value

    return (
        <div
            onClick={() => {
                context?.onValueChange(value)
                context?.setOpen(false)
            }}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-zinc-100 focus:bg-zinc-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer",
                className
            )}
            {...props}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {isSelected && <Check className="h-4 w-4" />}
            </span>
            <span className="block truncate">{children}</span>
        </div>
    )
}
