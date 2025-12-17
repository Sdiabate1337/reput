import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import AppShell from "@/components/app-shell"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Reput.ai | AI Review Management & Automation Platform",
    description: "Automate 80% of your customer reviews with AI. Monitor Google, TripAdvisor, and Booking.com in one dashboard. Boost your local ranking today.",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={cn(inter.className, "bg-[#FDFCF8] text-zinc-900 antialiased")}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "SoftwareApplication",
                            "name": "Reput.ai",
                            "applicationCategory": "BusinessApplication",
                            "operatingSystem": "Web",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            },
                            "description": "AI-powered reputation management and review automation platform."
                        })
                    }}
                />
                <Providers>
                    <AppShell>{children}</AppShell>
                </Providers>
            </body>
        </html>
    )
}
