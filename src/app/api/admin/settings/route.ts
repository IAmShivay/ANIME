import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Settings, { ISettings, ICurrency } from '@/lib/models/Settings'
import User from '@/lib/models/User'
import jwt from 'jsonwebtoken'

// Define JWT payload interface
interface JWTPayload {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

// Define request body interfaces
interface UpdateSettingsBody {
  siteName?: string
  siteDescription?: string
  defaultCurrency?: ICurrency
  supportedCurrencies?: ICurrency[]
  taxRate?: number
  shippingRate?: number
  freeShippingThreshold?: number
  maintenanceMode?: boolean
  emailSettings?: {
    smtpHost?: string
    smtpPort?: number
    smtpUser?: string
    smtpPassword?: string
    fromEmail?: string
    fromName?: string
  }
  paymentSettings?: {
    razorpayEnabled?: boolean
    codEnabled?: boolean
    razorpayKeyId?: string
    razorpayKeySecret?: string
  }
  seoSettings?: {
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string[]
    ogImage?: string
  }
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
  }
}

interface CurrencyActionBody {
  action: 'add' | 'remove' | 'setDefault'
  currency: ICurrency
}

// Helper function to verify admin access
async function verifyAdminAccess(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    throw new Error('Authentication required')
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
  const user = await User.findById(decoded.userId)

  if (!user || user.role !== 'admin') {
    throw new Error('Admin access required')
  }

  return user
}

// GET /api/admin/settings - Get current settings
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Verify admin access
    await verifyAdminAccess(request)

    const settings = await Settings.getSettings()

    return NextResponse.json({
      success: true,
      data: settings
    })

  } catch (error: any) {
    console.error('Get settings error:', error)

    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (error.message === 'Admin access required') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    // Verify admin access
    await verifyAdminAccess(request)

    const body: UpdateSettingsBody = await request.json()

    // Get current settings
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings()
    }

    // Update settings with type safety
    const allowedFields: (keyof UpdateSettingsBody)[] = [
      'siteName',
      'siteDescription',
      'defaultCurrency',
      'supportedCurrencies',
      'taxRate',
      'shippingRate',
      'freeShippingThreshold',
      'maintenanceMode',
      'emailSettings',
      'paymentSettings',
      'seoSettings',
      'socialMedia'
    ]

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        ;(settings as any)[field] = body[field]
      }
    })

    await settings.save()

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Settings updated successfully'
    })

  } catch (error: any) {
    console.error('Update settings error:', error)

    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (error.message === 'Admin access required') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

// POST /api/admin/settings/currency - Add or update currency
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Verify admin access
    await verifyAdminAccess(request)

    const body: CurrencyActionBody = await request.json()
    const { action, currency } = body

    // Validate input
    if (!action || !currency) {
      return NextResponse.json(
        { success: false, error: 'Action and currency are required' },
        { status: 400 }
      )
    }

    if (!['add', 'remove', 'setDefault'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be add, remove, or setDefault' },
        { status: 400 }
      )
    }

    const settings = await Settings.getSettings()

    if (action === 'add') {
      // Check if currency already exists
      const existingIndex = settings.supportedCurrencies.findIndex(
        (c: ICurrency) => c.code === currency.code
      )

      if (existingIndex >= 0) {
        // Update existing currency
        settings.supportedCurrencies[existingIndex] = currency
      } else {
        // Add new currency
        settings.supportedCurrencies.push(currency)
      }
    } else if (action === 'remove') {
      // Remove currency (but not if it's the default)
      if (currency.code === settings.defaultCurrency.code) {
        return NextResponse.json(
          { success: false, error: 'Cannot remove default currency' },
          { status: 400 }
        )
      }

      settings.supportedCurrencies = settings.supportedCurrencies.filter(
        (c: ICurrency) => c.code !== currency.code
      )
    } else if (action === 'setDefault') {
      // Set as default currency
      const currencyExists = settings.supportedCurrencies.find(
        (c: ICurrency) => c.code === currency.code
      )

      if (!currencyExists) {
        return NextResponse.json(
          { success: false, error: 'Currency not found in supported currencies' },
          { status: 400 }
        )
      }

      settings.defaultCurrency = currency
    }

    await settings.save()

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Currency settings updated successfully'
    })

  } catch (error: any) {
    console.error('Update currency error:', error)

    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (error.message === 'Admin access required') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update currency settings' },
      { status: 500 }
    )
  }
}
