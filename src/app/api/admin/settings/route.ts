import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Settings from '@/lib/models/Settings'
import User from '@/lib/models/User'
import jwt from 'jsonwebtoken'

// GET /api/admin/settings - Get current settings
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Get user from token
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await User.findById(decoded.userId)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }
    
    const settings = await Settings.getSettings()
    
    return NextResponse.json({
      success: true,
      data: settings
    })
    
  } catch (error: any) {
    console.error('Get settings error:', error)
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
    
    // Get user from token
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await User.findById(decoded.userId)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    // Get current settings
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings()
    }
    
    // Update settings
    Object.keys(body).forEach(key => {
      if (body[key] !== undefined) {
        settings[key] = body[key]
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
    
    // Get user from token
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await User.findById(decoded.userId)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }
    
    const { action, currency } = await request.json()
    
    const settings = await Settings.getSettings()
    
    if (action === 'add') {
      // Check if currency already exists
      const existingIndex = settings.supportedCurrencies.findIndex(
        (c: any) => c.code === currency.code
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
        (c: any) => c.code !== currency.code
      )
    } else if (action === 'setDefault') {
      // Set as default currency
      const currencyExists = settings.supportedCurrencies.find(
        (c: any) => c.code === currency.code
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
    return NextResponse.json(
      { success: false, error: 'Failed to update currency settings' },
      { status: 500 }
    )
  }
}
