"use client"

import dynamic from 'next/dynamic'

const Gift = dynamic(() => import('lucide-react').then(mod => mod.Gift))
const Cake = dynamic(() => import('lucide-react').then(mod => mod.Cake))
const Heart = dynamic(() => import('lucide-react').then(mod => mod.Heart))
const PartyPopper = dynamic(() => import('lucide-react').then(mod => mod.PartyPopper))

import React, { useState, useEffect, JSX } from 'react'
import { lukesFont } from "../../fonts"
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import Link from 'next/link'

export default function DadBirthdayPage() {
    const [balloons, setBalloons] = useState<JSX.Element[]>([])
    const [windowDimensions, setWindowDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    })
    const [confettiRun, setConfettiRun] = useState(true)
    
    // Function to trigger confetti celebration
    const triggerConfetti = () => {
        setConfettiRun(true)
        // Set confetti to stop after 8 seconds
        setTimeout(() => {
            setConfettiRun(false)
        }, 8000)
    }
    
    useEffect(() => {
        // Handle window resize for confetti
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        
        // Add event listener
        window.addEventListener('resize', handleResize)
        
        // Create random balloons
        const colors = ['#FF5757', '#5CE1E6', '#FFDE59', '#7ED957', '#FF66C4']
        const newBalloons = []
        
        for (let i = 0; i < 20; i++) {
            const left = Math.random() * 100
            const delay = Math.random() * 5
            const color = colors[Math.floor(Math.random() * colors.length)]
            
            newBalloons.push(
                <div 
                    key={i} 
                    className="balloon"
                    style={{
                        left: `${left}%`,
                        animationDelay: `${delay}s`,
                        backgroundColor: color
                    }}
                />
            )
        }
        
        setBalloons(newBalloons)
        
        // Initial confetti trigger
        triggerConfetti()
        
        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-16 px-4">
            {/* Home button */}
            <div className="absolute top-4 left-4 z-20">
                <Link href="/">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium shadow-lg hover:bg-blue-50 transition-colors flex items-center"
                    >
                        ← Home
                    </motion.button>
                </Link>
            </div>
            
            {/* Add confetti component */}
            <Confetti
                width={windowDimensions.width}
                height={windowDimensions.height}
                numberOfPieces={confettiRun ? 200 : 0}
                recycle={false}
                colors={['#FF5757', '#5CE1E6', '#FFDE59', '#7ED957', '#FF66C4', '#FFA500', '#9C27B0']}
            />
            
            <style jsx>{`
                .balloon {
                    position: absolute;
                    bottom: -20px;
                    width: 30px;
                    height: 40px;
                    border-radius: 50%;
                    animation: float 15s ease-in-out infinite;
                    z-index: 0;
                }
                
                @keyframes float {
                    0% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-40vh) rotate(10deg); }
                    100% { transform: translateY(-80vh) rotate(-5deg); }
                }
            `}</style>
            
            <div className="relative z-10 max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="relative">
                    {balloons}
                </div>
                <div className="py-12 px-8 text-center">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <PartyPopper className="w-20 h-20 mx-auto text-yellow-500" />
                        <h1 className="mt-6 text-5xl font-bold text-blue-600">Happy Birthday, Dad!</h1>
                        
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="mt-8 space-y-6"
                        >
                            <p className="text-xl text-gray-700 italic">
                                "To the world's greatest dad, who taught me everything I know (especially about ChatGPT)."
                            </p>
                            
                            <div className="flex items-center justify-center space-x-8 py-6">
                                <Cake className="w-12 h-12 text-pink-500" />
                                <Heart className="w-12 h-12 text-red-500" />
                                <Gift className="w-12 h-12 text-blue-500" />
                            </div>

                            <motion.div 
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="mt-10"
                        >
                            <h2 className="text-2xl font-semibold mb-6 text-blue-700">Memories</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1.2 }}
                                    className="overflow-hidden rounded-lg flex items-center justify-center"
                                >
                                    <img 
                                        src="/images/dadbday1.jpg" 
                                        alt="Dad birthday memory 1" 
                                        className="w-full h-auto object-contain"
                                    />
                                </motion.div>
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1.4 }}
                                    className="overflow-hidden rounded-lg shadow-md"
                                >
                                    <img 
                                        src="/images/dadbday2.jpg" 
                                        alt="Dad birthday memory 2" 
                                        className="w-full h-auto object-cover"
                                    />
                                </motion.div>
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1.6 }}
                                    className="overflow-hidden rounded-lg shadow-md"
                                >
                                    <img 
                                        src="/images/dadbday3.jpg" 
                                        alt="Dad birthday memory 3" 
                                        className="w-full h-auto object-cover"
                                    />
                                </motion.div>
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1.8 }}
                                    className="overflow-hidden rounded-lg shadow-md"
                                >
                                    <img 
                                        src="/images/dadbday4.jpg" 
                                        alt="Dad birthday memory 4" 
                                        className="w-full h-auto object-cover"
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                            
                            <div className="bg-blue-50 p-8 rounded-lg">
                                <h2 className="text-2xl font-semibold mb-4 text-blue-700">Dear Dad,</h2>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    I thought it would be a fun idea to add a little surprise to your birthday this year.
                                    I hope you enjoy this little digital celebration! 🎉 Thank you so much for being there for me
                                    and supporting me in life and everything that I do. I'm so grateful to have you as my dad.
                                    I appriciate all of the small things you do for me, and I hope you have a wonderful birthday
                                    (don't celebrate too hard! 😅). Have a fantastic birthday dad! Love you the most :)
                                </p>
                                <p className="mt-4 text-gray-700 font-medium text-lg">
                                    Wishing you the happiest of birthdays!
                                </p>
                                <p className={`mt-4 text-gray-700 text-2xl ${lukesFont.className}`}>
                                    Sincerely, Luke Brevoort
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}