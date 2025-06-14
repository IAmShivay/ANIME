import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import Product from '@/lib/models/Product'
import { verifyToken } from '@/lib/auth'

// Define interfaces
interface OrderQuery {
  user: string
  orderStatus?: string
}

interface OrderItem {
  productId: string
  variant?: {
    size?: string
    color?: string
  }
  quantity: number
}

interface Address {
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
}

interface PaymentMethod {
  type: 'razorpay' | 'cod'
  status?: string
  transactionId?: string
}

interface CreateOrderRequest {
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: PaymentMethod
  notes?: string
}

interface OrdersSuccessResponse {
  success: true
  data: any[]
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
  message?: string
}

interface OrdersErrorResponse {
  success: false
  error: string
  message?: string
}

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest): Promise<NextResponse<OrdersSuccessResponse | OrdersErrorResponse>> {
  try {
    await connectDB()

    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const query: OrderQuery = { user: user.userId }
    if (status) {
      query.orderStatus = status
    }

    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('items.product', 'name images price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query)
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest): Promise<NextResponse<OrdersSuccessResponse | OrdersErrorResponse>> {
  try {
    await connectDB()

    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: CreateOrderRequest = await request.json()
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
    } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order items are required' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !billingAddress) {
      return NextResponse.json(
        { success: false, error: 'Shipping and billing addresses are required' },
        { status: 400 }
      )
    }

    if (!paymentMethod || !paymentMethod.type) {
      return NextResponse.json(
        { success: false, error: 'Payment method is required' },
        { status: 400 }
      )
    }

    // Validate and calculate order totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.productId}` },
          { status: 400 }
        )
      }

      if (product.inventory.quantity < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        )
      }

      const itemTotal = product.price * item.quantity
      subtotal += itemTotal

      orderItems.push({
        product: product._id,
        variant: item.variant,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      })

      // Update product inventory
      product.inventory.quantity -= item.quantity
      await product.save()
    }

    // Calculate totals (you can add tax and shipping logic here)
    const shipping = subtotal > 500 ? 0 : 50 // Free shipping over $500
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + shipping + tax

    // Create order
    const order = new Order({
      user: user.userId,
      items: orderItems,
      shippingAddress,
      billingAddress,
      paymentMethod,
      pricing: {
        subtotal,
        shipping,
        tax,
        discount: 0,
        total,
      },
      notes,
    })

    await order.save()

    // Populate product details for response
    await order.populate('items.product', 'name images price')

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully',
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating order:', error)
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: errors.join(', '),
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
