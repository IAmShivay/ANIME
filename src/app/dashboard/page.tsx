'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  LogOut, 
  ShoppingBag,
  MapPin,
  CreditCard,
  Bell,
  Edit,
  MessageSquare,
  Star
} from 'lucide-react'
import { Navbar } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, selectIsAuthenticated, logout } from '@/store/slices/authSlice'
import { selectWishlistItems } from '@/store/slices/wishlistSlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface Order {
  _id: string
  orderNumber: string
  items: any[]
  pricing: {
    total: number
  }
  orderStatus: string
  createdAt: string
}

export default function UserDashboard() {
  const router = useRouter()
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const currentUser = useSelector(selectCurrentUser)
  const wishlistItems = useSelector(selectWishlistItems)
  
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    if (currentUser?.role === 'admin') {
      router.push('/admin')
      return
    }

    fetchOrders()
  }, [isAuthenticated, currentUser, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
    router.push('/')
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'reviews', label: 'My Reviews', icon: MessageSquare },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow p-6"
              >
                {/* User Info */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{currentUser.name}</h3>
                  <p className="text-gray-600">{currentUser.email}</p>
                </div>

                {/* Menu */}
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  ))}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </nav>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-lg shadow"
              >
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-100">Total Orders</p>
                            <p className="text-2xl font-bold">{orders.length}</p>
                          </div>
                          <Package className="w-8 h-8 text-purple-200" />
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-100">Wishlist Items</p>
                            <p className="text-2xl font-bold">{wishlistItems.length}</p>
                          </div>
                          <Heart className="w-8 h-8 text-blue-200" />
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-100">Total Spent</p>
                            <p className="text-2xl font-bold">
                              ${orders.reduce((sum, order) => sum + order.pricing.total, 0).toFixed(2)}
                            </p>
                          </div>
                          <ShoppingBag className="w-8 h-8 text-green-200" />
                        </div>
                      </div>
                    </div>

                    {/* Recent Orders */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                      {orders.length === 0 ? (
                        <div className="text-center py-8">
                          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-600">No orders yet</p>
                          <Link href="/shop">
                            <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                              Start Shopping
                            </button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.slice(0, 3).map((order) => (
                            <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                                  <p className="text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                                    {order.orderStatus}
                                  </span>
                                  <p className="text-sm font-medium text-gray-900 mt-1">
                                    ${order.pricing.total.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No orders found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order._id} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                                <p className="text-sm text-gray-600">
                                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                                  {order.orderStatus}
                                </span>
                                {(order.orderStatus === 'delivered' || order.orderStatus === 'completed') && (
                                  <Link href={`/dashboard/write-review?orderId=${order._id}`}>
                                    <button className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                                      <Star className="w-4 h-4" />
                                      Review
                                    </button>
                                  </Link>
                                )}
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                                <p className="font-semibold text-gray-900">₹{order.pricing.total.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">My Reviews</h2>
                      <Link href="/reviews">
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                          View All Reviews
                        </button>
                      </Link>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Share Your Experience</h3>
                          <p className="text-gray-600 text-sm">
                            Help other customers by reviewing products you've purchased. Your feedback matters!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Eligible Orders for Review */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Available for Review</h3>
                      {orders.filter(order => order.orderStatus === 'delivered' || order.orderStatus === 'completed').length === 0 ? (
                        <div className="text-center py-8">
                          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">No completed orders to review</p>
                          <p className="text-sm text-gray-500">Complete an order to leave a review</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders
                            .filter(order => order.orderStatus === 'delivered' || order.orderStatus === 'completed')
                            .slice(0, 5)
                            .map((order) => (
                            <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900">Order #{order.orderNumber}</h4>
                                  <p className="text-sm text-gray-600">
                                    Delivered on {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-500">{order.items.length} item(s) • ₹{order.pricing.total.toFixed(2)}</p>
                                </div>
                                <Link href={`/dashboard/write-review?orderId=${order._id}`}>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                                  >
                                    <Star className="w-4 h-4" />
                                    Write Review
                                  </motion.button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Wishlist Tab */}
                {activeTab === 'wishlist' && (
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
                    {wishlistItems.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Your wishlist is empty</p>
                        <Link href="/shop">
                          <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                            Browse Products
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistItems.map((item) => (
                          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="relative w-full h-48 mb-4">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                            <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                            <p className="text-purple-600 font-semibold">${item.price.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Other tabs placeholder */}
                {['addresses', 'payment', 'settings'].includes(activeTab) && (
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {menuItems.find(item => item.id === activeTab)?.label}
                    </h2>
                    <div className="text-center py-8">
                      <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">This section is coming soon!</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
