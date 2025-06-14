import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IOTP extends Document {
  email: string
  otp: string
  type: 'signup' | 'password-reset' | 'email-verification'
  isUsed: boolean
  expiresAt: Date
  attempts: number
  maxAttempts: number
  createdAt: Date
  updatedAt: Date
  isExpired: boolean
  isValid: boolean
  verify(inputOTP: string): Promise<boolean>
}

export interface IOTPModel extends Model<IOTP> {
  generateOTP(): string
  createOTP(email: string, type?: string): Promise<IOTP>
  verifyOTP(email: string, inputOTP: string, type?: string): Promise<boolean>
  cleanupExpired(): Promise<any>
}

const OTPSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    otp: {
      type: String,
      required: true,
      length: 6
    },
    type: {
      type: String,
      required: true,
      enum: ['signup', 'password-reset', 'email-verification'],
      default: 'signup'
    },
    isUsed: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      index: { expireAfterSeconds: 0 }
    },
    attempts: {
      type: Number,
      default: 0
    },
    maxAttempts: {
      type: Number,
      default: 3
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Compound index for email and type
OTPSchema.index({ email: 1, type: 1 })

// Virtual for checking if OTP is expired
OTPSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt
})

// Virtual for checking if OTP is valid
OTPSchema.virtual('isValid').get(function() {
  const isExpired = new Date() > this.expiresAt
  return !this.isUsed && !isExpired && this.attempts < this.maxAttempts
})

// Static method to generate OTP
OTPSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Static method to create new OTP
OTPSchema.statics.createOTP = async function(email: string, type: string = 'signup') {
  // Remove any existing OTPs for this email and type
  await this.deleteMany({ email, type })

  const otp = (this as any).generateOTP()
  
  return await this.create({
    email,
    otp,
    type
  })
}

// Method to verify OTP
OTPSchema.methods.verify = async function(inputOTP: string) {
  // Check if OTP is still valid
  if (!this.isValid) {
    if (this.isUsed) {
      throw new Error('OTP has already been used')
    }
    if (this.isExpired) {
      throw new Error('OTP has expired')
    }
    if (this.attempts >= this.maxAttempts) {
      throw new Error('Maximum verification attempts exceeded')
    }
  }
  
  // Increment attempts
  this.attempts += 1
  await this.save()
  
  // Check if OTP matches
  if (this.otp !== inputOTP) {
    throw new Error('Invalid OTP')
  }
  
  // Mark as used
  this.isUsed = true
  await this.save()
  
  return true
}

// Static method to verify OTP
OTPSchema.statics.verifyOTP = async function(email: string, inputOTP: string, type: string = 'signup') {
  const otpDoc = await this.findOne({
    email,
    type,
    isUsed: false
  }).sort({ createdAt: -1 })
  
  if (!otpDoc) {
    throw new Error('No valid OTP found for this email')
  }
  
  return await otpDoc.verify(inputOTP)
}

// Static method to cleanup expired OTPs
OTPSchema.statics.cleanupExpired = async function() {
  return await this.deleteMany({
    expiresAt: { $lt: new Date() }
  })
}

export default (mongoose.models.OTP as IOTPModel) || mongoose.model<IOTP, IOTPModel>('OTP', OTPSchema)
