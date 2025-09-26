import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "./providers"
import { Toaster } from "@/components/ui/sonner"
import { FaviconInjector } from "@/components/favicon-generator"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Fenix - Secure Crypto Wallet",
  description: "Send, receive, and manage your USDT with bank-grade security powered by Privy.",
  keywords: "crypto wallet, USDT, blockchain, Web3, DeFi, secure wallet",
  authors: [{ name: "Fenix Team" }],
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://fenix-wallet.vercel.app"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fenix Wallet"
  },
  openGraph: {
    title: "Fenix Wallet - Secure Crypto Wallet",
    description: "Your secure gateway to Web3 with enterprise-grade security",
    type: "website",
    siteName: "Fenix Wallet",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fenix Wallet - Secure Crypto Wallet"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Fenix Wallet",
    description: "Your secure gateway to Web3",
    images: ["/og-image.png"]
  },
  icons: {
    icon: [
      { url: "/fenix-logo.png", sizes: "16x16", type: "image/png" },
      { url: "/fenix-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/fenix-logo.png", sizes: "any" }
    ],
    apple: [
      { url: "/fenix-logo.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { rel: "mask-icon", url: "/fenix-logo.png", color: "#ea580c" }
    ]
  }
}

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ea580c" },
      { media: "(prefers-color-scheme: dark)", color: "#fb923c" }
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <FaviconInjector />
        <Providers>{children}</Providers>
        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={4000}
          theme="system"
        />
      </body>
    </html>
  )
}
