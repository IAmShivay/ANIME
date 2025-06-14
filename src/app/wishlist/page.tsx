'use client'

import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useSelector, useDispatch } from 'react-redux'
import { selectWishlistItems, removeFromWishlist, clearWishlist } from '@/store/slices/wishlistSlice'
import { addToCart } from '@/store/slices/cartSlice'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const dispatch = useDispatch()
  const wishlistItems = useSelector(selectWishlistItems)

  const handleRemoveFromWishlist = (id: string) => {
    dispatch(removeFromWishlist(id))
    toast.success('Removed from wishlist')
  }

  const handleAddToCart = (item: any) => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      maxQuantity: 10, // Default max quantity
    }))
    toast.success('Added to cart!')
  }

  const handleClearWishlist = () => {
    dispatch(clearWishlist())
    toast.success('Wishlist cleared')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="w-12 h-12 text-pink-200" />
                <h1 className="text-4xl md:text-5xl font-bold">My Wishlist</h1>
              </div>
              <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                Your favorite anime fashion pieces, saved for later
              </p>
            </motion.div>
          </div>
        </section>

        {/* Wishlist Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {wishlistItems.length === 0 ? (
              /* Empty Wishlist */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16"
              >
                <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start adding items to your wishlist by clicking the heart icon on products you love!
                </p>
                <Link href="/shop">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    Browse Products
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              /* Wishlist Items */
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900">
                      {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} in your wishlist
                    </h2>
                  </motion.div>
                  
                  {wishlistItems.length > 1 && (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                      onClick={handleClearWishlist}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      Clear All
                    </motion.button>
                  )}
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {wishlistItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Product Image */}
                      <div className="relative w-full h-64">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-md"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                        
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-bold text-purple-600">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.category && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {item.category}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAddToCart(item)}
                            className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </motion.button>
                          
                          <Link href={`/products/${item.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              View Details
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-center mt-12"
                >
                  <Link href="/shop">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg border-2 border-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 flex items-center gap-2 mx-auto"
                    >
                      Continue Shopping
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </section>

        {/* Recommendations */}
        {wishlistItems.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">You might also like</h2>
                <p className="text-gray-600 mb-8">
                  Based on your wishlist, here are some recommendations
                </p>
                <Link href="/shop">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  >
                    Explore More Products
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
