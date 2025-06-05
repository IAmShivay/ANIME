import mongoose, { Schema, Document } from 'mongoose'

export interface IPolicy extends Document {
  type: 'privacy' | 'terms' | 'refund' | 'shipping'
  title: string
  content: string
  lastUpdated: Date
  version: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const PolicySchema = new Schema(
  {
    type: {
      type: String,
      enum: ['privacy', 'terms', 'refund', 'shipping'],
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Policy title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Policy content is required'],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    version: {
      type: String,
      required: true,
      default: '1.0',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Indexes
PolicySchema.index({ type: 1 })
PolicySchema.index({ isActive: 1 })

// Pre-save middleware to update version and lastUpdated
PolicySchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.lastUpdated = new Date()
    
    // Increment version number
    const currentVersion = parseFloat(this.version)
    this.version = (currentVersion + 0.1).toFixed(1)
  }
  next()
})

export default mongoose.models.Policy || mongoose.model<IPolicy>('Policy', PolicySchema)
