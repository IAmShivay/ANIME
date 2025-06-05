import { apiSlice } from './apiSlice'
import { Product, PaginatedResponse } from '@/types'

interface GetProductsParams {
  page?: number
  limit?: number
  category?: string
  subCategory?: string
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
  featured?: boolean
  minPrice?: number
  maxPrice?: number
}

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, GetProductsParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString())
          }
        })

        return {
          url: `/products?${searchParams.toString()}`,
          method: 'GET',
        }
      },
      providesTags: ['Product'],
    }),

    getProduct: builder.query<{ success: boolean; data: Product }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    createProduct: builder.mutation<{ success: boolean; data: Product }, Partial<Product>>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),

    updateProduct: builder.mutation<{ success: boolean; data: Product }, { id: string; product: Partial<Product> }>({
      query: ({ id, product }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),

    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    getFeaturedProducts: builder.query<PaginatedResponse<Product>, { limit?: number }>({
      query: ({ limit = 6 } = {}) => ({
        url: `/products?featured=true&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Product'],
    }),

    getProductsByCategory: builder.query<PaginatedResponse<Product>, { category: string; limit?: number }>({
      query: ({ category, limit = 12 }) => ({
        url: `/products?category=${category}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Product'],
    }),

    searchProducts: builder.query<PaginatedResponse<Product>, { query: string; limit?: number }>({
      query: ({ query, limit = 12 }) => ({
        url: `/products?search=${encodeURIComponent(query)}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Product'],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetFeaturedProductsQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
} = productsApi
