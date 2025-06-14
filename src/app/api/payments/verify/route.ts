import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'

// Define interfaces
interface VerifyPaymentRequest {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  orderId?: string
}

interface VerifyPaymentSuccessResponse {
  success: true
  message: string
  data: {
    orderId?: string
    orderNumber?: string
    paymentId: string
    status: string
  }
}

interface VerifyPaymentErrorResponse {
  success: false
  error: string
  message?: string
}

// POST /api/payments/verify - Verify Razorpay payment
export async function POST(request: NextRequest): Promise<NextResponse<VerifyPaymentSuccessResponse | VerifyPaymentErrorResponse>> {
  try {
    await connectDB()

    const body: VerifyPaymentRequest = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId, // Our internal order ID
    } = body

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing payment verification data',
        },
        { status: 400 }
      )
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    const isSignatureValid = expectedSignature === razorpay_signature

    if (!isSignatureValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payment signature',
        },
        { status: 400 }
      )
    }

    // Update order with payment details
    if (orderId) {
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          'paymentMethod.status': 'completed',
          'paymentMethod.razorpayOrderId': razorpay_order_id,
          'paymentMethod.razorpayPaymentId': razorpay_payment_id,
          'paymentMethod.razorpaySignature': razorpay_signature,
          'paymentMethod.transactionId': razorpay_payment_id,
          orderStatus: 'confirmed',
        },
        { new: true }
      )

      if (!order) {
        return NextResponse.json(
          {
            success: false,
            error: 'Order not found',
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          paymentId: razorpay_payment_id,
          status: 'completed',
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        paymentId: razorpay_payment_id,
        status: 'completed',
      },
    })
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify payment',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
