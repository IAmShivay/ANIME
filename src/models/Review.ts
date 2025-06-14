import mongoose, { Document, Model } from 'mongoose'

// Define interfaces
export interface IReview extends Document {
  user: mongoose.Types.ObjectId
  order: mongoose.Types.ObjectId
  product?: mongoose.Types.ObjectId
  rating: number
  title: string
  comment: string
  images: Array<{
    url: string
    alt: string
  }>
  isVerifiedPurchase: boolean
  isApproved: boolean
  isFeatured: boolean
  helpfulVotes: number
  reportCount: number
  adminResponse?: {
    message: string
    respondedAt: Date
    respondedBy: mongoose.Types.ObjectId
  }
  createdAt: Date
  updatedAt: Date
}

export interface IReviewModel extends Model<IReview> {
  getReviewStats(productId?: string): Promise<{
    totalReviews: number
    averageRating: number
    ratingCounts: {
      5: number
      4: number
      3: number
      2: number
      1: number
    }
  }>
}

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false // Can be null for general store reviews
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  images: [{
    url: String,
    alt: String
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false // Reviews need admin approval
  },
  isFeatured: {
    type: Boolean,
    default: false // Featured reviews show on homepage
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  },
  adminResponse: {
    message: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
})

// Indexes for better performance
reviewSchema.index({ user: 1, product: 1 }, { unique: true, sparse: true })
reviewSchema.index({ product: 1, isApproved: 1 })
reviewSchema.index({ isApproved: 1, isFeatured: 1 })
reviewSchema.index({ rating: 1 })
reviewSchema.index({ createdAt: -1 })

// Virtual for user details
reviewSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
})

// Virtual for product details
reviewSchema.virtual('productDetails', {
  ref: 'Product',
  localField: 'product',
  foreignField: '_id',
  justOne: true
})

// Virtual for order details
reviewSchema.virtual('orderDetails', {
  ref: 'Order',
  localField: 'order',
  foreignField: '_id',
  justOne: true
})

// Ensure virtual fields are serialized
reviewSchema.set('toJSON', { virtuals: true })
reviewSchema.set('toObject', { virtuals: true })

// Pre-save middleware to validate verified purchase
reviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const Order = mongoose.model('Order')
      const order = await Order.findOne({
        _id: this.order,
        user: this.user,
        orderStatus: { $in: ['delivered'] }
      })
      
      if (!order) {
        throw new Error('Can only review products from completed orders')
      }
      
      // If product is specified, verify it was in the order
      if (this.product) {
        const productInOrder = order.items.some((item: any) =>
          item.product && item.product.toString() === this.product?.toString()
        )

        if (!productInOrder) {
          throw new Error('Can only review products you have purchased')
        }
      }
    } catch (error: any) {
      return next(error)
    }
  }
  next()
})

// Static method to get review statistics
reviewSchema.statics.getReviewStats = async function(productId?: string) {
  const match: any = { isApproved: true }
  if (productId) {
    match.product = new mongoose.Types.ObjectId(productId)
  }
  
  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    },
    {
      $project: {
        totalReviews: 1,
        averageRating: { $round: ['$averageRating', 1] },
        ratingCounts: {
          5: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 5] } } } },
          4: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 4] } } } },
          3: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 3] } } } },
          2: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 2] } } } },
          1: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 1] } } } }
        }
      }
    }
  ])
  
  return stats[0] || {
    totalReviews: 0,
    averageRating: 0,
    ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  }
}

const Review = (mongoose.models.Review as IReviewModel) || mongoose.model<IReview, IReviewModel>('Review', reviewSchema)
export default Review
export { Review }
