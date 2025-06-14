'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
  FileText,
  BarChart3,
  Menu,
  X,
  LogOut,
  Eye,
  Bell,
  Search,
  Globe,
  ChevronDown,
  Home,
  Palette,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, selectIsAuthenticated, logout } from '@/store/slices/authSlice'
import { selectCurrentCurrency, selectCurrencySymbol } from '@/store/slices/settingsSlice'
import Image from 'next/image'

interface AdminLayoutProps {
  children: React.ReactNode
}

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  href: string
  badge?: number
  subItems?: MenuItem[]
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()

  const isAuthenticated = useSelector(selectIsAuthenticated)
  const currentUser = useSelector(selectCurrentUser)
  const currentCurrency = useSelector(selectCurrentCurrency)
  const currencySymbol = useSelector(selectCurrencySymbol)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [expandedSections, setExpandedSections] = useState<string[]>(['Main', 'Commerce', 'Content', 'System'])

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== 'admin') {
      router.push('/auth/login')
    } else {
      fetchNotifications()
    }
  }, [isAuthenticated, currentUser, router])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token')

    // Clear Redux state
    dispatch(logout())

    // Redirect to login
    router.push('/auth/login')
  }

  const menuSections: MenuSection[] = [
    {
      title: 'Main',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          href: '/admin'
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: BarChart3,
          href: '/admin/analytics'
        }
      ]
    },
    {
      title: 'Commerce',
      items: [
        {
          id: 'products',
          label: 'Products',
          icon: Package,
          href: '/admin/products'
        },
        {
          id: 'orders',
          label: 'Orders',
          icon: ShoppingCart,
          href: '/admin/orders',
          badge: 5 // Mock pending orders
        },
        {
          id: 'customers',
          label: 'Customers',
          icon: Users,
          href: '/admin/customers'
        }
      ]
    },
    {
      title: 'Content',
      items: [
        {
          id: 'reviews',
          label: 'Reviews',
          icon: MessageSquare,
          href: '/admin/reviews',
          badge: 2 // Mock pending reviews
        },
        {
          id: 'policies',
          label: 'Policies',
          icon: FileText,
          href: '/admin/policies'
        }
      ]
    },
    {
      title: 'System',
      items: [
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
          href: '/admin/settings'
        }
      ]
    }
  ]

  const isActiveRoute = (href: string) => {
    if (!pathname) return false
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionTitle)
        ? prev.filter(s => s !== sectionTitle)
        : [...prev, sectionTitle]
    )
  }

  if (!isAuthenticated || currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-auto flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Bindass Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <div className="space-y-6">
            {menuSections.map((section) => (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedSections.includes(section.title) ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expandedSections.includes(section.title) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1 mt-2"
                    >
                      {section.items.map((item) => (
                        <Link key={item.id} href={item.href}>
                          <motion.div
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isActiveRoute(item.href)
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className={`w-5 h-5 ${
                                isActiveRoute(item.href) ? 'text-white' : 'text-gray-500'
                              }`} />
                              <span>{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                                isActiveRoute(item.href)
                                  ? 'bg-white/20 text-white'
                                  : 'bg-red-100 text-red-600'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </motion.div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom Section - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
          {/* Currency Display */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {currentCurrency?.code || 'INR'}
                </div>
                <div className="text-xs text-gray-600">
                  Default Currency
                </div>
              </div>
              <div className="ml-auto text-lg font-bold text-purple-600">
                {currencySymbol}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>View Site</span>
              </motion.button>
            </Link>
            <Link href="/admin/settings">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-purple-600 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <Palette className="w-4 h-4" />
                <span>Settings</span>
              </motion.button>
            </Link>
          </div>

          {/* Logout Button - At the very bottom */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200 border border-red-200 shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 relative z-30">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </motion.button>

              {/* Page Title */}
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">
                  {!pathname ? 'Admin Panel' :
                   pathname === '/admin' ? 'Dashboard' :
                   pathname.includes('/orders') ? 'Orders' :
                   pathname.includes('/products') ? 'Products' :
                   pathname.includes('/settings') ? 'Settings' :
                   pathname.includes('/customers') ? 'Customers' :
                   pathname.includes('/reviews') ? 'Reviews' :
                   pathname.includes('/analytics') ? 'Analytics' :
                   'Admin Panel'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              {/* Search Bar */}
              <div className="hidden xl:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-48 xl:w-64 text-sm"
                />
              </div>

              {/* Search Button for smaller screens */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="xl:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {notifications.length}
                    </span>
                  )}
                </motion.button>

                {/* Notification Dropdown - Add this later */}
                {notifications.length > 0 && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 hidden">
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Notifications</h3>
                      <div className="space-y-2">
                        {notifications.slice(0, 5).map((notification: any, index: number) => (
                          <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-gray-600">{notification.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Currency Display */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <Globe className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">
                  {currencySymbol}
                </span>
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-3 border-l border-gray-200">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                  <p className="text-xs text-purple-600">Administrator</p>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center ring-2 ring-purple-100">
                    {currentUser?.avatar ? (
                      <Image
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-white font-semibold">
                        {currentUser?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="hidden sm:flex p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
