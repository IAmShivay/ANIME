import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'

// Define interfaces
interface CreatePaymentOrderRequest {
  amount: number
  currency?: string
  receipt?: string
  notes?: Record<string, any>
}

interface PaymentOrderSuccessResponse {
  success: true
  data: {
    orderId: string
    amount: number
    currency: string
    receipt: string
    status: string
  }
}

interface PaymentOrderErrorResponse {
  success: false
  error: string
  message?: string
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// POST /api/payments/create-order - Create Razorpay order
export async function POST(request: NextRequest): Promise<NextResponse<PaymentOrderSuccessResponse | PaymentOrderErrorResponse>> {
  try {
    await connectDB()

    const body: CreatePaymentOrderRequest = await request.json()
    const { amount, currency = 'INR', receipt, notes } = body

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid amount',
        },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    }

    const razorpayOrder = await razorpay.orders.create(options)

    return NextResponse.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: typeof razorpayOrder.amount === 'string' ? parseInt(razorpayOrder.amount) : razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt || '',
        status: razorpayOrder.status,
      },
    })
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create payment order',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
