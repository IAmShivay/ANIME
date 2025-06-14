import { Currency } from '@/store/slices/settingsSlice'

/**
 * Format currency with proper symbol and locale
 */
export function formatCurrency(
  amount: number, 
  currency?: Currency | null,
  options?: {
    showSymbol?: boolean
    locale?: string
  }
): string {
  const { showSymbol = true, locale = 'en-IN' } = options || {}
  
  // Default to INR if no currency provided
  const defaultCurrency: Currency = {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    exchangeRate: 1
  }
  
  const curr = currency || defaultCurrency
  
  if (!showSymbol) {
    return amount.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }
  
  return `${curr.symbol}${amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

/**
 * Convert amount from one currency to another
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  if (fromCurrency.code === toCurrency.code) {
    return amount
  }
  
  // Convert to base currency (INR) first, then to target currency
  const baseAmount = amount / fromCurrency.exchangeRate
  return baseAmount * toCurrency.exchangeRate
}

/**
 * Format price with currency conversion
 */
export function formatPrice(
  amount: number,
  fromCurrency: Currency,
  toCurrency?: Currency | null,
  options?: {
    showSymbol?: boolean
    locale?: string
  }
): string {
  if (!toCurrency) {
    return formatCurrency(amount, fromCurrency, options)
  }
  
  const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency)
  return formatCurrency(convertedAmount, toCurrency, options)
}

/**
 * Parse currency string to number
 */
export function parseCurrency(currencyString: string): number {
  // Remove currency symbols and spaces, then parse
  const cleanString = currencyString.replace(/[₹$€£¥,\s]/g, '')
  return parseFloat(cleanString) || 0
}

/**
 * Get currency symbol by code
 */
export function getCurrencySymbol(currencyCode: string): string {
  const symbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    CNY: '¥',
    SEK: 'kr',
    NZD: 'NZ$'
  }
  
  return symbols[currencyCode] || currencyCode
}

/**
 * Validate currency object
 */
export function isValidCurrency(currency: any): currency is Currency {
  return (
    currency &&
    typeof currency === 'object' &&
    typeof currency.code === 'string' &&
    typeof currency.symbol === 'string' &&
    typeof currency.name === 'string' &&
    typeof currency.exchangeRate === 'number' &&
    currency.exchangeRate > 0
  )
}

/**
 * Format currency for display in different contexts
 */
export function formatCurrencyForContext(
  amount: number,
  currency: Currency | null,
  context: 'cart' | 'product' | 'order' | 'admin' = 'product'
): string {
  switch (context) {
    case 'cart':
      return formatCurrency(amount, currency, { locale: 'en-IN' })
    case 'product':
      return formatCurrency(amount, currency, { locale: 'en-IN' })
    case 'order':
      return formatCurrency(amount, currency, { locale: 'en-IN' })
    case 'admin':
      return formatCurrency(amount, currency, { locale: 'en-IN' })
    default:
      return formatCurrency(amount, currency)
  }
}

/**
 * Calculate tax amount
 */
export function calculateTax(amount: number, taxRate: number): number {
  return amount * taxRate
}

/**
 * Calculate shipping cost
 */
export function calculateShipping(
  amount: number,
  shippingRate: number,
  freeShippingThreshold: number
): number {
  return amount >= freeShippingThreshold ? 0 : shippingRate
}

/**
 * Calculate total with tax and shipping
 */
export function calculateTotal(
  subtotal: number,
  taxRate: number,
  shippingRate: number,
  freeShippingThreshold: number
): {
  subtotal: number
  tax: number
  shipping: number
  total: number
} {
  const tax = calculateTax(subtotal, taxRate)
  const shipping = calculateShipping(subtotal, shippingRate, freeShippingThreshold)
  const total = subtotal + tax + shipping
  
  return {
    subtotal,
    tax,
    shipping,
    total
  }
}
