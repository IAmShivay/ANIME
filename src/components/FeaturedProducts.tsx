'use client'

import { motion } from 'framer-motion'
import { ProductCard } from './ProductCard'
import { useGetProductsQuery } from '@/store/api/productsApi'
import { Product } from '@/types'

export const FeaturedProducts = () => {
  const { data: products, isLoading, error } = useGetProductsQuery({
    featured: true,
    limit: 3
  })

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg">
              Check out our most popular items
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || !products) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600">Failed to load featured products</p>
        </div>
      </section>
    )
  }

  const featuredProducts = products.data || []

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 text-lg">
            Check out our most popular items
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard
                product={product}
                onAddToCart={(product) => console.log('Added to cart:', product)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};