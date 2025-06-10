import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Settings from '@/lib/models/Settings'

// GET /api/settings - Get public settings (no auth required)
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const settings = await Settings.getSettings()
    
    // Return only public settings
    const publicSettings = {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      defaultCurrency: settings.defaultCurrency,
      supportedCurrencies: settings.supportedCurrencies,
      taxRate: settings.taxRate,
      shippingRate: settings.shippingRate,
      freeShippingThreshold: settings.freeShippingThreshold,
      paymentSettings: {
        razorpayEnabled: settings.paymentSettings.razorpayEnabled,
        codEnabled: settings.paymentSettings.codEnabled
      },
      seoSettings: settings.seoSettings,
      socialMedia: settings.socialMedia
    }
    
    return NextResponse.json({
      success: true,
      data: publicSettings
    })
    
  } catch (error: any) {
    console.error('Get public settings error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}
