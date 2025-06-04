"use client"

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <div className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/videos/anime-character-animation-8031527" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/90 via-indigo-900/80 to-purple-900/90" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 relative inline-block"
          >
            <Sparkles className="absolute -top-6 -left-6 w-8 h-8 text-yellow-400 animate-pulse" />
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
              Anime Universe
            </h1>
            <div className="text-3xl md:text-4xl font-bold text-indigo-200">
              Where Fantasy Meets Fashion
            </div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 text-xl max-w-3xl mx-auto text-indigo-100"
          >
            Step into a world where your favorite anime comes to life through our exclusive 
            collection of premium merchandise. From iconic series to limited editions, 
            express your passion with style.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
            >
              Explore Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-md border-2 border-white/20 text-white hover:bg-white/20"
            >
              View Limited Editions
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}