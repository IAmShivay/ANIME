'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Eye, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Star,
  Download,
  RefreshCw,
  UserPlus
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useSelector } from 'react-redux'
import { selectCurrencySymbol } from '@/store/slices/settingsSlice'
import { TableSkeleton } from '@/components/ui/SkeletonLoader'

interface Customer {
  _id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate: string
  joinDate: string
  status: 'active' | 'inactive'
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

export default function AdminCustomersPage() {
  const currencySymbol = useSelector(selectCurrencySymbol)
  
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tierFilter, setTierFilter] = useState('all')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      // Mock data for now - replace with actual API call
      const mockCustomers: Customer[] = [
        {
          _id: '1',
          name: 'Akira Tanaka',
          email: 'akira@example.com',
          phone: '+91 98765 43210',
          totalOrders: 15,
          totalSpent: 45000,
          averageOrderValue: 3000,
          lastOrderDate: '2024-01-15',
          joinDate: '2023-06-15',
          status: 'active',
          loyaltyTier: 'gold'
        },
        {
          _id: '2',
          name: 'Sakura Yamamoto',
          email: 'sakura@example.com',
          phone: '+91 87654 32109',
          totalOrders: 8,
          totalSpent: 24000,
          averageOrderValue: 3000,
          lastOrderDate: '2024-01-10',
          joinDate: '2023-08-20',
          status: 'active',
          loyaltyTier: 'silver'
        },
        {
          _id: '3',
          name: 'Hiroshi Sato',
          email: 'hiroshi@example.com',
          totalOrders: 3,
          totalSpent: 9000,
          averageOrderValue: 3000,
          lastOrderDate: '2023-12-25',
          joinDate: '2023-11-10',
          status: 'active',
          loyaltyTier: 'bronze'
        }
      ]
      setCustomers(mockCustomers)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return 'bg-orange-100 text-orange-800'
      case 'silver':
        return 'bg-gray-100 text-gray-800'
      case 'gold':
        return 'bg-yellow-100 text-yellow-800'
      case 'platinum':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    const matchesTier = tierFilter === 'all' || customer.loyaltyTier === tierFilter
    
    return matchesSearch && matchesStatus && matchesTier
  })

  if (loading) {
    return (
      <AdminLayout>
        <TableSkeleton rows={8} columns={7} title="Customer Management" />
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
              <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
              <p className="text-gray-600 mt-1">Manage and view customer information</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchCustomers}
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
            { label: 'Total Customers', value: customers.length, icon: UserPlus, color: 'bg-blue-500' },
            { label: 'Active Customers', value: customers.filter(c => c.status === 'active').length, icon: Star, color: 'bg-green-500' },
            { label: 'Total Revenue', value: `${currencySymbol}${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}`, icon: ShoppingBag, color: 'bg-purple-500' },
            { label: 'Avg Order Value', value: `${currencySymbol}${Math.round(customers.reduce((sum, c) => sum + c.averageOrderValue, 0) / customers.length || 0)}`, icon: Calendar, color: 'bg-orange-500' }
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
                placeholder="Search customers..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Tier Filter */}
            <div className="relative">
              <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Tiers</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              Showing {filteredCustomers.length} of {customers.length} customers
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <motion.tr
                    key={customer._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">
                            Joined {new Date(customer.joinDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      {customer.phone && (
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.totalOrders} orders</div>
                      <div className="text-sm text-gray-500">
                        Last: {new Date(customer.lastOrderDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {currencySymbol}{customer.totalSpent.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Avg: {currencySymbol}{customer.averageOrderValue.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierColor(customer.loyaltyTier)}`}>
                        {customer.loyaltyTier.charAt(0).toUpperCase() + customer.loyaltyTier.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-purple-600 hover:text-purple-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || tierFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Customers will appear here once they start placing orders'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
