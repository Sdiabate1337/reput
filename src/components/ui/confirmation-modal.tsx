"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = 'danger'
}: ConfirmationModalProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!mounted) return null

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[9999]"
                    />

                    {/* MODAL */}
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-sm rounded-2xl shadow-2xl p-6 pointer-events-auto m-4 relative overflow-hidden"
                        >
                            {/* Texture */}
                            <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none mix-blend-soft-light" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className={cn(
                                    "h-12 w-12 rounded-full flex items-center justify-center mb-4 shadow-sm",
                                    variant === 'danger' ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" :
                                        variant === 'warning' ? "bg-amber-50 text-amber-600" : "bg-zinc-100 text-zinc-900"
                                )}>
                                    <AlertTriangle size={24} />
                                </div>

                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2 tracking-tight">
                                    {title}
                                </h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                                    {description}
                                </p>

                                <div className="flex gap-3 w-full">
                                    <Button
                                        variant="outline"
                                        onClick={onClose}
                                        className="flex-1 h-11 rounded-xl border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                    >
                                        {cancelText}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            onConfirm()
                                            onClose() // Ensure close on confirm
                                        }}
                                        className={cn(
                                            "flex-1 h-11 rounded-xl text-white shadow-lg shadow-red-500/20",
                                            variant === 'danger' ? "bg-red-600 hover:bg-red-700" : "bg-zinc-900 dark:bg-white dark:text-black"
                                        )}
                                    >
                                        {confirmText}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    )
}
