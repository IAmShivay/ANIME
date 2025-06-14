'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useCallback, memo } from 'react'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/store/slices/cartSlice'
import { addToWishlist } from '@/store/slices/wishlistSlice'
import { formatPrice } from '@/lib/utils/currency'
import toast from 'react-hot-toast'

// Lazy load heavy components
const LazyProductCard = memo(({ product, index }: { product: any, index: number }) => {
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: product.sizes?.[0] || '',
      color: product.colors?.[0] || '',
      quantity: 1,
      maxQuantity: product.stock
    }))
    toast.success('Added to cart!')
  }

  const handleAddToWishlist = () => {
    dispatch(addToWishlist({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category,
      subCategory: product.subCategory
    }))
    toast.success('Added to wishlist!')
  }

  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true, margin: "-50px" }}
    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full flex flex-col"
  >
    {/* Product Image with lazy loading */}
    <div className="relative w-full h-64 overflow-hidden">
      <Image
        src={product.images?.[0] || product.image}
        alt={product.name}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute top-4 right-4 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAddToWishlist}
          className="p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
        >
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </motion.button>
      </div>
      {product.comparePrice && (
        <div className="absolute top-4 left-4">
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            SALE
          </span>
        </div>
      )}
    </div>

    {/* Product Info */}
    <div className="p-6 flex-1 flex flex-col">
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {product.name}
      </h3>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">({product.reviews})</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-purple-600">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
          {product.category}
        </span>
      </div>

      <div className="flex gap-2 mt-auto">
        <Link href={`/products/${product._id || product.id}`} className="flex-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            View Details
          </motion.button>
        </Link>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <ShoppingCart className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  </motion.div>
)
})

export const FeaturedProducts = memo(() => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/products?featured=true&limit=6')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setProducts(data.data || [])
        } else {
          // Fallback to all products if no featured products
          const fallbackResponse = await fetch('/api/products?limit=6')
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json()
            if (fallbackData.success) {
              setProducts(fallbackData.data || [])
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching featured products:', error)
      // Fallback to static data if API fails
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeaturedProducts()
  }, [fetchFeaturedProducts])

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
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

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Check out our most popular anime fashion items, handpicked for style and quality
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product: any, index: number) => (
            <LazyProductCard key={product._id || product.id || index} product={product} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              View All Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
})