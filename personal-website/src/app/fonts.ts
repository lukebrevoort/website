"use client"

import { Geist, Geist_Mono } from "next/font/google"
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