import mongoose, { Schema, Document } from 'mongoose'

export interface IOrderItem {
  product: mongoose.Types.ObjectId
  variant?: {
    id: string
    name: string
    options: {
      size?: string
      color?: string
      material?: string
    }
  }
  quantity: number
  price: number
  total: number
}

export interface IOrder extends Document {
  orderNumber: string
  user: mongoose.Types.ObjectId
  items: IOrderItem[]
  shippingAddress: {
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    zipCode: string
    country: string
    phone?: string
  }
  billingAddress: {
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    zipCode: string
    country: string
    phone?: string
  }
  paymentMethod: {
    type: 'razorpay' | 'cod'
    transactionId?: string
    status: 'pending' | 'completed' | 'failed'
    razorpayOrderId?: string
    razorpayPaymentId?: string
    razorpaySignature?: string
  }
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  pricing: {
    subtotal: number
    shipping: number
    tax: number
    discount: number
    total: number
  }
  tracking?: {
    carrier: string
    trackingNumber: string
    url?: string
    estimatedDelivery?: Date
  }
  notes?: string
  cancelReason?: string
  refundAmount?: number
  refundStatus?: 'none' | 'partial' | 'full'
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  variant: {
    id: { type: String },
    name: { type: String },
    options: {
      size: { type: String },
      color: { type: String },
      material: { type: String },
    },
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative'],
  },
})

const AddressSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  company: { type: String, trim: true },
  address1: { type: String, required: true, trim: true },
  address2: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  zipCode: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
})

const OrderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [OrderItemSchema],
    shippingAddress: {
      type: AddressSchema,
      required: true,
    },
    billingAddress: {
      type: AddressSchema,
      required: true,
    },
    paymentMethod: {
      type: {
        type: String,
        enum: ['razorpay', 'cod'],
        required: true,
      },
      transactionId: { type: String },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
      },
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: [0, 'Subtotal cannot be negative'],
      },
      shipping: {
        type: Number,
        required: true,
        min: [0, 'Shipping cost cannot be negative'],
        default: 0,
      },
      tax: {
        type: Number,
        required: true,
        min: [0, 'Tax cannot be negative'],
        default: 0,
      },
      discount: {
        type: Number,
        min: [0, 'Discount cannot be negative'],
        default: 0,
      },
      total: {
        type: Number,
        required: true,
        min: [0, 'Total cannot be negative'],
      },
    },
    tracking: {
      carrier: { type: String },
      trackingNumber: { type: String },
      url: { type: String },
      estimatedDelivery: { type: Date },
    },
    notes: { type: String, maxlength: [500, 'Notes cannot exceed 500 characters'] },
    cancelReason: { type: String },
    refundAmount: { type: Number, min: [0, 'Refund amount cannot be negative'] },
    refundStatus: {
      type: String,
      enum: ['none', 'partial', 'full'],
      default: 'none',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Indexes
OrderSchema.index({ orderNumber: 1 })
OrderSchema.index({ user: 1, createdAt: -1 })
OrderSchema.index({ orderStatus: 1 })
OrderSchema.index({ 'paymentMethod.status': 1 })
OrderSchema.index({ createdAt: -1 })

// Pre-save middleware to generate order number
OrderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    this.orderNumber = `ORD-${timestamp}-${random}`
  }
  next()
})

// Virtual for order total items count
OrderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total: number, item: any) => total + (item.quantity || 0), 0)
})

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
