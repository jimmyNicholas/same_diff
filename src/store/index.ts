import { configureStore } from '@reduxjs/toolkit'
import { vocabularySlice } from './slices/vocabularySlice'
import { imageApi } from './api/imageApi'

export const store = configureStore({
  reducer: {
    vocabulary: vocabularySlice.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(imageApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch