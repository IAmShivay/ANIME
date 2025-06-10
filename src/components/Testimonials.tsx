'use client'

import { motion } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, ShoppingBag, Verified } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Review {
  _id: string
  user: {
    name: string
    avatar?: string
  }
  product?: {
    name: string
    images: string[]
  }
  rating: number
  title: string
  comment: string
  images: Array<{ url: string; alt: string }>
  isVerifiedPurchase: boolean
  createdAt: string
}

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedReviews()
  }, [])

  const fetchFeaturedReviews = async () => {
    try {
      const response = await fetch('/api/reviews?featured=true&limit=6&approved=true')
      const data = await response.json()
      
      if (data.success) {
        setReviews(data.data.reviews)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, reviews.length))
  }

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % Math.max(1, reviews.length))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) {
    return null // Don't show section if no reviews
  }

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real reviews from verified customers who love our anime fashion collection
          </p>
        </motion.div>

        {/* Reviews Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={prevReview}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-colors duration-300"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                onClick={nextReview}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-colors duration-300"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-12">
            {reviews.slice(currentIndex, currentIndex + 3).map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Quote Icon */}
                <div className="flex justify-between items-start mb-4">
                  <Quote className="w-8 h-8 text-purple-600 opacity-20" />
                  {review.isVerifiedPurchase && (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <Verified className="w-3 h-3" />
                      <span>Verified Purchase</span>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="text-sm text-gray-600">({review.rating}/5)</span>
                </div>

                {/* Review Title */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {review.title}
                </h3>

                {/* Review Comment */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {review.comment}
                </p>

                {/* Product Info (if available) */}
                {review.product && (
                  <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 relative rounded-lg overflow-hidden">
                      <Image
                        src={review.product.images[0] || '/placeholder-product.jpg'}
                        alt={review.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900 line-clamp-1">
                        {review.product.name}
                      </p>
                      <p className="text-xs text-gray-500">Product Review</p>
                    </div>
                  </div>
                )}

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review.images.slice(0, 3).map((img, imgIndex) => (
                      <div key={imgIndex} className="w-12 h-12 relative rounded-lg overflow-hidden">
                        <Image
                          src={img.url}
                          alt={img.alt || 'Review image'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {review.images.length > 3 && (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-600">+{review.images.length - 3}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* User Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600">
                    {review.user.avatar ? (
                      <Image
                        src={review.user.avatar}
                        alt={review.user.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                        {review.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{review.user.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dots Indicator */}
          {reviews.length > 3 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: Math.ceil(reviews.length / 3) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i * 3)}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    Math.floor(currentIndex / 3) === i
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Share Your Experience</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Purchased from us? We'd love to hear about your experience!
            </p>
            <Link href="/reviews">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                View All Reviews
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
