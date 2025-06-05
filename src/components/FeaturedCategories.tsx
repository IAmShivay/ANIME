'use client';

import { motion } from 'framer-motion';
import { Sword, Shirt, Gift } from 'lucide-react';

const categories = [
  {
    id: 'collectibles',
    name: 'Anime Collectibles',
    icon: Sword,
    image: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800',
    description: 'Limited edition figurines and replicas'
  },
  {
    id: 'clothing',
    name: 'Anime Fashion',
    icon: Shirt,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    description: 'Exclusive apparel and accessories'
  },
  {
    id: 'limited',
    name: 'Limited Editions',
    icon: Gift,
    image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800',
    description: 'Special releases and collector items'
  }
];

export const FeaturedCategories: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Featured Collections</h2>
          <p className="text-purple-200 text-lg">Discover our most popular categories</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative h-96 rounded-xl overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/50 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transform group-hover:scale-105 transition-transform duration-500">
                  <category.icon className="w-12 h-12 text-purple-300 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-purple-200">{category.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 px-6 py-2 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-lg text-white font-semibold hover:bg-white/20 transition-colors duration-300"
                  >
                    Explore
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};