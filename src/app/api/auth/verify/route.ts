import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const tokenData = await verifyToken(request)
    if (!tokenData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired token',
        },
        { status: 401 }
      )
    }

    // Get user data from database
    const user = await User.findById(tokenData.userId).select('-password')
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      )
    }

    // Return user data
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
      },
      message: 'Token verified successfully',
    })

  } catch (error: any) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Token verification failed',
        message: 'Invalid token',
      },
      { status: 401 }
    )
  }
}
