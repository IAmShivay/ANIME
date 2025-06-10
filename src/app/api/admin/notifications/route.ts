import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import Review from '@/models/Review'
import User from '@/lib/models/User'
import Product from '@/lib/models/Product'
import { requireAdmin } from '@/lib/auth'

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
    
    const notifications = []
    
    // Get pending orders
    const pendingOrders = await Order.countDocuments({ 
      orderStatus: 'pending' 
    })
    
    if (pendingOrders > 0) {
      notifications.push({
        id: 'pending-orders',
        type: 'order',
        title: 'Pending Orders',
        message: `${pendingOrders} order${pendingOrders > 1 ? 's' : ''} waiting for processing`,
        count: pendingOrders,
        priority: 'high',
        createdAt: new Date().toISOString()
      })
    }
    
    // Get pending reviews
    const pendingReviews = await Review.countDocuments({ 
      isApproved: false 
    })
    
    if (pendingReviews > 0) {
      notifications.push({
        id: 'pending-reviews',
        type: 'review',
        title: 'Pending Reviews',
        message: `${pendingReviews} review${pendingReviews > 1 ? 's' : ''} waiting for approval`,
        count: pendingReviews,
        priority: 'medium',
        createdAt: new Date().toISOString()
      })
    }
    
    // Get low stock products
    const lowStockProducts = await Product.countDocuments({ 
      stock: { $lt: 10 },
      isActive: true
    })
    
    if (lowStockProducts > 0) {
      notifications.push({
        id: 'low-stock',
        type: 'inventory',
        title: 'Low Stock Alert',
        message: `${lowStockProducts} product${lowStockProducts > 1 ? 's' : ''} running low on stock`,
        count: lowStockProducts,
        priority: 'medium',
        createdAt: new Date().toISOString()
      })
    }
    
    // Get new users today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const newUsers = await User.countDocuments({
      createdAt: { $gte: today },
      role: { $ne: 'admin' }
    })
    
    if (newUsers > 0) {
      notifications.push({
        id: 'new-users',
        type: 'user',
        title: 'New Users',
        message: `${newUsers} new user${newUsers > 1 ? 's' : ''} registered today`,
        count: newUsers,
        priority: 'low',
        createdAt: new Date().toISOString()
      })
    }
    
    // Get recent orders (last 24 hours)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: yesterday }
    })
    
    if (recentOrders > 0) {
      notifications.push({
        id: 'recent-orders',
        type: 'order',
        title: 'Recent Orders',
        message: `${recentOrders} order${recentOrders > 1 ? 's' : ''} placed in the last 24 hours`,
        count: recentOrders,
        priority: 'low',
        createdAt: new Date().toISOString()
      })
    }
    
    // Sort by priority and date
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    notifications.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    
    return NextResponse.json({
      success: true,
      data: notifications,
      total: notifications.length
    })
    
  } catch (error: any) {
    console.error('Get admin notifications error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}
