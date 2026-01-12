import type { Metadata } from "next"
import { Outfit, Playfair_Display } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import AppShell from "@/components/app-shell"
import { Providers } from "@/components/providers"

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
})

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
})

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
            <body className={cn(outfit.variable, playfair.variable, "bg-[#FDFCF8] text-zinc-900 antialiased font-sans")}>
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
