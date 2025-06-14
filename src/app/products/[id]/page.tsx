'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Minus, 
  Plus, 
  Truck, 
  Shield, 
  RotateCcw,
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/store/slices/cartSlice'
import { addToWishlist } from '@/store/slices/wishlistSlice'
import { selectCurrentCurrency, formatCurrency, convertCurrency } from '@/store/slices/settingsSlice'
import { formatDiscount } from '@/lib/utils/currency'
import toast from 'react-hot-toast'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  subcategory: string
  tags: string[]
  sizes: string[]
  colors: string[]
  stock: number
  rating: number | { average: number; count: number }
  reviews: number
  specifications: {
    material: string
    fit: string
    care: string
    origin: string
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const dispatch = useDispatch()
  const currentCurrency = useSelector(selectCurrentCurrency)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (params?.id) {
      fetchProduct()
    }
  }, [params?.id])

  const fetchProduct = async () => {
    if (!params?.id) return
    try {
      const response = await fetch(`/api/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setProduct(data.data)
          if (data.data.sizes?.length > 0) setSelectedSize(data.data.sizes[0])
          if (data.data.colors?.length > 0) setSelectedColor(data.data.colors[0])
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color')
      return
    }

    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity
    }))
    
    toast.success('Added to cart!')
  }

  const handleAddToWishlist = () => {
    if (!product) return
    
    dispatch(addToWishlist({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category,
      subCategory: product.subcategory
    }))
    
    toast.success('Added to wishlist!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-purple-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                  {product.category}
                </span>
                {product.comparePrice && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                    {formatDiscount(product.comparePrice, product.price)}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => {
                    const ratingValue = typeof product.rating === 'object' ? product.rating.average : product.rating
                    return (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(ratingValue)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    )
                  })}
                  <span className="text-sm text-gray-600 ml-2">
                    {typeof product.rating === 'object'
                      ? `${product.rating.average.toFixed(1)} (${product.rating.count} reviews)`
                      : `${product.rating} (${product.reviews} reviews)`
                    }
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-purple-600">
                  {formatCurrency(product.price, currentCurrency || undefined)}
                </span>
                {product.comparePrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatCurrency(product.comparePrice, currentCurrency || undefined)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-purple-600 bg-purple-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-purple-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-purple-600 bg-purple-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-purple-600'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stock} items available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              
              <button
                onClick={handleAddToWishlist}
                className="p-3 border border-gray-300 rounded-lg hover:border-purple-600 hover:text-purple-600 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </button>
              
              <button className="p-3 border border-gray-300 rounded-lg hover:border-purple-600 hover:text-purple-600 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-600">On orders over ₹1000</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-600">100% protected</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                <p className="text-xs text-gray-600">30-day policy</p>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Material:</span>
                    <span className="text-sm text-gray-600 ml-2">{product.specifications.material || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Fit:</span>
                    <span className="text-sm text-gray-600 ml-2">{product.specifications.fit || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Care:</span>
                    <span className="text-sm text-gray-600 ml-2">{product.specifications.care || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Origin:</span>
                    <span className="text-sm text-gray-600 ml-2">{product.specifications.origin || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
