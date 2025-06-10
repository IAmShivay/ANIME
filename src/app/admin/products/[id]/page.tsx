'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  DollarSign,
  Tag,
  Calendar,
  User,
  Star,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useSelector } from 'react-redux'
import { selectCurrentCurrency, formatCurrency } from '@/store/slices/settingsSlice'
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
  status: 'active' | 'draft' | 'archived'
  featured: boolean
  inventory: {
    quantity: number
    sku: string
    trackQuantity: boolean
  }
  rating: number | { average: number; count: number }
  reviews: number
  sizes?: string[]
  colors?: string[]
  specifications?: {
    material: string
    fit: string
    care: string
    origin: string
  }
  seo?: {
    title: string
    description: string
    keywords: string
  }
  createdAt: string
  updatedAt: string
}

export default function AdminProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const currentCurrency = useSelector(selectCurrentCurrency)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setProduct(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!product || !confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products/${product._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.ok) {
        toast.success('Product deleted successfully!')
        router.push('/admin/products')
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error deleting product')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 h-full">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-96 bg-gray-200 rounded"></div>
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 w-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="p-6 h-full">
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Product Not Found</h3>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <Link href="/admin/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Back to Products
              </motion.button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const ratingValue = typeof product.rating === 'object' ? product.rating.average : product.rating
  const reviewCount = typeof product.rating === 'object' ? product.rating.count : product.reviews

  return (
    <AdminLayout>
      <div className="p-6 h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
                <p className="text-gray-600 mt-1">View and manage product information</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link href={`/products/${product._id}`} target="_blank">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4" />
                  View Live
                </motion.button>
              </Link>
              <Link href={`/admin/products/${product._id}/edit`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteProduct}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </motion.button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white border">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
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
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  product.status === 'active' ? 'bg-green-100 text-green-800' :
                  product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {product.status}
                </span>
                {product.featured && (
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                    Featured
                  </span>
                )}
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                  {product.category}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(ratingValue)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {ratingValue.toFixed(1)} ({reviewCount} reviews)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-purple-600">
                  {formatCurrency(product.price, currentCurrency)}
                </span>
                {product.comparePrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatCurrency(product.comparePrice, currentCurrency)}
                  </span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Inventory & Variants */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Stock Quantity:</span>
                  <span className="text-sm text-gray-900 ml-2">{product.inventory.quantity}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">SKU:</span>
                  <span className="text-sm text-gray-900 ml-2">{product.inventory.sku || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Track Quantity:</span>
                  <span className="text-sm text-gray-900 ml-2">
                    {product.inventory.trackQuantity ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-700 block mb-2">Available Sizes:</span>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-700 block mb-2">Available Colors:</span>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <span
                        key={color}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Material:</span>
                    <span className="text-sm text-gray-900 ml-2">
                      {product.specifications.material || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Fit:</span>
                    <span className="text-sm text-gray-900 ml-2">
                      {product.specifications.fit || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Care:</span>
                    <span className="text-sm text-gray-900 ml-2">
                      {product.specifications.care || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Origin:</span>
                    <span className="text-sm text-gray-900 ml-2">
                      {product.specifications.origin || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SEO & Tags */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO & Tags</h3>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700 block mb-2">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO */}
              {product.seo && (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">SEO Title:</span>
                    <p className="text-sm text-gray-900 mt-1">
                      {product.seo.title || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">SEO Description:</span>
                    <p className="text-sm text-gray-900 mt-1">
                      {product.seo.description || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Keywords:</span>
                    <p className="text-sm text-gray-900 mt-1">
                      {product.seo.keywords || 'Not set'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Created:</span>
                  <span className="text-sm text-gray-900 ml-2">
                    {new Date(product.createdAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Last Updated:</span>
                  <span className="text-sm text-gray-900 ml-2">
                    {new Date(product.updatedAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Product ID:</span>
                  <span className="text-sm text-gray-900 ml-2 font-mono">{product._id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
