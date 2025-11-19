"use client"

import { Geist, Geist_Mono, Crimson_Text } from "next/font/google"
import localFont from 'next/font/local'

// Remove berkshireSwash and its export
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const lukesFont = localFont({
  src: '../fonts/Luke Brevoort Regular Font.otf',
  display: 'swap',
})

export const crimsonText = Crimson_Text({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
})

export const satoshi = localFont({
  src: [
    {
      path: '../fonts/Satoshi-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/Satoshi-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../fonts/Satoshi-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../fonts/Satoshi-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
})
