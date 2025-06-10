'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react'
import { Navbar } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { ProductGrid } from '@/components/ProductGrid'
import { CategoryFilter } from '@/components/CategoryFilter'
import { formatPrice, formatDiscount } from '@/lib/utils/currency'
import { useSearchParams } from 'next/navigation'

export default function ShopPage() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  )
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('order') as 'asc' | 'desc') || 'desc'
  )
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    max: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [currentPage, selectedCategory, searchQuery, sortBy, sortOrder, priceRange])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(false)
      const queryParams = new URLSearchParams()

      queryParams.append('page', currentPage.toString())
      queryParams.append('limit', '12')
      if (selectedCategory) queryParams.append('category', selectedCategory)
      if (searchQuery) queryParams.append('search', searchQuery)
      queryParams.append('sort', sortBy)
      queryParams.append('order', sortOrder)
      if (priceRange.min) queryParams.append('minPrice', priceRange.min.toString())
      if (priceRange.max) queryParams.append('maxPrice', priceRange.max.toString())

      const response = await fetch(`/api/products?${queryParams.toString()}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setProducts(data.data || [])
          setPagination(data.pagination || null)
        } else {
          setError(true)
        }
      } else {
        setError(true)
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const categories = ['anime', 'science', 'accessories', 'limited']

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First', order: 'desc' },
    { value: 'createdAt', label: 'Oldest First', order: 'asc' },
    { value: 'name', label: 'Name A-Z', order: 'asc' },
    { value: 'name', label: 'Name Z-A', order: 'desc' },
    { value: 'price', label: 'Price Low to High', order: 'asc' },
    { value: 'price', label: 'Price High to Low', order: 'desc' },
  ]

  const handleSortChange = (value: string) => {
    const option = sortOptions.find(opt => `${opt.value}-${opt.order}` === value)
    if (option) {
      setSortBy(option.value)
      setSortOrder(option.order as 'asc' | 'desc')
    }
  }

  const handleAddToCart = (product: any) => {
    // This will be handled by the ProductCard component with Redux
    console.log('Added to cart:', product)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Discover Amazing Products
              </h1>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Explore our curated collection of premium anime merchandise and accessories
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters and Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {sortOptions.map((option) => (
                  <option key={`${option.value}-${option.order}`} value={`${option.value}-${option.order}`}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-gray-600">
              {pagination ? `Showing ${products.length} of ${pagination.total} products` : 'Loading...'}
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">Failed to load products. Please try again.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
            </div>
          ) : (
            <ProductGrid products={products} onAddToCart={handleAddToCart} />
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border rounded-lg ${
                      currentPage === i + 1
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
