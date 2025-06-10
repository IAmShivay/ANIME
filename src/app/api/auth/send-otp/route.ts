import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import OTP from '@/lib/models/OTP'
import User from '@/lib/models/User'
import { emailService } from '@/lib/email'

// POST /api/auth/send-otp - Send OTP for email verification
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { email, type = 'signup', name } = await request.json()
    
    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      )
    }
    
    // Check if user already exists for signup
    if (type === 'signup') {
      const existingUser = await User.findOne({ email: email.toLowerCase() })
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'User with this email already exists' },
          { status: 400 }
        )
      }
    }
    
    // Check if user exists for password reset
    if (type === 'password-reset') {
      const existingUser = await User.findOne({ email: email.toLowerCase() })
      if (!existingUser) {
        return NextResponse.json(
          { success: false, error: 'No user found with this email' },
          { status: 404 }
        )
      }
    }
    
    // Check rate limiting - max 3 OTPs per email per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentOTPs = await OTP.countDocuments({
      email: email.toLowerCase(),
      type,
      createdAt: { $gte: oneHourAgo }
    })
    
    if (recentOTPs >= 3) {
      return NextResponse.json(
        { success: false, error: 'Too many OTP requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Generate and save OTP
    const otpDoc = await OTP.createOTP(email.toLowerCase(), type)
    
    // Send OTP email
    const emailSent = await emailService.sendOTPEmail({
      email: email.toLowerCase(),
      otp: otpDoc.otp,
      name: name || 'User',
      type: type as 'signup' | 'password-reset' | 'email-verification'
    })
    
    if (!emailSent) {
      // Delete the OTP if email failed to send
      await OTP.findByIdAndDelete(otpDoc._id)
      return NextResponse.json(
        { success: false, error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your email',
      data: {
        email: email.toLowerCase(),
        expiresAt: otpDoc.expiresAt,
        type
      }
    })
    
  } catch (error: any) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
