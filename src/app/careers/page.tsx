'use client'

import { motion } from 'framer-motion'
import { Briefcase, Users, Heart, Zap } from 'lucide-react'
import { Navbar } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function CareersPage() {
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
                Join Our{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                  Team
                </span>
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                Be part of a passionate team that's revolutionizing anime fashion. 
                We're always looking for talented individuals who share our vision.
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
              <Briefcase className="w-24 h-24 text-purple-600 mx-auto mb-8" />
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Careers Page Coming Soon</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                We're currently building our careers page. In the meantime, feel free to reach out to us 
                directly if you're interested in joining our team!
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                {[
                  { icon: Users, title: 'Collaborative', desc: 'Work with passionate team members' },
                  { icon: Heart, title: 'Passionate', desc: 'Love for anime and fashion' },
                  { icon: Zap, title: 'Innovative', desc: 'Push creative boundaries' },
                  { icon: Briefcase, title: 'Growth', desc: 'Opportunities to advance' },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center p-6"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12">
                <motion.a
                  href="mailto:careers@animescience.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  Contact Us About Opportunities
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
