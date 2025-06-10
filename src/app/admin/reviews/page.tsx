'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X,
  Star,
  MessageSquare,
  Calendar,
  User,
  Package,
  RefreshCw,
  Download,
  Flag
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import Image from 'next/image'
import { TableSkeleton } from '@/components/ui/SkeletonLoader'

interface Review {
  _id: string
  user: {
    name: string
    email: string
    avatar?: string
  }
  product: {
    _id: string
    name: string
    images: string[]
  }
  order: {
    _id: string
    orderNumber: string
  }
  rating: number
  title: string
  comment: string
  images?: string[]
  isApproved: boolean
  isFeatured: boolean
  isReported: boolean
  helpfulVotes: number
  createdAt: string
  updatedAt: string
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [viewingReview, setViewingReview] = useState<Review | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      // Mock data for now - replace with actual API call
      const mockReviews: Review[] = [
        {
          _id: '1',
          user: {
            name: 'Akira Tanaka',
            email: 'akira@example.com'
          },
          product: {
            _id: 'prod1',
            name: 'Naruto Hokage Hoodie',
            images: ['/images/products/naruto-hoodie.jpg']
          },
          order: {
            _id: 'order1',
            orderNumber: 'ORD-2024-001'
          },
          rating: 5,
          title: 'Amazing quality!',
          comment: 'This hoodie is absolutely perfect! The material is soft and the design is exactly like in the anime. Highly recommended!',
          isApproved: false,
          isFeatured: false,
          isReported: false,
          helpfulVotes: 12,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          _id: '2',
          user: {
            name: 'Sakura Yamamoto',
            email: 'sakura@example.com'
          },
          product: {
            _id: 'prod2',
            name: 'Attack on Titan Survey Corps Jacket',
            images: ['/images/products/aot-jacket.jpg']
          },
          order: {
            _id: 'order2',
            orderNumber: 'ORD-2024-002'
          },
          rating: 4,
          title: 'Good but could be better',
          comment: 'The jacket looks great and fits well. However, the zipper feels a bit cheap. Overall satisfied with the purchase.',
          isApproved: true,
          isFeatured: true,
          isReported: false,
          helpfulVotes: 8,
          createdAt: '2024-01-14T15:20:00Z',
          updatedAt: '2024-01-14T15:20:00Z'
        },
        {
          _id: '3',
          user: {
            name: 'Hiroshi Sato',
            email: 'hiroshi@example.com'
          },
          product: {
            _id: 'prod3',
            name: 'Dragon Ball Z Saiyan Armor Tee',
            images: ['/images/products/dbz-tee.jpg']
          },
          order: {
            _id: 'order3',
            orderNumber: 'ORD-2024-003'
          },
          rating: 2,
          title: 'Not what I expected',
          comment: 'The print quality is poor and started fading after first wash. Very disappointed.',
          isApproved: true,
          isFeatured: false,
          isReported: true,
          helpfulVotes: 3,
          createdAt: '2024-01-13T09:15:00Z',
          updatedAt: '2024-01-13T09:15:00Z'
        }
      ]
      setReviews(mockReviews)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateReviewStatus = async (reviewId: string, action: 'approve' | 'reject' | 'feature' | 'unfeature') => {
    try {
      // Mock update - replace with actual API call
      setReviews(prev => prev.map(review => {
        if (review._id === reviewId) {
          switch (action) {
            case 'approve':
              return { ...review, isApproved: true }
            case 'reject':
              return { ...review, isApproved: false }
            case 'feature':
              return { ...review, isFeatured: true }
            case 'unfeature':
              return { ...review, isFeatured: false }
            default:
              return review
          }
        }
        return review
      }))
    } catch (error) {
      console.error('Error updating review:', error)
    }
  }

  const getStatusColor = (review: Review) => {
    if (review.isReported) return 'bg-red-100 text-red-800'
    if (!review.isApproved) return 'bg-yellow-100 text-yellow-800'
    if (review.isFeatured) return 'bg-purple-100 text-purple-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (review: Review) => {
    if (review.isReported) return 'Reported'
    if (!review.isApproved) return 'Pending'
    if (review.isFeatured) return 'Featured'
    return 'Approved'
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

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'pending' && !review.isApproved) ||
                         (statusFilter === 'approved' && review.isApproved && !review.isFeatured) ||
                         (statusFilter === 'featured' && review.isFeatured) ||
                         (statusFilter === 'reported' && review.isReported)
    
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter
    
    return matchesSearch && matchesStatus && matchesRating
  })

  if (loading) {
    return (
      <AdminLayout>
        <TableSkeleton rows={6} columns={4} title="Reviews Management" />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
              <p className="text-gray-600 mt-1">Moderate and manage customer reviews</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchReviews}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Reviews', value: reviews.length, icon: MessageSquare, color: 'bg-blue-500' },
            { label: 'Pending Approval', value: reviews.filter(r => !r.isApproved).length, icon: Calendar, color: 'bg-yellow-500' },
            { label: 'Featured Reviews', value: reviews.filter(r => r.isFeatured).length, icon: Star, color: 'bg-purple-500' },
            { label: 'Reported Reviews', value: reviews.filter(r => r.isReported).length, icon: Flag, color: 'bg-red-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="featured">Featured</option>
                <option value="reported">Reported</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="relative">
              <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {review.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review)}`}>
                        {getStatusText(review)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span>{review.product.name}</span>
                      <span>•</span>
                      <span>Order #{review.order.orderNumber}</span>
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!review.isApproved && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateReviewStatus(review._id, 'approve')}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateReviewStatus(review._id, 'reject')}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </motion.button>
                    </>
                  )}
                  
                  {review.isApproved && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateReviewStatus(review._id, review.isFeatured ? 'unfeature' : 'feature')}
                      className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg ${
                        review.isFeatured 
                          ? 'bg-purple-600 text-white hover:bg-purple-700' 
                          : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                      {review.isFeatured ? 'Unfeature' : 'Feature'}
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewingReview(review)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="View Review Details"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              
              <div className="mb-4">
                <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                <p className="text-gray-700">{review.comment}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>{review.helpfulVotes} people found this helpful</span>
                  {review.isReported && (
                    <span className="flex items-center gap-1 text-red-600">
                      <Flag className="w-4 h-4" />
                      Reported
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || ratingFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Reviews will appear here once customers start leaving feedback'
              }
            </p>
          </div>
        )}

        {/* Review View Modal */}
        {viewingReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Review Details</h3>
                  <button
                    onClick={() => setViewingReview(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xl">
                        {viewingReview.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{viewingReview.user.name}</h4>
                      <p className="text-gray-600">{viewingReview.user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(viewingReview)}`}>
                          {getStatusText(viewingReview)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(viewingReview.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Product</h5>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-xs">IMG</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{viewingReview.product.name}</p>
                        <p className="text-sm text-gray-600">Order #{viewingReview.order.orderNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Rating</h5>
                    <div className="flex items-center gap-2">
                      {renderStars(viewingReview.rating)}
                      <span className="text-lg font-semibold text-gray-900">
                        {viewingReview.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Review</h5>
                    <h6 className="font-medium text-gray-800 mb-2">{viewingReview.title}</h6>
                    <p className="text-gray-700 leading-relaxed">{viewingReview.comment}</p>
                  </div>

                  {/* Helpful Votes */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {viewingReview.helpfulVotes} people found this helpful
                      </span>
                      {viewingReview.isReported && (
                        <span className="flex items-center gap-1 text-red-600 text-sm">
                          <Flag className="w-4 h-4" />
                          Reported
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    {!viewingReview.isApproved && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            updateReviewStatus(viewingReview._id, 'approve')
                            setViewingReview(null)
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            updateReviewStatus(viewingReview._id, 'reject')
                            setViewingReview(null)
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </motion.button>
                      </>
                    )}

                    {viewingReview.isApproved && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          updateReviewStatus(viewingReview._id, viewingReview.isFeatured ? 'unfeature' : 'feature')
                          setViewingReview(null)
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                          viewingReview.isFeatured
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        }`}
                      >
                        <Star className="w-4 h-4" />
                        {viewingReview.isFeatured ? 'Unfeature' : 'Feature'}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
