'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Star, ShoppingBag, Truck } from 'lucide-react'
import Image from 'next/image'
import { memo } from 'react'

export const MarketplaceAvailability = memo(() => {
  const marketplaces = [
    {
      name: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      url: 'https://amazon.in/bindass-anime-fashion',
      description: 'Fast delivery with Prime',
      rating: 4.8,
      reviews: '2.5K+',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      name: 'Flipkart',
      logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg',
      url: 'https://flipkart.com/bindass-anime-fashion',
      description: 'Assured quality products',
      rating: 4.7,
      reviews: '1.8K+',
      color: 'from-blue-500 to-indigo-500'
    }
  ]

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Also Available On
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Shop our exclusive anime fashion collection on your favorite marketplace platforms
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {marketplaces.map((marketplace, index) => (
            <motion.div
              key={marketplace.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${marketplace.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative p-8">
                  {/* Marketplace Logo */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-32 h-16 relative">
                      <Image
                        src={marketplace.logo}
                        alt={`${marketplace.name} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-bold text-gray-900">{marketplace.rating}</span>
                    </div>
                    <div className="text-gray-600">
                      {marketplace.reviews} reviews
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-center mb-8">
                    {marketplace.description}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Truck className="w-4 h-4 text-green-600" />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                      <span>Easy Returns</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-600" />
                      <span>Top Rated</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ExternalLink className="w-4 h-4 text-purple-600" />
                      <span>Secure</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.a
                    href={marketplace.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`block w-full py-4 px-6 bg-gradient-to-r ${marketplace.color} text-white font-bold rounded-xl text-center hover:shadow-lg transition-all duration-300 group-hover:shadow-xl`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Shop on {marketplace.name}</span>
                      <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.a>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Why Shop with Bindass?</h3>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Whether you shop directly from our website or through our marketplace partners, 
              you'll get the same premium quality anime fashion, authentic designs, and excellent customer service. 
              Choose the platform that's most convenient for you!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
})
