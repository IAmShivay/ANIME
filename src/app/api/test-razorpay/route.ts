import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function GET(request: NextRequest) {
  try {
    // Check if environment variables are set
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'Razorpay environment variables not configured',
        details: {
          keyId: !!process.env.RAZORPAY_KEY_ID,
          keySecret: !!process.env.RAZORPAY_KEY_SECRET
        }
      }, { status: 500 })
    }

    // Check if using placeholder values
    if (process.env.RAZORPAY_KEY_ID === 'rzp_test_1234567890' || 
        process.env.RAZORPAY_KEY_SECRET === 'your-razorpay-key-secret') {
      return NextResponse.json({
        success: false,
        error: 'Razorpay keys are using placeholder values',
        message: 'Please update with actual test keys from Razorpay Dashboard'
      }, { status: 500 })
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    // Test creating a small order
    const testOrder = await razorpay.orders.create({
      amount: 100, // ₹1.00 in paise
      currency: 'INR',
      receipt: `test_${Date.now()}`,
      notes: {
        test: 'true'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Razorpay configuration is working correctly',
      testOrderId: testOrder.id,
      keyId: process.env.RAZORPAY_KEY_ID
    })

  } catch (error: any) {
    console.error('Razorpay test error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Razorpay test failed',
      details: {
        statusCode: error.statusCode,
        errorCode: error.error?.code,
        description: error.error?.description,
        message: error.message
      }
    }, { status: 500 })
  }
}
