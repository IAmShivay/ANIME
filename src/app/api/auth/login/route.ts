import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    console.log('Login attempt for:', email)

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required',
        },
        { status: 400 }
      )
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    console.log('User found:', user ? 'Yes' : 'No')

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
        },
        { status: 401 }
      )
    }

    // Check password using bcrypt directly as fallback
    let isPasswordValid = false
    try {
      if (user.comparePassword) {
        isPasswordValid = await user.comparePassword(password)
      } else {
        // Fallback to direct bcrypt comparison
        isPasswordValid = await bcrypt.compare(password, user.password)
      }
    } catch (error) {
      console.error('Password comparison error:', error)
      // Fallback to direct bcrypt comparison
      isPasswordValid = await bcrypt.compare(password, user.password)
    }

    console.log('Password valid:', isPasswordValid)

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password',
        },
        { status: 401 }
      )
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    }

    return NextResponse.json({
      success: true,
      data: {
        user: userResponse,
        token,
      },
      message: 'Login successful',
    })

  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to login',
      },
      { status: 500 }
    )
  }
}
