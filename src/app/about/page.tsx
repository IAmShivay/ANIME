'use client'

import { motion } from 'framer-motion'
import { Heart, Users, Award, Zap, Star, Target } from 'lucide-react'
import { Navbar } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import Image from 'next/image'

export default function AboutPage() {
  const stats = [
    { number: '500+', label: 'Unique Designs', icon: Star },
    { number: '25K+', label: 'Happy Customers', icon: Users },
    { number: '50+', label: 'Anime Series', icon: Heart },
    { number: '99%', label: 'Satisfaction Rate', icon: Award },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Passion for Anime',
      description: 'We live and breathe anime culture, bringing authentic designs that resonate with true fans.',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Every piece is crafted with the highest quality materials and attention to detail.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We build products for the community, by the community, fostering connections among fans.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Constantly pushing boundaries to create unique, cutting-edge anime fashion.',
    },
  ]

  const team = [
    {
      name: 'Akira Tanaka',
      role: 'Founder & Creative Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      bio: 'Anime enthusiast since childhood, bringing 15+ years of fashion design experience.',
    },
    {
      name: 'Sakura Yamamoto',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
      bio: 'Former manga artist turned fashion designer, specializing in character-inspired streetwear.',
    },
    {
      name: 'Hiroshi Nakamura',
      role: 'Quality Assurance',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      bio: 'Perfectionist with an eye for detail, ensuring every product meets our high standards.',
    },
  ]

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
                About{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                  Bindass
                </span>
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                Where passion for anime meets cutting-edge fashion. We're not just a clothing brand –
                we're a community of dreamers, creators, and fashion enthusiasts.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Founded in 2020 by a group of passionate anime fans, Bindass began as a small project
                    to create clothing that truly represented the anime community. We noticed a gap in the market 
                    for high-quality, authentic anime-inspired fashion that went beyond simple character prints.
                  </p>
                  <p>
                    Our mission was clear: to bridge the gap between anime culture and contemporary streetwear, 
                    creating pieces that fans could wear with pride in any setting. From our humble beginnings 
                    in a small studio, we've grown into a global brand serving anime enthusiasts worldwide.
                  </p>
                  <p>
                    Today, we continue to push the boundaries of anime fashion, collaborating with artists, 
                    designers, and the community to create unique pieces that celebrate the art and culture 
                    we all love.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative w-full h-96 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
                    alt="Our Story"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The principles that guide everything we do and every product we create.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The passionate individuals behind AnimeScience, dedicated to bringing you the best anime fashion.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
              <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
                Be part of a global community of fashion enthusiasts who share your passion for quality and authentic designs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Shop Collection
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
                >
                  Contact Us
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
