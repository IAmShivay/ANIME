import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import User from '@/lib/models/User'
import Product from '@/lib/models/Product'
import { requireAdmin } from '@/lib/auth'

// Define notification types
interface Notification {
  id: string
  type: 'order' | 'review' | 'inventory' | 'user'
  title: string
  message: string
  count: number
  priority: 'high' | 'medium' | 'low'
  createdAt: string
  link?: string
}

type PriorityLevel = 'high' | 'medium' | 'low'

// GET /api/admin/notifications - Get admin notifications
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Verify admin token
    const user = await requireAdmin(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const notifications: Notification[] = []

    // Prepare date ranges
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    // Run all database queries in parallel for better performance
    const [
      pendingOrders,
      lowStockProducts,
      outOfStockProducts,
      newUsers,
      recentOrders
    ] = await Promise.allSettled([
      // Get pending orders
      Order.countDocuments({
        $or: [
          { orderStatus: 'pending' },
          { status: 'pending' },
          { orderStatus: 'processing' },
          { status: 'processing' }
        ]
      }),

      // Get low stock products
      Product.countDocuments({
        $or: [
          { 'inventory.quantity': { $lt: 10, $gte: 1 } },
          { stock: { $lt: 10, $gte: 1 } }
        ],
        $and: [
          {
            $or: [
              { status: 'active' },
              { isActive: true }
            ]
          }
        ]
      }),

      // Get out of stock products
      Product.countDocuments({
        $or: [
          { 'inventory.quantity': 0 },
          { stock: 0 }
        ],
        $and: [
          {
            $or: [
              { status: 'active' },
              { isActive: true }
            ]
          }
        ]
      }),

      // Get new users today
      User.countDocuments({
        createdAt: { $gte: today },
        $or: [
          { role: { $ne: 'admin' } },
          { role: { $exists: false } }
        ]
      }),

      // Get recent orders
      Order.countDocuments({
        createdAt: { $gte: yesterday }
      })
    ])

    // Extract values with fallbacks
    const pendingOrdersCount = pendingOrders.status === 'fulfilled' ? pendingOrders.value : 0
    const lowStockCount = lowStockProducts.status === 'fulfilled' ? lowStockProducts.value : 0
    const outOfStockCount = outOfStockProducts.status === 'fulfilled' ? outOfStockProducts.value : 0
    const newUsersCount = newUsers.status === 'fulfilled' ? newUsers.value : 0
    const recentOrdersCount = recentOrders.status === 'fulfilled' ? recentOrders.value : 0

    // Build notifications based on query results
    if (pendingOrdersCount > 0) {
      notifications.push({
        id: 'pending-orders',
        type: 'order',
        title: 'Pending Orders',
        message: `${pendingOrdersCount} order${pendingOrdersCount > 1 ? 's' : ''} waiting for processing`,
        count: pendingOrdersCount,
        priority: 'high',
        createdAt: new Date().toISOString(),
        link: '/admin/orders'
      })
    }

    if (outOfStockCount > 0) {
      notifications.push({
        id: 'out-of-stock',
        type: 'inventory',
        title: 'Out of Stock',
        message: `${outOfStockCount} product${outOfStockCount > 1 ? 's' : ''} are out of stock`,
        count: outOfStockCount,
        priority: 'high',
        createdAt: new Date().toISOString(),
        link: '/admin/products'
      })
    }

    if (lowStockCount > 0) {
      notifications.push({
        id: 'low-stock',
        type: 'inventory',
        title: 'Low Stock Alert',
        message: `${lowStockCount} product${lowStockCount > 1 ? 's' : ''} running low on stock`,
        count: lowStockCount,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        link: '/admin/products'
      })
    }

    if (newUsersCount > 0) {
      notifications.push({
        id: 'new-users',
        type: 'user',
        title: 'New Users',
        message: `${newUsersCount} new user${newUsersCount > 1 ? 's' : ''} registered today`,
        count: newUsersCount,
        priority: 'low',
        createdAt: new Date().toISOString(),
        link: '/admin/users'
      })
    }

    if (recentOrdersCount > 0) {
      notifications.push({
        id: 'recent-orders',
        type: 'order',
        title: 'Recent Orders',
        message: `${recentOrdersCount} order${recentOrdersCount > 1 ? 's' : ''} placed in the last 24 hours`,
        count: recentOrdersCount,
        priority: 'low',
        createdAt: new Date().toISOString(),
        link: '/admin/orders'
      })
    }

    // Sort by priority and date with type safety
    const priorityOrder: Record<PriorityLevel, number> = { high: 3, medium: 2, low: 1 }
    notifications.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    
    // Add metadata for better client handling
    const highPriorityCount = notifications.filter(n => n.priority === 'high').length
    const mediumPriorityCount = notifications.filter(n => n.priority === 'medium').length
    const lowPriorityCount = notifications.filter(n => n.priority === 'low').length

    return NextResponse.json({
      success: true,
      data: notifications,
      metadata: {
        total: notifications.length,
        highPriority: highPriorityCount,
        mediumPriority: mediumPriorityCount,
        lowPriority: lowPriorityCount,
        lastUpdated: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('Get admin notifications error:', error)

    // Return more specific error information in development
    const isDevelopment = process.env.NODE_ENV === 'development'

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch notifications',
        ...(isDevelopment && { details: error.message })
      },
      { status: 500 }
    )
  }
}

// POST /api/admin/notifications/mark-read - Mark notification as read
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Verify admin token
    const user = await requireAdmin(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notificationId } = body

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    // For now, we'll just return success since notifications are generated dynamically
    // In a real implementation, you might want to store read status in a database
    return NextResponse.json({
      success: true,
      message: 'Notification marked as read'
    })

  } catch (error: any) {
    console.error('Mark notification as read error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to mark notification as read' },
      { status: 500 }
    )
  }
}
