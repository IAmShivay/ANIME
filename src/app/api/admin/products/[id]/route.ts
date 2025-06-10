import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { requireAdmin } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    // Verify admin token
    const user = await requireAdmin(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const product = await Product.findById(params.id).lean()

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
    })

  } catch (error: any) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    // Verify admin token
    const user = await requireAdmin(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      price,
      comparePrice,
      category,
      subCategory,
      images,
      variants,
      tags,
      status,
      featured,
      trackQuantity,
      quantity,
      weight,
      dimensions,
      seo
    } = body

    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update product
    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        name,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
        category,
        subCategory,
        images: images || [],
        variants: variants || [],
        tags: tags || [],
        status: status || 'draft',
        featured: featured || false,
        inventory: {
          trackQuantity: trackQuantity !== false,
          quantity: trackQuantity ? parseInt(quantity) || 0 : null,
          sku: `BIND-${category.toUpperCase()}-${Date.now()}`
        },
        shipping: {
          weight: weight ? parseFloat(weight) : undefined,
          dimensions: dimensions || {}
        },
        seo: seo || {},
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    })

  } catch (error: any) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    // Verify admin token
    const user = await requireAdmin(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete product
    const product = await Product.findByIdAndDelete(params.id)

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
