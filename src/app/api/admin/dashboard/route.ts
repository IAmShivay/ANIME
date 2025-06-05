import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { requireAdmin } from '@/lib/auth'
import Product from '@/lib/models/Product'
import Order from '@/lib/models/Order'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Verify admin access
    await requireAdmin(request)

    // Get dashboard statistics
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
      topProducts,
      monthlyStats
    ] = await Promise.all([
      // Total counts
      Product.countDocuments({ status: 'active' }),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      
      // Total revenue
      Order.aggregate([
        { $match: { orderStatus: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]).then(result => result[0]?.total || 0),
      
      // Recent orders
      Order.find()
        .populate('user', 'name email')
        .populate('items.product', 'name images')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      
      // Top selling products
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { 
          _id: '$items.product', 
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.total' }
        }},
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        { $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }},
        { $unwind: '$product' }
      ]),
      
      // Monthly statistics for the last 12 months
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            orders: { $sum: 1 },
            revenue: { $sum: '$pricing.total' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ])

    // Calculate growth percentages (simplified - you might want to compare with previous period)
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    
    const currentMonthStats = monthlyStats.find(stat => 
      stat._id.month === currentMonth && stat._id.year === currentYear
    )
    
    const previousMonthStats = monthlyStats.find(stat => 
      stat._id.month === (currentMonth === 1 ? 12 : currentMonth - 1) && 
      stat._id.year === (currentMonth === 1 ? currentYear - 1 : currentYear)
    )

    const orderGrowth = previousMonthStats 
      ? ((currentMonthStats?.orders || 0) - previousMonthStats.orders) / previousMonthStats.orders * 100
      : 0

    const revenueGrowth = previousMonthStats
      ? ((currentMonthStats?.revenue || 0) - previousMonthStats.revenue) / previousMonthStats.revenue * 100
      : 0

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          totalOrders,
          totalUsers,
          totalRevenue,
          orderGrowth: Math.round(orderGrowth * 100) / 100,
          revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        },
        recentOrders,
        topProducts,
        monthlyStats: monthlyStats.map(stat => ({
          month: `${stat._id.year}-${stat._id.month.toString().padStart(2, '0')}`,
          orders: stat.orders,
          revenue: stat.revenue,
        })),
      },
    })

  } catch (error: any) {
    console.error('Admin dashboard error:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard data',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
