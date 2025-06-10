/**
 * Currency utility functions for the application
 */

export const CURRENCY = {
  symbol: '₹',
  code: 'INR',
  name: 'Indian Rupee'
}

/**
 * Format price in Indian Rupees
 * @param price - Price in number format
 * @param showSymbol - Whether to show currency symbol (default: true)
 * @returns Formatted price string
 */
export const formatPrice = (price: number, showSymbol: boolean = true): string => {
  if (isNaN(price) || price < 0) {
    return showSymbol ? `${CURRENCY.symbol}0` : '0'
  }

  // Format number with Indian number system (lakhs, crores)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: CURRENCY.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  if (showSymbol) {
    return formatter.format(price)
  } else {
    return formatter.format(price)
  }
}

/**
 * Convert USD to INR (approximate conversion for demo)
 * @param usdPrice - Price in USD
 * @returns Price in INR
 */
export const convertUSDToINR = (usdPrice: number): number => {
  const exchangeRate = 83 // Approximate USD to INR rate
  return Math.round(usdPrice * exchangeRate)
}

/**
 * Format price range
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @returns Formatted price range string
 */
export const formatPriceRange = (minPrice: number, maxPrice: number): string => {
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
}

/**
 * Calculate discount percentage
 * @param originalPrice - Original price
 * @param salePrice - Sale price
 * @returns Discount percentage
 */
export const calculateDiscount = (originalPrice: number, salePrice: number): number => {
  if (originalPrice <= salePrice) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

/**
 * Format discount text
 * @param originalPrice - Original price
 * @param salePrice - Sale price
 * @returns Formatted discount text
 */
export const formatDiscount = (originalPrice: number, salePrice: number): string => {
  const discount = calculateDiscount(originalPrice, salePrice)
  return discount > 0 ? `${discount}% OFF` : ''
}
