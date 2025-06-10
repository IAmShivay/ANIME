import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
  maxQuantity: number
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  isOpen: boolean
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isOpen: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'maxQuantity'> & { maxQuantity?: number }>) => {
      const { quantity = 1, maxQuantity = 99, ...itemData } = action.payload

      const existingItem = state.items.find(
        (item) =>
          item.id === itemData.id &&
          item.size === itemData.size &&
          item.color === itemData.color
      )

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
        existingItem.quantity = Math.min(newQuantity, existingItem.maxQuantity)
      } else {
        state.items.push({
          ...itemData,
          quantity,
          maxQuantity
        })
      }

      cartSlice.caseReducers.calculateTotals(state)
    },

    removeFromCart: (state, action: PayloadAction<{ id: string; size?: string; color?: string }>) => {
      state.items = state.items.filter(
        (item) => 
          !(item.id === action.payload.id && 
            item.size === action.payload.size && 
            item.color === action.payload.color)
      )
      cartSlice.caseReducers.calculateTotals(state)
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number; size?: string; color?: string }>
    ) => {
      const item = state.items.find(
        (item) => 
          item.id === action.payload.id && 
          item.size === action.payload.size && 
          item.color === action.payload.color
      )

      if (item) {
        item.quantity = Math.min(Math.max(1, action.payload.quantity), item.maxQuantity)
      }

      cartSlice.caseReducers.calculateTotals(state)
    },

    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalAmount = 0
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload
    },

    calculateTotals: (state) => {
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
  calculateTotals,
} = cartSlice.actions

export default cartSlice.reducer

export const selectCartItems = (state: { cart: CartState }) => state.cart.items
export const selectCartTotal = (state: { cart: CartState }) => state.cart.totalAmount
export const selectCartItemsCount = (state: { cart: CartState }) => state.cart.totalItems
export const selectCartIsOpen = (state: { cart: CartState }) => state.cart.isOpen
