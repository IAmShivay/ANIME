import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../index'

export interface Currency {
  code: string
  symbol: string
  name: string
  exchangeRate: number
}

export interface PublicSettings {
  siteName: string
  siteDescription: string
  defaultCurrency: Currency
  supportedCurrencies: Currency[]
  taxRate: number
  shippingRate: number
  freeShippingThreshold: number
  paymentSettings: {
    razorpayEnabled: boolean
    codEnabled: boolean
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
}

interface SettingsState {
  settings: PublicSettings | null
  currentCurrency: Currency | null
  isLoading: boolean
  error: string | null
}

const initialState: SettingsState = {
  settings: null,
  currentCurrency: null,
  isLoading: false,
  error: null
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setSettings: (state, action: PayloadAction<PublicSettings>) => {
      state.settings = action.payload
      // Set current currency to default if not already set
      if (!state.currentCurrency) {
        state.currentCurrency = action.payload.defaultCurrency
      }
      state.error = null
    },
    setCurrentCurrency: (state, action: PayloadAction<Currency>) => {
      state.currentCurrency = action.payload
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedCurrency', JSON.stringify(action.payload))
      }
    },
    restoreCurrency: (state) => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('selectedCurrency')
        if (stored) {
          try {
            const currency = JSON.parse(stored)
            // Verify currency is still supported
            if (state.settings?.supportedCurrencies.find(c => c.code === currency.code)) {
              state.currentCurrency = currency
            } else {
              // Fallback to default if stored currency is no longer supported
              state.currentCurrency = state.settings?.defaultCurrency || null
            }
          } catch (error) {
            console.error('Failed to restore currency:', error)
            state.currentCurrency = state.settings?.defaultCurrency || null
          }
        }
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },
    clearError: (state) => {
      state.error = null
    }
  }
})

export const {
  setLoading,
  setSettings,
  setCurrentCurrency,
  restoreCurrency,
  setError,
  clearError
} = settingsSlice.actions

// Selectors
export const selectSettings = (state: RootState) => state.settings.settings
export const selectCurrentCurrency = (state: RootState) => state.settings.currentCurrency
export const selectSupportedCurrencies = (state: RootState) => state.settings.settings?.supportedCurrencies || []
export const selectIsLoading = (state: RootState) => state.settings.isLoading
export const selectError = (state: RootState) => state.settings.error

// Helper selectors
export const selectCurrencySymbol = (state: RootState) => state.settings.currentCurrency?.symbol || '₹'
export const selectTaxRate = (state: RootState) => state.settings.settings?.taxRate || 0.18
export const selectShippingRate = (state: RootState) => state.settings.settings?.shippingRate || 50
export const selectFreeShippingThreshold = (state: RootState) => state.settings.settings?.freeShippingThreshold || 1000

// Currency formatting helper
export const formatCurrency = (amount: number, currency?: Currency) => {
  if (!currency) return `₹${amount.toLocaleString()}`
  return `${currency.symbol}${amount.toLocaleString()}`
}

// Currency conversion helper
export const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  defaultCurrency: Currency
) => {
  if (fromCurrency.code === toCurrency.code) return amount
  
  // Convert to base currency first, then to target currency
  const baseAmount = amount / fromCurrency.exchangeRate
  return baseAmount * toCurrency.exchangeRate
}

export default settingsSlice.reducer
