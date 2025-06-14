'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Plus,
  Star,
  Clock,
  CheckCircle,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/store/slices/authSlice'
import { selectCurrencySymbol } from '@/store/slices/settingsSlice'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DashboardSkeleton } from '@/components/ui/SkeletonLoader'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  orderGrowth: number
  revenueGrowth: number
}

interface RecentOrder {
  _id: string
  orderNumber: string
  user?: {
    name: string
    email: string
  }
  customer?: {
    name: string
    email: string
  }
  pricing?: {
    total: number
  }
  total?: number
  orderStatus: string
  status?: string
  createdAt: string
}

export default function AdminDashboard() {
  const currentUser = useSelector(selectCurrentUser)
  const currencySymbol = useSelector(selectCurrencySymbol)

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStats(data.data?.overview || null)
          setRecentOrders(data.data?.recentOrders || [])
          if (isRefresh) {
            toast.success('Dashboard refreshed successfully')
          }
        } else {
          toast.error('Failed to load dashboard data')
        }
      } else {
        toast.error('Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Error loading dashboard')
    } finally {
      if (isRefresh) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }

  const handleRefresh = () => {
    fetchDashboardData(true)
  }

  if (loading) {
    return (
      <AdminLayout>
        <DashboardSkeleton />
      </AdminLayout>
    )
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
      positive: true,
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: `${(stats?.orderGrowth || 0) > 0 ? '+' : ''}${(stats?.orderGrowth || 0).toFixed(1)}%`,
      positive: (stats?.orderGrowth || 0) > 0,
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-purple-500',
      change: '+8%',
      positive: true,
    },
    {
      title: 'Total Revenue',
      value: `${currencySymbol}${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: `${(stats?.revenueGrowth || 0) > 0 ? '+' : ''}${(stats?.revenueGrowth || 0).toFixed(1)}%`,
      positive: (stats?.revenueGrowth || 0) > 0,
    },
  ]

  return (
    <AdminLayout>
      <div className="p-6 h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 mt-1">Welcome back, {currentUser?.name}</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={loading || refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
              <Link href="/admin/products/new">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </motion.button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.positive ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/products">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Manage Products</h3>
                  <p className="text-gray-600">Add, edit, or remove products</p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/orders">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <ShoppingCart className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Manage Orders</h3>
                  <p className="text-gray-600">View and update order status</p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/policies">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <Edit className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Edit Policies</h3>
                  <p className="text-gray-600">Update terms, privacy, refund policies</p>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.user?.name || order.customer?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.user?.email || order.customer?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          (order.orderStatus || order.status) === 'delivered' ? 'bg-green-100 text-green-800' :
                          (order.orderStatus || order.status) === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          (order.orderStatus || order.status) === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.orderStatus || order.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {currencySymbol}{(order.total || order.pricing?.total || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <ShoppingCart className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No recent orders</h3>
                        <p className="text-gray-600">Orders will appear here once customers start placing them</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
