'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useSelector } from 'react-redux'
import { selectCurrencySymbol } from '@/store/slices/settingsSlice'
import { DashboardSkeleton } from '@/components/ui/SkeletonLoader'

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    growth: number
  }
  orders: {
    current: number
    previous: number
    growth: number
  }
  customers: {
    current: number
    previous: number
    growth: number
  }
  products: {
    current: number
    previous: number
    growth: number
  }
}

export default function AdminAnalyticsPage() {
  const currencySymbol = useSelector(selectCurrencySymbol)
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // Mock data for now - replace with actual API call
      const mockAnalytics: AnalyticsData = {
        revenue: {
          current: 125000,
          previous: 98000,
          growth: 27.6
        },
        orders: {
          current: 342,
          previous: 289,
          growth: 18.3
        },
        customers: {
          current: 1250,
          previous: 1180,
          growth: 5.9
        },
        products: {
          current: 89,
          previous: 85,
          growth: 4.7
        }
      }
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const topProducts = [
    { name: 'Naruto Hokage Hoodie', sales: 156, revenue: 46800 },
    { name: 'Attack on Titan Survey Corps Jacket', sales: 134, revenue: 53600 },
    { name: 'Dragon Ball Z Saiyan Armor Tee', sales: 98, revenue: 29400 },
    { name: 'One Piece Straw Hat Crew Hoodie', sales: 87, revenue: 34800 },
    { name: 'Demon Slayer Tanjiro Haori', sales: 76, revenue: 38000 }
  ]

  const salesByCategory = [
    { category: 'Hoodies', percentage: 35, value: 43750 },
    { category: 'T-Shirts', percentage: 28, value: 35000 },
    { category: 'Jackets', percentage: 20, value: 25000 },
    { category: 'Accessories', percentage: 12, value: 15000 },
    { category: 'Others', percentage: 5, value: 6250 }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <DashboardSkeleton />
      </AdminLayout>
    )
  }

  if (!analytics) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load analytics</h3>
            <button
              onClick={fetchAnalytics}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your business performance and insights</p>
            </div>
            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Revenue',
              value: `${currencySymbol}${analytics.revenue.current.toLocaleString()}`,
              change: analytics.revenue.growth,
              icon: DollarSign,
              color: 'bg-green-500'
            },
            {
              title: 'Total Orders',
              value: analytics.orders.current.toLocaleString(),
              change: analytics.orders.growth,
              icon: ShoppingCart,
              color: 'bg-blue-500'
            },
            {
              title: 'Total Customers',
              value: analytics.customers.current.toLocaleString(),
              change: analytics.customers.growth,
              icon: Users,
              color: 'bg-purple-500'
            },
            {
              title: 'Active Products',
              value: analytics.products.current.toLocaleString(),
              change: analytics.products.growth,
              icon: Package,
              color: 'bg-orange-500'
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    {metric.change >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${metric.color}`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {currencySymbol}{product.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sales by Category */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sales by Category</h3>
              <PieChart className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-4">
              {salesByCategory.map((category, index) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{category.category}</span>
                    <span className="text-sm text-gray-600">{category.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {currencySymbol}{category.value.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Insights</h3>
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Conversion Rate</h4>
              <p className="text-2xl font-bold text-green-600">3.2%</p>
              <p className="text-sm text-gray-600">+0.5% from last month</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Avg Order Value</h4>
              <p className="text-2xl font-bold text-blue-600">{currencySymbol}2,850</p>
              <p className="text-sm text-gray-600">+12% from last month</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Customer Retention</h4>
              <p className="text-2xl font-bold text-purple-600">68%</p>
              <p className="text-sm text-gray-600">+3% from last month</p>
            </div>
          </div>
        </motion.div>

        {/* Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-lg shadow p-6 mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          
          <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-purple-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Interactive Charts Coming Soon</h4>
              <p className="text-gray-600">Advanced analytics with interactive charts will be available in the next update</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
