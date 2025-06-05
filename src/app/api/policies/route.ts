import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Policy from '@/lib/models/Policy'
import { requireAdmin } from '@/lib/auth'

// GET /api/policies - Get all policies
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const activeOnly = searchParams.get('active') === 'true'

    const query: any = {}
    if (type) {
      query.type = type
    }
    if (activeOnly) {
      query.isActive = true
    }

    const policies = await Policy.find(query).sort({ type: 1 }).lean()

    return NextResponse.json({
      success: true,
      data: policies,
    })
  } catch (error: any) {
    console.error('Error fetching policies:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch policies',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

// POST /api/policies - Create or update a policy (Admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    // Verify admin access
    await requireAdmin(request)

    const { type, title, content } = await request.json()

    // Validate required fields
    if (!type || !title || !content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Type, title, and content are required',
        },
        { status: 400 }
      )
    }

    // Check if policy already exists
    let policy = await Policy.findOne({ type })

    if (policy) {
      // Update existing policy
      policy.title = title
      policy.content = content
      policy.isActive = true
      await policy.save()
    } else {
      // Create new policy
      policy = new Policy({
        type,
        title,
        content,
        isActive: true,
      })
      await policy.save()
    }

    return NextResponse.json({
      success: true,
      data: policy,
      message: policy.isNew ? 'Policy created successfully' : 'Policy updated successfully',
    })

  } catch (error: any) {
    console.error('Error creating/updating policy:', error)
    
    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      )
    }

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
        error: 'Failed to save policy',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
