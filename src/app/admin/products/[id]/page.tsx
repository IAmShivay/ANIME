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
  Image as ImageIcon,
  RefreshCw,
  Copy
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
  const [deleting, setDeleting] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const productId = params?.id as string

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    if (!productId) {
      toast.error('Product ID is required')
      router.push('/admin/products')
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setProduct(data.data)
        } else {
          toast.error('Failed to load product data')
          router.push('/admin/products')
        }
      } else {
        toast.error('Product not found')
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
      router.push('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!product) {
      toast.error('No product to delete')
      return
    }

    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      setDeleting(true)
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
        const error = await response.json()
        toast.error(error.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error deleting product')
    } finally {
      setDeleting(false)
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard!`)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      toast.error('Failed to copy to clipboard')
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

  const ratingValue = typeof product.rating === 'object'
    ? (product.rating?.average || 0)
    : (product.rating || 0)
  const reviewCount = typeof product.rating === 'object'
    ? (product.rating?.count || 0)
    : (product.reviews || 0)

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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchProduct}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
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
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className={`w-4 h-4 ${deleting ? 'animate-spin' : ''}`} />
                {deleting ? 'Deleting...' : 'Delete'}
              </motion.button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white border">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name || 'Product image'}
                  fill
                  className="object-cover"
                  priority
                  onError={() => {
                    console.error('Failed to load product image')
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No image available</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors hover:border-purple-400 ${
                      selectedImage === index ? 'border-purple-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name || 'Product'} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                      onError={() => {
                        console.error(`Failed to load thumbnail image ${index + 1}`)
                      }}
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
                  {formatCurrency(product.price, currentCurrency || undefined)}
                </span>
                {product.comparePrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatCurrency(product.comparePrice, currentCurrency || undefined)}
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
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-900">{product.inventory?.quantity || 0}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      (product.inventory?.quantity || 0) > 10
                        ? 'bg-green-100 text-green-800'
                        : (product.inventory?.quantity || 0) > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {(product.inventory?.quantity || 0) > 10
                        ? 'In Stock'
                        : (product.inventory?.quantity || 0) > 0
                        ? 'Low Stock'
                        : 'Out of Stock'
                      }
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">SKU:</span>
                  <span className="text-sm text-gray-900 ml-2 font-mono">
                    {product.inventory?.sku || 'Not set'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Track Quantity:</span>
                  <span className="text-sm text-gray-900 ml-2">
                    {product.inventory?.trackQuantity ? 'Yes' : 'No'}
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
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleString()
                      : 'Not available'
                    }
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Last Updated:</span>
                  <span className="text-sm text-gray-900 ml-2">
                    {product.updatedAt
                      ? new Date(product.updatedAt).toLocaleString()
                      : 'Not available'
                    }
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Product ID:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-900 font-mono">{product._id}</span>
                    <button
                      onClick={() => copyToClipboard(product._id, 'Product ID')}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Copy Product ID"
                    >
                      <Copy className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
