
import { cn } from "@/lib/utils"
import { HelpCircle } from "lucide-react"

interface MessageEditorProps {
    label: string
    subLabel?: string
    value: string
    onChange: (val: string) => void
    variables?: string[]
    color?: 'default' | 'green' | 'orange' | 'red'
    icon?: React.ReactNode
    onFocus?: () => void
}

export function MessageEditor({ label, subLabel, value, onChange, variables = ['{{name}}'], color = 'default', icon, onFocus }: MessageEditorProps) {

    const insertVariable = (variable: string) => {
        const textArea = document.getElementById(`textarea-${label}`) as HTMLTextAreaElement
        if (textArea) {
            const start = textArea.selectionStart
            const end = textArea.selectionEnd
            const newValue = value.substring(0, start) + variable + value.substring(end)
            onChange(newValue)
            // Restore focus (optional, tricky with state updates)
        } else {
            onChange(value + " " + variable)
        }
    }

    const borderColor = {
        default: 'border-zinc-200 focus-within:ring-zinc-900/10',
        green: 'border-green-200 focus-within:ring-green-500/20 bg-green-50/30',
        orange: 'border-orange-200 focus-within:ring-orange-500/20 bg-orange-50/30',
        red: 'border-red-200 focus-within:ring-red-500/20 bg-red-50/30',
    }[color]

    return (
        <div
            className={cn(
                "rounded-2xl border p-4 transition-all duration-200",
                borderColor,
                "hover:shadow-sm"
            )}
            onFocus={onFocus}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {icon}
                    <div>
                        <label className="text-sm font-bold text-zinc-900 block">{label}</label>
                        {subLabel && <p className="text-[11px] text-zinc-500">{subLabel}</p>}
                    </div>
                </div>
            </div>

            <textarea
                id={`textarea-${label}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={4}
                placeholder="Votre message personnalisé..."
                className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 resize-none shadow-sm font-medium text-zinc-700 placeholder:text-zinc-300"
            />

            <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Variables :</span>
                {variables.map(v => (
                    <button
                        key={v}
                        type="button"
                        onClick={() => insertVariable(v)}
                        className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-[11px] font-mono rounded-md border border-zinc-200 transition-colors"
                    >
                        {v}
                    </button>
                ))}
            </div>
        </div>
    )
}
