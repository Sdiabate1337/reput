import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import AppShell from "@/components/app-shell"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Reputation Cockpit",
    description: "Manage your reviews with AI",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={cn(inter.className, "bg-zinc-50 dark:bg-zinc-950 text-zinc-900 antialiased")}>
                {/* Background Texture Layer */}
                <div className="fixed inset-0 z-0 pointer-events-none dot-pattern dark:dot-pattern-dark opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

                <Providers>
                    <AppShell>{children}</AppShell>
                </Providers>
            </body>
        </html>
    )
}
