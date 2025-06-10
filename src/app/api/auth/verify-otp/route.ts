import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import OTP from '@/lib/models/OTP'
import User from '@/lib/models/User'
import { emailService } from '@/lib/email'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// POST /api/auth/verify-otp - Verify OTP and complete action
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { email, otp, type = 'signup', userData } = await request.json()
    
    // Validate required fields
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      )
    }
    
    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, error: 'OTP must be 6 digits' },
        { status: 400 }
      )
    }
    
    try {
      // Verify OTP
      await OTP.verifyOTP(email.toLowerCase(), otp, type)
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }
    
    // Handle different OTP types
    switch (type) {
      case 'signup':
        return await handleSignupVerification(email, userData)
      
      case 'password-reset':
        return NextResponse.json({
          success: true,
          message: 'OTP verified successfully. You can now reset your password.',
          data: {
            email: email.toLowerCase(),
            resetToken: jwt.sign(
              { email: email.toLowerCase(), type: 'password-reset' },
              process.env.JWT_SECRET!,
              { expiresIn: '15m' }
            )
          }
        })
      
      case 'email-verification':
        return NextResponse.json({
          success: true,
          message: 'Email verified successfully',
          data: { email: email.toLowerCase() }
        })
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid OTP type' },
          { status: 400 }
        )
    }
    
  } catch (error: any) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}

async function handleSignupVerification(email: string, userData: any) {
  try {
    // Validate user data
    if (!userData || !userData.name || !userData.password) {
      return NextResponse.json(
        { success: false, error: 'User data is required for signup' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    
    // Create user
    const user = new User({
      name: userData.name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: userData.phone || '',
      isEmailVerified: true, // Mark as verified since OTP was successful
      role: 'user'
    })
    
    await user.save()
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
    
    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.name)
    
    // Return user data (excluding password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    }
    
    return NextResponse.json({
      success: true,
      message: 'Account created successfully! Welcome to Bindass!',
      data: {
        user: userResponse,
        token
      }
    })
    
  } catch (error: any) {
    console.error('Signup verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
