import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ImageSearchResult } from '@/lib/types'

export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/images',
  }),
  endpoints: (builder) => ({
    searchImages: builder.query<ImageSearchResult, { query: string; page?: number; limit?: number }>({
      query: ({ query, page = 1, limit = 5 }) => 
        `search?q=${query}&page=${page}&limit=${limit}`,
    }),
  }),
})

export const { useSearchImagesQuery } = imageApi