'use client'

import { ShoppingCart, Menu, X, User, Heart, ChevronDown, Sparkles, Zap, Star, TrendingUp, ArrowRight } from 'lucide-react'
import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { selectCartItemsCount, toggleCart } from '@/store/slices/cartSlice'
import { selectWishlistItemsCount } from '@/store/slices/wishlistSlice'
import { selectIsAuthenticated, selectCurrentUser } from '@/store/slices/authSlice'
import Image from 'next/image'

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const dispatch = useDispatch()

  const cartItemsCount = useSelector(selectCartItemsCount)
  const wishlistItemsCount = useSelector(selectWishlistItemsCount)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const currentUser = useSelector(selectCurrentUser)

  // Memoize navigation links for performance
  const navLinks = useMemo(() => [
    { path: '/', label: 'Home' },
    {
      path: '/shop',
      label: 'Shop',
      hasDropdown: true,
      dropdownItems: [
        {
          path: '/shop',
          label: 'All Products',
          description: 'Browse our complete collection',
          icon: Sparkles,
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=120&fit=crop'
        },
        {
          path: '/shop?category=anime',
          label: 'Anime Collection',
          description: 'Premium anime-inspired fashion',
          icon: Star,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=120&fit=crop'
        },
        {
          path: '/shop?category=streetwear',
          label: 'Streetwear',
          description: 'Urban fashion meets anime culture',
          icon: Zap,
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=120&fit=crop'
        },
        {
          path: '/shop?category=accessories',
          label: 'Accessories',
          description: 'Complete your anime look',
          icon: Heart,
          image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=200&h=120&fit=crop'
        },
        {
          path: '/shop?category=limited',
          label: 'Limited Edition',
          description: 'Exclusive drops and collaborations',
          icon: Star,
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=120&fit=crop'
        },
        {
          path: '/shop?sort=newest',
          label: 'New Arrivals',
          description: 'Latest additions to our collection',
          icon: TrendingUp,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=120&fit=crop'
        },
      ]
    },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ], [])

  // Memoize functions for performance
  const isActive = useCallback((path: string) => {
    if (!pathname) return false
    if (path === '/shop') {
      return pathname === '/shop' || pathname.startsWith('/shop')
    }
    return pathname === path
  }, [pathname])

  const handleCartClick = useCallback(() => {
    dispatch(toggleCart())
  }, [dispatch])

  const handleDropdownToggle = useCallback((label: string) => {
    setActiveDropdown(prev => prev === label ? null : label)
  }, [])

  const closeDropdown = useCallback(() => {
    setActiveDropdown(null)
  }, [])

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg lg:text-xl">B</span>
              </div>
              <span className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                Bindass
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div
                key={link.path}
                className="relative"
                onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.path}
                  className={`relative flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-purple-600 bg-purple-50 shadow-md border border-purple-200'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50/50'
                  }`}
                >
                  {link.label}
                  {link.hasDropdown && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                      activeDropdown === link.label ? 'rotate-180' : ''
                    }`} />
                  )}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </Link>

                {/* Compact Dropdown Menu */}
                <AnimatePresence>
                  {link.hasDropdown && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      {/* Compact Menu Content */}
                      <div className="p-4">
                        {/* Main Categories */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <Link
                            href="/shop?category=anime"
                            className="group p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                            onClick={closeDropdown}
                          >
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              <span className="font-semibold text-sm">Anime</span>
                            </div>
                            <p className="text-xs text-purple-100 mt-1">Premium collection</p>
                          </Link>

                          <Link
                            href="/shop?category=streetwear"
                            className="group p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                            onClick={closeDropdown}
                          >
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4" />
                              <span className="font-semibold text-sm">Streetwear</span>
                            </div>
                            <p className="text-xs text-purple-100 mt-1">Urban fashion</p>
                          </Link>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-2">
                          {[
                            { path: '/shop', label: 'All Products', icon: Sparkles },
                            { path: '/shop?category=accessories', label: 'Accessories', icon: Heart },
                            { path: '/shop?category=limited', label: 'Limited Edition', icon: Star },
                            { path: '/shop?sort=newest', label: 'New Arrivals', icon: TrendingUp },
                          ].map((item) => (
                            <Link
                              key={item.path}
                              href={item.path}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                              onClick={closeDropdown}
                            >
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                <item.icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">
                                {item.label}
                              </span>
                              <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-purple-600 ml-auto" />
                            </Link>
                          ))}
                        </div>

                        {/* Special Offer */}
                        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-purple-700 uppercase">Special Offer</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">Free Shipping on ₹2000+</p>
                          <Link
                            href="/shop?featured=true"
                            className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-purple-600 hover:text-purple-700"
                            onClick={closeDropdown}
                          >
                            Shop Now <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Wishlist Button */}
              <Link href="/wishlist">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-3 hover:bg-purple-50 rounded-xl transition-all duration-300 group"
                >
                  <Heart className="h-5 w-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
                  {wishlistItemsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg"
                    >
                      {wishlistItemsCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              {/* Cart Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCartClick}
                className="relative p-3 hover:bg-purple-50 rounded-xl transition-all duration-300 group"
              >
                <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </motion.button>
            </div>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative ml-4">
                <Link href={currentUser?.role === 'admin' ? '/admin' : '/dashboard'}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all duration-300 border border-purple-100"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                      {currentUser?.name}
                    </span>
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link href="/auth/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link href="/auth/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Cart & Wishlist */}
            <div className="flex items-center space-x-1">
              <Link href="/wishlist">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Heart className="h-5 w-5 text-gray-600" />
                  {wishlistItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistItemsCount}
                    </span>
                  )}
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCartClick}
                className="relative p-2 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </motion.button>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
        >
          <div className="px-4 py-6 space-y-4">
            {/* Navigation Links */}
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-purple-600 bg-purple-50 border-l-4 border-purple-600'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* User Section */}
            {isAuthenticated ? (
              <div className="pt-4 border-t border-gray-100">
                <Link
                  href={currentUser?.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{currentUser?.name}</p>
                    <p className="text-sm text-gray-600">
                      {currentUser?.role === 'admin' ? 'Admin Dashboard' : 'My Account'}
                    </p>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-center rounded-xl text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-center rounded-xl text-base font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}
