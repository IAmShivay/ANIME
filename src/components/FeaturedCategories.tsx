'use client';

import { motion } from 'framer-motion'
import { Sword, Shirt, Gift } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { memo, useCallback } from 'react'

const categories = [
  {
    id: 'anime',
    name: 'Anime Collection',
    icon: Sword,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    description: 'Premium anime-inspired fashion',
    link: '/shop?category=anime'
  },
  {
    id: 'streetwear',
    name: 'Streetwear',
    icon: Shirt,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=600&fit=crop',
    description: 'Urban fashion meets anime culture',
    link: '/shop?category=streetwear'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: Gift,
    image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800&h=600&fit=crop',
    description: 'Complete your anime look',
    link: '/shop?category=accessories'
  }
];

export const FeaturedCategories: React.FC = memo(() => {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Featured Collections
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our most popular categories and find your perfect anime-inspired style
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <Link href={category.link}>
                <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-600/50 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">{category.name}</h3>
                    <p className="text-purple-100 text-sm lg:text-base mb-6 max-w-xs">{category.description}</p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-sm rounded-xl text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
                    >
                      Explore Collection
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})