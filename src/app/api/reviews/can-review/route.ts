import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'
import Order from '@/lib/models/Order'
import jwt from 'jsonwebtoken'

// GET /api/reviews/can-review?orderId=xxx&productId=xxx
export async function GET(request: NextRequest) {
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
    const userId = decoded.userId
    
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const productId = searchParams.get('productId')
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    // Check if order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      status: { $in: ['delivered', 'completed'] }
    })
    
    if (!order) {
      return NextResponse.json({
        success: true,
        data: {
          canReview: false,
          reason: 'Order not found or not completed'
        }
      })
    }
    
    // If productId is provided, check specific product
    if (productId) {
      // Check if product was in the order
      const productInOrder = order.items.some((item: any) => 
        item.product.toString() === productId
      )
      
      if (!productInOrder) {
        return NextResponse.json({
          success: true,
          data: {
            canReview: false,
            reason: 'Product not found in this order'
          }
        })
      }
      
      // Check if user already reviewed this product
      const existingReview = await Review.findOne({
        user: userId,
        product: productId
      })
      
      if (existingReview) {
        return NextResponse.json({
          success: true,
          data: {
            canReview: false,
            reason: 'You have already reviewed this product',
            existingReview: {
              id: existingReview._id,
              rating: existingReview.rating,
              title: existingReview.title,
              comment: existingReview.comment,
              isApproved: existingReview.isApproved,
              createdAt: existingReview.createdAt
            }
          }
        })
      }
    } else {
      // Check if user already reviewed this order (general review)
      const existingReview = await Review.findOne({
        user: userId,
        order: orderId,
        product: null
      })
      
      if (existingReview) {
        return NextResponse.json({
          success: true,
          data: {
            canReview: false,
            reason: 'You have already reviewed this order',
            existingReview: {
              id: existingReview._id,
              rating: existingReview.rating,
              title: existingReview.title,
              comment: existingReview.comment,
              isApproved: existingReview.isApproved,
              createdAt: existingReview.createdAt
            }
          }
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        canReview: true,
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          items: order.items,
          createdAt: order.createdAt
        }
      }
    })
    
  } catch (error: any) {
    console.error('Can review check error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check review eligibility' },
      { status: 500 }
    )
  }
}
