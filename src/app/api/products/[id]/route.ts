import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import mongoose from 'mongoose'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/products/[id] - Get a single product
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB()

    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid product ID',
        },
        { status: 400 }
      )
    }

    const product = await Product.findById(id).lean()

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error: any) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update a product (Admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB()

    const { id } = params
    const body = await request.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid product ID',
        },
        { status: 400 }
      )
    }

    // TODO: Add authentication middleware to check if user is admin

    const product = await Product.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating product:', error)
    
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
        error: 'Failed to update product',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete a product (Admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB()

    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid product ID',
        },
        { status: 400 }
      )
    }

    // TODO: Add authentication middleware to check if user is admin

    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete product',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
