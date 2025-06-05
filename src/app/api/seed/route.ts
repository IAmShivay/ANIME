import { NextRequest, NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/seedData'

export async function POST(request: NextRequest) {
  try {
    // Only allow seeding in development environment
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          success: false,
          error: 'Database seeding is not allowed in production',
        },
        { status: 403 }
      )
    }

    await seedDatabase()

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
    })

  } catch (error: any) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed database',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
