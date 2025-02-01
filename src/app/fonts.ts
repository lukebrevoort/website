"use client"

import { Geist, Geist_Mono, Berkshire_Swash, Crimson_Text } from "next/font/google"
import localFont from 'next/font/local'

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

export const berkshireSwash = Berkshire_Swash({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-berkshire',
    display: 'swap',
  })

export const crimsonText = Crimson_Text({
    weight: '600',
    subsets: ['latin'],
    variable: '--font-crimson',
    display: 'swap',
    })