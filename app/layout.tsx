import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "./providers"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Fenix - Secure Crypto Wallet",
  description: "Send, receive, and manage your USDT with bank-grade security powered by Privy.",
  keywords: "crypto wallet, USDT, blockchain, Web3, DeFi",
  authors: [{ name: "Fenix Team" }],
  openGraph: {
    title: "Fenix Wallet",
    description: "Your secure gateway to Web3",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
