import React from "react"
import type { Metadata } from "next"
import { Syne, DM_Sans, Space_Mono } from "next/font/google"

import "./globals.css"

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
})

export const metadata: Metadata = {
  title: "Zikora - DeFi at Your Command",
  description:
    "Connect your wallet, type what you want, and Zikora executes. The DeFi chatbot on BNB Chain for swaps, staking, lending, and more.",
}

export const viewport = {
  themeColor: "#12121A",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
