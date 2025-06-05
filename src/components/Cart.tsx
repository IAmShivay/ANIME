'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  selectCartItems, 
  selectCartTotal, 
  selectCartItemsCount, 
  selectCartIsOpen,
  setCartOpen,
  updateQuantity,
  removeFromCart,
  clearCart
} from '@/store/slices/cartSlice'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

export const Cart = () => {
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const cartTotal = useSelector(selectCartTotal)
  const cartItemsCount = useSelector(selectCartItemsCount)
  const isOpen = useSelector(selectCartIsOpen)

  const handleClose = () => {
    dispatch(setCartOpen(false))
  }

  const handleUpdateQuantity = (id: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      handleRemoveItem(id, size, color)
      return
    }
    dispatch(updateQuantity({ id, quantity, size, color }))
  }

  const handleRemoveItem = (id: string, size?: string, color?: string) => {
    dispatch(removeFromCart({ id, size, color }))
    toast.success('Item removed from cart')
  }

  const handleClearCart = () => {
    dispatch(clearCart())
    toast.success('Cart cleared')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Shopping Cart ({cartItemsCount})
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6">Add some items to get started!</p>
                  <Link href="/shop">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClose}
                      className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Continue Shopping
                    </motion.button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}-${item.color}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        {(item.size || item.color) && (
                          <p className="text-xs text-gray-600">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && ' • '}
                            {item.color && `Color: ${item.color}`}
                          </p>
                        )}
                        <p className="text-sm font-bold text-purple-600">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                          disabled={item.quantity >= item.maxQuantity}
                          className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                        className="p-2 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </motion.div>
                  ))}

                  {cartItems.length > 1 && (
                    <button
                      onClick={handleClearCart}
                      className="w-full py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-purple-600">${cartTotal.toFixed(2)}</span>
                </div>

                <div className="space-y-3">
                  <Link href="/checkout">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Proceed to Checkout
                    </motion.button>
                  </Link>
                  
                  <Link href="/shop">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="w-full py-3 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Continue Shopping
                    </motion.button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
