import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// POST /api/payments/create-order - Create Razorpay order
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
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
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
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
