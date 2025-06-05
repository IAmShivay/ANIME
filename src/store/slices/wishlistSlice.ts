import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  subCategory: string
}

interface WishlistState {
  items: WishlistItem[]
  totalItems: number
}

const initialState: WishlistState = {
  items: [],
  totalItems: 0,
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      
      if (!existingItem) {
        state.items.push(action.payload)
        state.totalItems = state.items.length
      }
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      state.totalItems = state.items.length
    },

    clearWishlist: (state) => {
      state.items = []
      state.totalItems = 0
    },

    toggleWishlistItem: (state, action: PayloadAction<WishlistItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      
      if (existingItem) {
        state.items = state.items.filter((item) => item.id !== action.payload.id)
      } else {
        state.items.push(action.payload)
      }
      
      state.totalItems = state.items.length
    },
  },
})

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleWishlistItem,
} = wishlistSlice.actions

export default wishlistSlice.reducer

export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist.items
export const selectWishlistItemsCount = (state: { wishlist: WishlistState }) => state.wishlist.totalItems
export const selectIsInWishlist = (productId: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist.items.some((item) => item.id === productId)
