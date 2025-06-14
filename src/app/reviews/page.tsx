'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Filter, Search, ChevronDown, Verified, Quote, Calendar, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navigation'
import Footer from '@/components/Footer'

interface Review {
  _id: string
  user: {
    name: string
    avatar?: string
  }
  product?: {
    name: string
    images: string[]
    _id: string
  }
  rating: number
  title: string
  comment: string
  images: Array<{ url: string; alt: string }>
  isVerifiedPurchase: boolean
  createdAt: string
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingCounts: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState({
    rating: '',
    sort: 'createdAt',
    order: 'desc',
    search: ''
  })

  useEffect(() => {
    fetchReviews(true)
  }, [filters])

  const fetchReviews = async (reset = false) => {
    try {
      setLoading(true)
      const currentPage = reset ? 1 : page
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        approved: 'true',
        sort: filters.sort,
        order: filters.order
      })
      
      if (filters.rating) params.append('rating', filters.rating)
      if (filters.search) params.append('search', filters.search)
      
      const response = await fetch(`/api/reviews?${params}`)
      const data = await response.json()
      
      if (data.success) {
        if (reset) {
          setReviews(data.data.reviews)
          setPage(2)
        } else {
          setReviews(prev => [...prev, ...data.data.reviews])
          setPage(prev => prev + 1)
        }
        
        setStats(data.data.stats)
        setHasMore(data.data.pagination.page < data.data.pagination.pages)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number, size = 'w-4 h-4') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getRatingPercentage = (rating: number) => {
    if (!stats || stats.totalReviews === 0) return 0
    return (stats.ratingCounts[rating as keyof typeof stats.ratingCounts] / stats.totalReviews) * 100
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Customer Reviews
              </h1>
              <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                Real feedback from our amazing customers who love Bindass anime fashion
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar - Stats & Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                
                {/* Overall Rating */}
                {stats && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Rating</h3>
                    
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {stats.averageRating}
                      </div>
                      <div className="flex justify-center mb-2">
                        {renderStars(Math.round(stats.averageRating), 'w-5 h-5')}
                      </div>
                      <p className="text-gray-600 text-sm">
                        Based on {stats.totalReviews} reviews
                      </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-8">{rating}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getRatingPercentage(rating)}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">
                            {stats.ratingCounts[rating as keyof typeof stats.ratingCounts]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Filters */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </h3>

                  {/* Rating Filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      value={filters.rating}
                      onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">All Ratings</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={`${filters.sort}-${filters.order}`}
                      onChange={(e) => {
                        const [sort, order] = e.target.value.split('-')
                        setFilters(prev => ({ ...prev, sort, order }))
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="createdAt-desc">Newest First</option>
                      <option value="createdAt-asc">Oldest First</option>
                      <option value="rating-desc">Highest Rating</option>
                      <option value="rating-asc">Lowest Rating</option>
                      <option value="helpfulVotes-desc">Most Helpful</option>
                    </select>
                  </div>
                </motion.div>

                {/* Write Review CTA */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white text-center"
                >
                  <Quote className="w-8 h-8 mx-auto mb-3 opacity-80" />
                  <h3 className="font-semibold mb-2">Share Your Experience</h3>
                  <p className="text-sm text-purple-100 mb-4">
                    Purchased from us? Write a review and help others!
                  </p>
                  <Link href="/dashboard">
                    <button className="w-full py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-300">
                      Write Review
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Main Content - Reviews */}
            <div className="lg:col-span-3">
              {loading && reviews.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-16 bg-gray-200 rounded mb-4"></div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {reviews.map((review, index) => (
                      <motion.div
                        key={review._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                      >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-sm text-gray-600">({review.rating}/5)</span>
                          </div>
                          {review.isVerifiedPurchase && (
                            <div className="flex items-center gap-1 text-green-600 text-xs">
                              <Verified className="w-3 h-3" />
                              <span>Verified</span>
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {review.title}
                        </h3>

                        {/* Comment */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                          {review.comment}
                        </p>

                        {/* Product Info */}
                        {review.product && (
                          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                              <Image
                                src={review.product.images[0] || '/placeholder-product.jpg'}
                                alt={review.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm line-clamp-1">
                                {review.product.name}
                              </p>
                              <Link 
                                href={`/products/${review.product._id}`}
                                className="text-xs text-purple-600 hover:text-purple-700"
                              >
                                View Product
                              </Link>
                            </div>
                          </div>
                        )}

                        {/* Review Images */}
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 mb-4">
                            {review.images.slice(0, 4).map((img, imgIndex) => (
                              <div key={imgIndex} className="w-16 h-16 relative rounded-lg overflow-hidden">
                                <Image
                                  src={img.url}
                                  alt={img.alt || 'Review image'}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                            {review.images.length > 4 && (
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-xs text-gray-600">+{review.images.length - 4}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* User Info */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 relative rounded-full overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600">
                              {review.user.avatar ? (
                                <Image
                                  src={review.user.avatar}
                                  alt={review.user.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-xs font-semibold">
                                  {review.user.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{review.user.name}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && !loading && (
                    <div className="text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fetchReviews(false)}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                      >
                        Load More Reviews
                      </motion.button>
                    </div>
                  )}

                  {/* No Reviews Message */}
                  {reviews.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <Quote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                      <p className="text-gray-600 mb-6">
                        Be the first to share your experience with our products!
                      </p>
                      <Link href="/shop">
                        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                          Shop Now
                        </button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
