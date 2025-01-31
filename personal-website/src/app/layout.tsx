import type { Metadata } from "next"
import { geistSans, geistMono, lukesFont } from "./fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: "luke.brev",
  description: "Luke Brevoort's personal website",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lukesFont.className}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
}