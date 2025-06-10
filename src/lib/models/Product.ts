import mongoose, { Schema, Document } from 'mongoose'

export interface IProductVariant {
  id: string
  name: string
  price?: number
  comparePrice?: number
  sku?: string
  inventory: {
    quantity: number
    trackQuantity: boolean
  }
  options: {
    size?: string
    color?: string
    material?: string
  }
}

export interface IProduct extends Document {
  name: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  subCategory: string
  tags: string[]
  variants: IProductVariant[]
  inventory: {
    quantity: number
    trackQuantity: boolean
    allowBackorder: boolean
  }
  seo: {
    title?: string
    description?: string
    keywords?: string[]
  }
  status: 'active' | 'draft' | 'archived'
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const ProductVariantSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number },
  comparePrice: { type: Number },
  sku: { type: String },
  inventory: {
    quantity: { type: Number, default: 0 },
    trackQuantity: { type: Boolean, default: true },
  },
  options: {
    size: { type: String },
    color: { type: String },
    material: { type: String },
  },
})

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    comparePrice: {
      type: Number,
      min: [0, 'Compare price cannot be negative'],
    },
    images: [{
      type: String,
      required: true,
    }],
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['anime', 'streetwear', 'accessories', 'limited'],
      trim: true,
    },
    subCategory: {
      type: String,
      trim: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    variants: [ProductVariantSchema],
    inventory: {
      quantity: {
        type: Number,
        required: true,
        min: [0, 'Quantity cannot be negative'],
        default: 0,
      },
      trackQuantity: {
        type: Boolean,
        default: true,
      },
      allowBackorder: {
        type: Boolean,
        default: false,
      },
    },
    seo: {
      title: { type: String, maxlength: [60, 'SEO title cannot exceed 60 characters'] },
      description: { type: String, maxlength: [160, 'SEO description cannot exceed 160 characters'] },
      keywords: [{ type: String }],
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'draft',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    shipping: {
      weight: {
        type: Number,
        min: 0,
      },
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Indexes for better performance
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' })
ProductSchema.index({ category: 1, subCategory: 1 })
ProductSchema.index({ status: 1, featured: 1 })
ProductSchema.index({ price: 1 })
ProductSchema.index({ createdAt: -1 })

// Virtual for product URL slug
ProductSchema.virtual('slug').get(function() {
  return this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-')
})

// Pre-save middleware
ProductSchema.pre('save', function(next) {
  // Auto-generate SEO title if not provided
  if (!this.seo.title) {
    this.seo.title = this.name
  }
  
  // Auto-generate SEO description if not provided
  if (!this.seo.description) {
    this.seo.description = this.description.substring(0, 160)
  }
  
  next()
})

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)
export default Product
