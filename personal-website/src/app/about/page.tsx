"use client"

import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-6">About Me</h1>
        {/* Add your content here */}
      </motion.div>
    </div>
  )
}