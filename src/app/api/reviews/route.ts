import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'
import User from '@/lib/models/User'
import Product from '@/lib/models/Product'
import Order from '@/lib/models/Order'
import jwt from 'jsonwebtoken'

// GET /api/reviews - Get reviews with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const productId = searchParams.get('productId')
    const featured = searchParams.get('featured') === 'true'
    const approved = searchParams.get('approved') !== 'false' // Default to approved only
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'
    
    const skip = (page - 1) * limit
    
    // Build query
    const query: any = {}
    if (productId) query.product = productId
    if (featured) query.isFeatured = true
    if (approved) query.isApproved = true
    
    // Build sort object
    const sortObj: any = {}
    sortObj[sort] = order === 'desc' ? -1 : 1
    
    // Get reviews with populated user and product data
    const reviews = await Review.find(query)
      .populate('user', 'name email avatar')
      .populate('product', 'name images price')
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean()
    
    // Get total count for pagination
    const total = await Review.countDocuments(query)
    
    // Get review statistics
    const stats = await Review.getReviewStats(productId || undefined)
    
    return NextResponse.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats
      }
    })
    
  } catch (error: any) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
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
    
    // Verify user exists
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    const body = await request.json()
    const { orderId, productId, rating, title, comment, images } = body
    
    // Validate required fields
    if (!orderId || !rating || !title || !comment) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }
    
    // Verify order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      status: { $in: ['delivered', 'completed'] }
    })
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Can only review completed orders' },
        { status: 400 }
      )
    }
    
    // If productId is provided, verify it was in the order
    if (productId) {
      const productInOrder = order.items.some((item: any) => 
        item.product.toString() === productId
      )
      
      if (!productInOrder) {
        return NextResponse.json(
          { success: false, error: 'Can only review products you have purchased' },
          { status: 400 }
        )
      }
      
      // Check if user already reviewed this product
      const existingReview = await Review.findOne({
        user: userId,
        product: productId
      })
      
      if (existingReview) {
        return NextResponse.json(
          { success: false, error: 'You have already reviewed this product' },
          { status: 400 }
        )
      }
    }
    
    // Create review
    const review = new Review({
      user: userId,
      order: orderId,
      product: productId || null,
      rating,
      title: title.trim(),
      comment: comment.trim(),
      images: images || [],
      isVerifiedPurchase: true,
      isApproved: false // Requires admin approval
    })
    
    await review.save()
    
    // Populate user data for response
    await review.populate('user', 'name email avatar')
    if (productId) {
      await review.populate('product', 'name images price')
    }
    
    return NextResponse.json({
      success: true,
      data: review,
      message: 'Review submitted successfully. It will be visible after admin approval.'
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Create review error:', error)
    
    if (error.message.includes('Can only review')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
