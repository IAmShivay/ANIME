'use client'

import { motion } from 'framer-motion'
import { Newspaper, Download, Mail, Calendar } from 'lucide-react'
import { Navbar } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function PressPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Press &{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                  Media
                </span>
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                Get the latest news, press releases, and media resources about AnimeScience. 
                We're always happy to share our story with the media.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Newspaper className="w-24 h-24 text-purple-600 mx-auto mb-8" />
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Press Kit Coming Soon</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                We're currently preparing our comprehensive press kit with logos, product images, 
                company information, and press releases. Check back soon!
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mt-16">
                {[
                  { 
                    icon: Download, 
                    title: 'Media Kit', 
                    desc: 'High-resolution logos, product images, and brand guidelines' 
                  },
                  { 
                    icon: Calendar, 
                    title: 'Press Releases', 
                    desc: 'Latest company news and product announcements' 
                  },
                  { 
                    icon: Mail, 
                    title: 'Media Contact', 
                    desc: 'Direct line to our press and media relations team' 
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center p-6 bg-gray-50 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 space-y-4">
                <p className="text-lg font-semibold text-gray-900">For immediate press inquiries:</p>
                <motion.a
                  href="mailto:press@animescience.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  press@animescience.com
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Facts */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Facts</h2>
              <p className="text-gray-600">Key information about AnimeScience</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Founded', value: '2020' },
                { label: 'Products', value: '500+' },
                { label: 'Customers', value: '25K+' },
                { label: 'Countries', value: '50+' },
              ].map((fact, index) => (
                <motion.div
                  key={fact.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center bg-white p-6 rounded-lg shadow"
                >
                  <div className="text-3xl font-bold text-purple-600 mb-2">{fact.value}</div>
                  <div className="text-gray-600">{fact.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
