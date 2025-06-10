import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import Product from '@/lib/models/Product'
import jwt from 'jsonwebtoken'
import Razorpay from 'razorpay'

// Validate Razorpay configuration
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('Razorpay configuration missing')
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Simple token verification function
async function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'No token provided' }
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    return {
      success: true,
      user: {
        id: decoded.userId || decoded.id,
        email: decoded.email
      }
    }
  } catch (error) {
    return { success: false, error: 'Invalid token' }
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { items, shippingAddress, paymentMethod, pricing, guestOrder = false } = body

    let userId = null

    // For guest orders, skip authentication
    if (!guestOrder) {
      const authResult = await verifyToken(request)
      if (!authResult.success) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized. Please login or continue as guest.' },
          { status: 401 }
        )
      }
      userId = authResult.user?.id
    }

    // Validate required fields
    if (!items || !shippingAddress || !paymentMethod || !pricing) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate items and check inventory
    const orderItems = []
    let calculatedSubtotal = 0

    for (const item of items) {
      const product = await Product.findById(item.id)
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.name} not found` },
          { status: 400 }
        )
      }

      if (product.status !== 'active') {
        return NextResponse.json(
          { success: false, error: `Product ${item.name} is not available` },
          { status: 400 }
        )
      }

      // Check inventory
      let availableQuantity = 0
      if (product.variants && product.variants.length > 0) {
        const variant = product.variants.find((v: any) =>
          v.options.size === item.selectedSize &&
          v.options.color === item.selectedColor
        )
        if (!variant) {
          return NextResponse.json(
            { success: false, error: `Selected variant for ${item.name} not found` },
            { status: 400 }
          )
        }
        availableQuantity = variant.inventory.quantity
      } else {
        availableQuantity = product.inventory.quantity
      }

      if (product.inventory.trackQuantity && availableQuantity < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${item.name}` },
          { status: 400 }
        )
      }

      const itemTotal = product.price * item.quantity
      calculatedSubtotal += itemTotal

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0],
        variant: {
          size: item.selectedSize,
          color: item.selectedColor,
        },
        total: itemTotal,
      })
    }

    // Validate pricing
    const calculatedShipping = calculatedSubtotal > 2000 ? 0 : 99
    const calculatedTax = calculatedSubtotal * 0.18
    const calculatedTotal = calculatedSubtotal + calculatedShipping + calculatedTax

    if (Math.abs(calculatedTotal - pricing.total) > 0.01) {
      return NextResponse.json(
        { success: false, error: 'Price mismatch detected' },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = `BIND-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`

    // Create Razorpay order only for online payments
    let razorpayOrder = null
    if (paymentMethod === 'razorpay') {
      try {
        // Validate Razorpay keys before making API call
        if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_1234567890' ||
            !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET === 'your-razorpay-key-secret') {
          throw new Error('Razorpay keys not properly configured')
        }

        razorpayOrder = await razorpay.orders.create({
          amount: Math.round(pricing.total * 100), // Amount in paise
          currency: 'INR',
          receipt: orderNumber,
          notes: {
            orderId: orderNumber,
            userId: userId || 'guest',
          },
        })
      } catch (razorpayError: any) {
        console.error('Razorpay order creation failed:', razorpayError)

        // If Razorpay fails, suggest COD as alternative
        return NextResponse.json(
          {
            success: false,
            error: 'Online payment is currently unavailable. Please try Cash on Delivery.',
            suggestCOD: true
          },
          { status: 503 }
        )
      }
    }

    // Create order in database
    const order = new Order({
      orderNumber,
      user: userId,
      items: orderItems,
      shippingAddress: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        address1: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
      },
      billingAddress: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        address1: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
      },
      pricing: {
        subtotal: calculatedSubtotal,
        shipping: calculatedShipping,
        tax: calculatedTax,
        discount: 0,
        total: calculatedTotal,
      },
      paymentMethod: {
        type: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'pending',
        razorpayOrderId: razorpayOrder?.id || null,
      },
      orderStatus: 'pending',
    })

    await order.save()

    // Update inventory (reserve items)
    for (const item of items) {
      const product = await Product.findById(item.id)
      if (product && product.inventory.trackQuantity) {
        if (product.variants && product.variants.length > 0) {
          const variantIndex = product.variants.findIndex((v: any) =>
            v.options.size === item.selectedSize &&
            v.options.color === item.selectedColor
          )
          if (variantIndex !== -1) {
            product.variants[variantIndex].inventory.quantity -= item.quantity
          }
        } else {
          product.inventory.quantity -= item.quantity
        }
        await product.save()
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: order._id,
        orderNumber: order.orderNumber,
        razorpayOrderId: razorpayOrder?.id || null,
        total: pricing.total,
      },
      message: 'Order created successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Create order error:', error)

    // Handle specific Razorpay errors
    if (error.statusCode === 401) {
      return NextResponse.json(
        { success: false, error: 'Payment gateway authentication failed. Please contact support.' },
        { status: 500 }
      )
    }

    if (error.statusCode === 400) {
      return NextResponse.json(
        { success: false, error: error.error?.description || 'Invalid payment request' },
        { status: 400 }
      )
    }

    // Handle MongoDB/Database errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: 'Invalid order data provided' },
        { status: 400 }
      )
    }

    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return NextResponse.json(
        { success: false, error: 'Database error. Please try again.' },
        { status: 500 }
      )
    }

    // Generic error
    return NextResponse.json(
      { success: false, error: 'Failed to create order. Please try again.' },
      { status: 500 }
    )
  }
}
