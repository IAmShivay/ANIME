'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Upload, X, ArrowLeft, Check, AlertCircle } from 'lucide-react'
import Navbar from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectCurrentUser, selectIsAuthenticated } from '@/store/slices/authSlice'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface OrderItem {
  product: {
    _id: string
    name: string
    images: string[]
    price: number
  }
  quantity: number
  price: number
}

interface Order {
  _id: string
  orderNumber: string
  items: OrderItem[]
  pricing: {
    total: number
  }
  createdAt: string
}

export default function WriteReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams?.get('orderId')
  const productId = searchParams?.get('productId')
  
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const currentUser = useSelector(selectCurrentUser)
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [canReview, setCanReview] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(productId || null)
  
  const [reviewData, setReviewData] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: [] as File[]
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    if (!orderId) {
      router.push('/dashboard')
      return
    }

    checkReviewEligibility()
  }, [isAuthenticated, orderId])

  const checkReviewEligibility = async () => {
    try {
      const params = new URLSearchParams({ orderId: orderId! })
      if (productId) params.append('productId', productId)
      
      const response = await fetch(`/api/reviews/can-review?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      
      const data = await response.json()
      
      if (data.success) {
        if (data.data.canReview) {
          setCanReview(true)
          setOrder(data.data.order)
        } else {
          toast.error(data.data.reason)
          router.push('/dashboard')
        }
      } else {
        toast.error('Failed to verify review eligibility')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error)
      toast.error('Something went wrong')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + reviewData.images.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }
    
    setReviewData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))
  }

  const removeImage = (index: number) => {
    setReviewData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (reviewData.rating === 0) {
      toast.error('Please select a rating')
      return
    }
    
    if (!reviewData.title.trim()) {
      toast.error('Please enter a review title')
      return
    }
    
    if (!reviewData.comment.trim()) {
      toast.error('Please enter your review comment')
      return
    }

    setSubmitting(true)
    
    try {
      // For now, we'll submit without image upload
      // In production, you'd upload images to a service like Cloudinary first
      const reviewPayload = {
        orderId: orderId,
        productId: selectedProduct,
        rating: reviewData.rating,
        title: reviewData.title.trim(),
        comment: reviewData.comment.trim(),
        images: [] // Would contain uploaded image URLs
      }
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(reviewPayload)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Review submitted successfully! It will be visible after admin approval.')
        router.push('/dashboard?tab=reviews')
      } else {
        toast.error(data.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </>
    )
  }

  if (!canReview || !order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cannot Write Review</h2>
            <p className="text-gray-600 mb-6">You are not eligible to review this order.</p>
            <Link href="/dashboard">
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Write a Review</h1>
            <p className="text-gray-600 mt-2">Share your experience with this order</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-medium">#{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-medium">₹{order.pricing.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Product Selection */}
                {!productId && order.items.length > 1 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Select Product to Review</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="product"
                          value=""
                          checked={selectedProduct === null}
                          onChange={() => setSelectedProduct(null)}
                          className="text-purple-600"
                        />
                        <span className="text-sm">General Order Review</span>
                      </label>
                      {order.items.map((item) => (
                        <label key={item.product._id} className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="product"
                            value={item.product._id}
                            checked={selectedProduct === item.product._id}
                            onChange={() => setSelectedProduct(item.product._id)}
                            className="text-purple-600"
                          />
                          <div className="w-10 h-10 relative rounded overflow-hidden">
                            <Image
                              src={item.product.images[0] || '/placeholder-product.jpg'}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-gray-600">₹{item.product.price}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Review Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overall Rating *
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              star <= reviewData.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 hover:text-yellow-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {reviewData.rating > 0 && `${reviewData.rating}/5`}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Title *
                    </label>
                    <input
                      type="text"
                      value={reviewData.title}
                      onChange={(e) => setReviewData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Summarize your experience in a few words"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">{reviewData.title.length}/100 characters</p>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review *
                    </label>
                    <textarea
                      value={reviewData.comment}
                      onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Tell others about your experience with this product or order..."
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-500 mt-1">{reviewData.comment.length}/1000 characters</p>
                  </div>

                  {/* Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Photos (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload up to 5 images</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors"
                      >
                        Choose Images
                      </label>
                    </div>

                    {/* Image Preview */}
                    {reviewData.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {reviewData.images.map((file, index) => (
                          <div key={index} className="relative">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-600">{file.name.slice(0, 8)}...</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Link href="/dashboard" className="flex-1">
                      <button
                        type="button"
                        className="w-full py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </Link>
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: submitting ? 1 : 1.02 }}
                      whileTap={{ scale: submitting ? 1 : 0.98 }}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Submit Review
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
