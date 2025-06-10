'use client'

import { Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { memo } from 'react'

export const Newsletter: React.FC = memo(() => {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Stay Updated with Bindass
          </h2>
          <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive deals, new arrivals, and limited edition drops from your favorite anime collections
          </p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-5 h-5" />
              <span>Subscribe</span>
            </motion.button>
          </motion.form>

          <p className="text-purple-200 text-sm mt-4">
            Join 50,000+ anime fashion enthusiasts. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
})