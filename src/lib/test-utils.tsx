import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import type { VocabularyWord, Unit, Level, Lesson } from '@/lib/types'

// Mock data factories for consistent test data
export const createMockVocabularyWord = (overrides: Partial<VocabularyWord> = {}): VocabularyWord => ({
  id: 'vocab-1',
  word: 'test',
  definition: 'A test word',
  imageUrl: 'https://example.com/image.jpg',
  approved: true,
  createdAt: new Date('2024-01-01'),
  ...overrides,
})

export const createMockUnit = (overrides: Partial<Unit> = {}): Unit => ({
  id: 'unit-1',
  name: 'Test Unit',
  level: 'elementary',
  vocabulary: [createMockVocabularyWord()],
  createdAt: new Date('2024-01-01'),
  ...overrides,
})

export const createMockLevel = (overrides: Partial<Level> = {}): Level => ({
  id: 'level-1',
  name: 'Elementary',
  units: [createMockUnit()],
  ...overrides,
})

export const createMockLesson = (overrides: Partial<Lesson> = {}): Lesson => ({
  id: 'lesson-1',
  level: 'elementary',
  topic: 'Test Topic',
  vocabularyRows: [{
    id: 'row-1',
    searchTerm: 'test',
    pictures: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
  }],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
})

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Mock service functions
export const mockLessonService = {
  getAllLessons: jest.fn(),
  getLessonById: jest.fn(),
  saveLesson: jest.fn(),
  updateLesson: jest.fn(),
  deleteLesson: jest.fn(),
  getLessonsByLevel: jest.fn(),
  getLessonsByTopic: jest.fn(),
  getRecentLessons: jest.fn(),
}

export const mockImageService = {
  searchSingle: jest.fn(),
  searchBatch: jest.fn(),
  getImageUrls: jest.fn(),
}

// Mock hook functions
export const mockUseImageSearch = {
  searchSingle: jest.fn(),
  searchBatch: jest.fn(),
  isLoading: false,
  error: null,
  clearError: jest.fn(),
  getImageUrls: jest.fn(),
}
