import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICurrency {
  code: string // USD, EUR, INR, etc.
  symbol: string // $, €, ₹, etc.
  name: string // US Dollar, Euro, Indian Rupee
  exchangeRate: number // Rate relative to base currency (USD)
}

export interface ISettings extends Document {
  siteName: string
  siteDescription: string
  defaultCurrency: ICurrency
  supportedCurrencies: ICurrency[]
  taxRate: number
  shippingRate: number
  freeShippingThreshold: number
  maintenanceMode: boolean
  emailSettings: {
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPassword: string
    fromEmail: string
    fromName: string
  }
  paymentSettings: {
    razorpayEnabled: boolean
    codEnabled: boolean
    razorpayKeyId: string
    razorpayKeySecret: string
  }
  seoSettings: {
    metaTitle: string
    metaDescription: string
    metaKeywords: string[]
    ogImage: string
  }
  socialMedia: {
    facebook: string
    instagram: string
    twitter: string
    youtube: string
  }
  createdAt: Date
  updatedAt: Date
  formatCurrency(amount: number, currencyCode?: string): string
  convertCurrency(amount: number, fromCode: string, toCode: string): number
}

// Interface for the Settings model with static methods
export interface ISettingsModel extends Model<ISettings> {
  getSettings(): Promise<ISettings>
}

const CurrencySchema = new Schema({
  code: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  symbol: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  exchangeRate: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  }
})

const SettingsSchema = new Schema(
  {
    siteName: {
      type: String,
      required: true,
      default: 'Bindass',
      trim: true
    },
    siteDescription: {
      type: String,
      default: 'Premium Anime Fashion & Streetwear',
      trim: true
    },
    defaultCurrency: {
      type: CurrencySchema,
      required: true,
      default: {
        code: 'INR',
        symbol: '₹',
        name: 'Indian Rupee',
        exchangeRate: 1
      }
    },
    supportedCurrencies: {
      type: [CurrencySchema],
      default: [
        {
          code: 'INR',
          symbol: '₹',
          name: 'Indian Rupee',
          exchangeRate: 1
        },
        {
          code: 'USD',
          symbol: '$',
          name: 'US Dollar',
          exchangeRate: 0.012
        },
        {
          code: 'EUR',
          symbol: '€',
          name: 'Euro',
          exchangeRate: 0.011
        }
      ]
    },
    taxRate: {
      type: Number,
      default: 0.18, // 18% GST for India
      min: 0,
      max: 1
    },
    shippingRate: {
      type: Number,
      default: 50, // ₹50 shipping
      min: 0
    },
    freeShippingThreshold: {
      type: Number,
      default: 1000, // Free shipping above ₹1000
      min: 0
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    emailSettings: {
      smtpHost: { type: String, default: '' },
      smtpPort: { type: Number, default: 587 },
      smtpUser: { type: String, default: '' },
      smtpPassword: { type: String, default: '' },
      fromEmail: { type: String, default: 'noreply@bindass.com' },
      fromName: { type: String, default: 'Bindass' }
    },
    paymentSettings: {
      razorpayEnabled: { type: Boolean, default: true },
      codEnabled: { type: Boolean, default: true },
      razorpayKeyId: { type: String, default: '' },
      razorpayKeySecret: { type: String, default: '' }
    },
    seoSettings: {
      metaTitle: { type: String, default: 'Bindass - Premium Anime Fashion' },
      metaDescription: { type: String, default: 'Discover premium anime fashion and streetwear at Bindass' },
      metaKeywords: { type: [String], default: ['anime', 'fashion', 'streetwear', 'clothing'] },
      ogImage: { type: String, default: '' }
    },
    socialMedia: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Ensure only one settings document exists
SettingsSchema.index({}, { unique: true })

// Static method to get settings (singleton pattern)
SettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne()
  if (!settings) {
    settings = await this.create({})
  }
  return settings
}

// Method to format currency
SettingsSchema.methods.formatCurrency = function(amount: number, currencyCode?: string) {
  const currency = currencyCode 
    ? this.supportedCurrencies.find((c: ICurrency) => c.code === currencyCode) || this.defaultCurrency
    : this.defaultCurrency
  
  return `${currency.symbol}${amount.toLocaleString()}`
}

// Method to convert currency
SettingsSchema.methods.convertCurrency = function(amount: number, fromCode: string, toCode: string) {
  const fromCurrency = this.supportedCurrencies.find((c: ICurrency) => c.code === fromCode)
  const toCurrency = this.supportedCurrencies.find((c: ICurrency) => c.code === toCode)
  
  if (!fromCurrency || !toCurrency) {
    return amount
  }
  
  // Convert to base currency (INR) first, then to target currency
  const baseAmount = amount / fromCurrency.exchangeRate
  return baseAmount * toCurrency.exchangeRate
}

export default (mongoose.models.Settings as ISettingsModel) || mongoose.model<ISettings, ISettingsModel>('Settings', SettingsSchema)
