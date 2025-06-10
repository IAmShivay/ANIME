import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import User from '@/lib/models/User'
import jwt from 'jsonwebtoken'

// GET /api/admin/orders/[id] - Get specific order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    // Get user from token
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await User.findById(decoded.userId)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }
    
    const order = await Order.findById(params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images price description')
      .lean()
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: order
    })
    
  } catch (error: any) {
    console.error('Get admin order error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/orders/[id] - Update order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    // Get user from token
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await User.findById(decoded.userId)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { orderStatus, trackingNumber, notes } = body
    
    const order = await Order.findById(params.id)
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Update order fields
    if (orderStatus) {
      order.orderStatus = orderStatus
    }
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber
    }
    
    if (notes) {
      order.adminNotes = notes
    }
    
    // Add status history
    if (orderStatus && orderStatus !== order.orderStatus) {
      if (!order.statusHistory) {
        order.statusHistory = []
      }
      
      order.statusHistory.push({
        status: orderStatus,
        timestamp: new Date(),
        updatedBy: user._id,
        notes: notes || `Status updated to ${orderStatus}`
      })
    }
    
    await order.save()
    
    // Populate for response
    await order.populate('user', 'name email phone')
    await order.populate('items.product', 'name images price')
    
    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    })
    
  } catch (error: any) {
    console.error('Update admin order error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
