import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { requireAdmin } from '@/lib/auth'

// Define interfaces
interface AdminProductQuery {
  category?: string
  status?: string
  $or?: Array<{
    name?: { $regex: string; $options: string }
    description?: { $regex: string; $options: string }
    tags?: { $in: RegExp[] }
  }>
}

interface CreateProductRequest {
  name: string
  description: string
  price: string | number
  comparePrice?: string | number
  category: string
  subCategory?: string
  images?: string[]
  variants?: any[]
  tags?: string[]
  status?: string
  featured?: boolean
  trackQuantity?: boolean
  quantity?: string | number
  weight?: string | number
  dimensions?: any
  seo?: any
}

interface UpdateProductRequest {
  id: string
  [key: string]: any
}

interface AdminProductSuccessResponse {
  success: true
  data?: any
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
  message?: string
}

interface AdminProductErrorResponse {
  success: false
  error: string
}

export async function GET(request: NextRequest): Promise<NextResponse<AdminProductSuccessResponse | AdminProductErrorResponse>> {
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Build query with proper typing
    const query: AdminProductQuery = {}
    
    if (category) {
      query.category = category
    }
    
    if (status) {
      query.status = status
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    // Get products with pagination
    const skip = (page - 1) * limit
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Product.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<AdminProductSuccessResponse | AdminProductErrorResponse>> {
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

    const body: CreateProductRequest = await request.json()
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

    // Generate SKU
    const sku = `BIND-${category.toUpperCase()}-${Date.now()}`

    // Create product with proper type conversion
    const product = new Product({
      name,
      description,
      price: typeof price === 'string' ? parseFloat(price) : price,
      comparePrice: comparePrice ? (typeof comparePrice === 'string' ? parseFloat(comparePrice) : comparePrice) : undefined,
      category,
      subCategory,
      images: images || [],
      variants: variants || [],
      tags: tags || [],
      status: status || 'draft',
      featured: featured || false,
      inventory: {
        trackQuantity: trackQuantity !== false,
        quantity: trackQuantity ? (quantity ? (typeof quantity === 'string' ? parseInt(quantity) : quantity) || 0 : 0) : null,
        sku
      },
      shipping: {
        weight: weight ? (typeof weight === 'string' ? parseFloat(weight) : weight) : undefined,
        dimensions: dimensions || {}
      },
      seo: seo || {},
      createdBy: user.userId
    })

    await product.save()

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Update product
    const product = await Product.findByIdAndUpdate(
      id,
      {
        ...updateData,
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

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Delete product
    const product = await Product.findByIdAndDelete(id)

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
