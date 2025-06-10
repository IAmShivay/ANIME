'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ShoppingBag, Star, Sparkles, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { memo, useState, useEffect } from 'react'

export const Hero = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: "BINDASS",
      subtitle: "ANIME FASHION",
      description: "Discover premium streetwear inspired by your favorite anime characters.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1000&fit=crop",
      price: "₹2,499",
      originalPrice: "₹3,299",
      badge: "NEW ARRIVAL"
    },
    {
      id: 2,
      title: "BINDASS",
      subtitle: "ANIME FASHION",
      description: "Discover premium streetwear inspired by your favorite anime characters.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1000&fit=crop",
      price: "₹2,499",
      originalPrice: "₹3,299",
      badge: "NEW ARRIVAL"
    },
  {
      id: 3,
      title: "BINDASS",
      subtitle: "ANIME FASHION",
      description: "Discover premium streetwear inspired by your favorite anime characters.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1000&fit=crop",
      price: "₹2,499",
      originalPrice: "₹3,299",
      badge: "NEW ARRIVAL"
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-hidden flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
      </div>

      {/* Slider Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg transition-colors duration-300"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg transition-colors duration-300"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg' 
                : 'bg-white/60 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex items-center"
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[600px]">
                
                {/* Left Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-left space-y-8 py-8"
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium shadow-lg"
                  >
                    <Star className="w-4 h-4" />
                    <span>{slides[currentSlide].badge}</span>
                    <Sparkles className="w-4 h-4" />
                  </motion.div>

                  {/* Main Heading */}
                  <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                      <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="block text-gray-900"
                      >
                        {slides[currentSlide].title}
                      </motion.span>
                      <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
                      >
                        {slides[currentSlide].subtitle}
                      </motion.span>
                    </h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg"
                    >
                      {slides[currentSlide].description}
                    </motion.p>
                  </div>

                  {/* Price Display */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                      {slides[currentSlide].price}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      {slides[currentSlide].originalPrice}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-full">
                      SAVE {Math.round(((parseInt(slides[currentSlide].originalPrice.replace('₹', '').replace(',', '')) - parseInt(slides[currentSlide].price.replace('₹', '').replace(',', ''))) / parseInt(slides[currentSlide].originalPrice.replace('₹', '').replace(',', ''))) * 100)}%
                    </span>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="grid grid-cols-3 gap-4 py-4"
                  >
                    {[
                      { icon: Users, value: '50K+', label: 'Customers' },
                      { icon: ShoppingBag, value: '500+', label: 'Designs' },
                      { icon: Star, value: '4.9★', label: 'Rating' }
                    ].map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="flex justify-center mb-1">
                          <stat.icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Link href="/shop">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                      >
                        <span>Shop Collection</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>
                    
                    <Link href="/about">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                      >
                        Learn More
                      </motion.button>
                    </Link>
                  </motion.div>

                  {/* Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="flex flex-wrap gap-2 pt-4"
                  >
                    {['Free Shipping', 'Premium Quality', 'Limited Drops', 'Worldwide Delivery'].map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-sm rounded-full shadow-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Right Content - Product Showcase */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative hidden lg:flex lg:items-center lg:justify-center py-8"
                >
                  <div className="relative w-full max-w-md">
                    {/* Main Product Image */}
                    <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                      <Image
                        src={slides[currentSlide].image}
                        alt={`${slides[currentSlide].title} Collection`}
                        fill
                        className="object-cover object-center transition-transform duration-700 hover:scale-105"
                        priority
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>

                    {/* Floating Price Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 1 }}
                      className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                          {slides[currentSlide].price}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                          {slides[currentSlide].originalPrice}
                        </div>
                      </div>
                    </motion.div>

                    {/* Floating Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                      className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{slides[currentSlide].badge}</div>
                          <div className="text-xs text-gray-600">Premium Quality</div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Background Decoration */}
                    <div className="absolute -z-10 top-8 left-8 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-10 rounded-3xl"></div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
})