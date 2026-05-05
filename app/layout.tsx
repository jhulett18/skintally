import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://skintally.vercel.app"),
  title: "Skintally — Prepaid Package Tracker for Med Spas",
  description: "Track every prepaid treatment package at your med spa. Auto-sends expiry reminder emails to clients at 30, 14, and 7 days before their sessions lapse.",
  keywords: "med spa package tracker, prepaid treatment sessions, expiry reminders, aesthetics practice management",
  authors: [{ name: "automationbyJT" }],
  openGraph: {
    title: "Skintally — Never Let a Package Expire Unnoticed",
    description: "Automatic reminder emails for prepaid treatment packages. Protect your client relationships and prevent refund disputes.",
    type: "website",
    url: "https://skintally.vercel.app",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Skintally" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skintally — Prepaid Package Tracker",
    description: "Auto-send expiry reminders to med spa clients at T-30, T-14, T-7.",
    images: ["/og.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a1320" />
      </head>
      <body>{children}</body>
    </html>
  )
}
