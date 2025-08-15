import { imageService, type ImageSearchResult, type BatchImageSearchResult, type UnsplashImage } from '../imageService'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('ImageService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset environment variable
    delete process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
  })

  describe('isConfigured', () => {
    beforeEach(() => {
      // Ensure access key is not set for isConfigured tests
      delete process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
    })

    it('should return false when access key is not set', async () => {
      // Ensure fetch is not called when access key is missing
      const result = await imageService.searchSingle('test')
      expect(result).toEqual({
        query: 'test',
        images: [],
        success: false,
        error: 'Unsplash access key not configured'
      })
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should return true when access key is set', async () => {
      process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY = 'test-key'
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ results: [] })
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await imageService.searchSingle('test')
      expect(result.success).toBe(true)
    })
  })

  describe('searchSingle', () => {
    beforeEach(() => {
      // Set access key for searchSingle tests
      process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY = 'test-key'
    })

    it('should search for images successfully', async () => {
      const mockImages = [
        {
          id: '1',
          urls: {
            small: 'https://example.com/small1.jpg',
            regular: 'https://example.com/regular1.jpg',
            full: 'https://example.com/full1.jpg'
          },
          alt_description: 'Test image 1'
        },
        {
          id: '2',
          urls: {
            small: 'https://example.com/small2.jpg',
            regular: 'https://example.com/regular2.jpg',
            full: 'https://example.com/full2.jpg'
          },
          alt_description: 'Test image 2'
        }
      ]

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ results: mockImages })
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await imageService.searchSingle('cat', 2)

      expect(result.success).toBe(true)
      expect(result.query).toBe('cat')
      expect(result.images).toHaveLength(2)
      expect(result.images[0].id).toBe('1')
      expect(result.images[1].id).toBe('2')
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('query=cat&per_page=2')
      )
    })

    it('should handle HTTP errors', async () => {
      const mockResponse = {
        ok: false,
        status: 429
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await imageService.searchSingle('cat')

      expect(result.success).toBe(false)
      expect(result.error).toBe('HTTP error! status: 429')
      expect(result.images).toEqual([])
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const result = await imageService.searchSingle('cat')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
      expect(result.images).toEqual([])
    })

    it('should trim query parameter', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ results: [] })
      }
      mockFetch.mockResolvedValue(mockResponse)

      await imageService.searchSingle('  cat  ')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('query=cat&')
      )
    })

    it('should set content filter to high', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ results: [] })
      }
      mockFetch.mockResolvedValue(mockResponse)

      await imageService.searchSingle('cat')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('content_filter=high')
      )
    })
  })

  describe('searchBatch', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY = 'test-key'
    })

    it('should search for multiple terms successfully', async () => {
      const mockImages = [
        {
          id: '1',
          urls: {
            small: 'https://example.com/small1.jpg',
            regular: 'https://example.com/regular1.jpg',
            full: 'https://example.com/full1.jpg'
          }
        }
      ]

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ results: mockImages })
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await imageService.searchBatch(['cat', 'dog'], 1)

      expect(result.totalQueries).toBe(2)
      expect(result.successfulQueries).toBe(2)
      expect(result.failedQueries).toBe(0)
      expect(result.results).toHaveLength(2)
      expect(result.results[0].success).toBe(true)
      expect(result.results[1].success).toBe(true)
    })

    it('should handle mixed success and failure', async () => {
      const mockResponse1 = {
        ok: true,
        json: jest.fn().mockResolvedValue({ results: [] })
      }
      const mockResponse2 = {
        ok: false,
        status: 429
      }
      mockFetch
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2)

      const result = await imageService.searchBatch(['cat', 'dog'], 1)

      expect(result.totalQueries).toBe(2)
      expect(result.successfulQueries).toBe(1)
      expect(result.failedQueries).toBe(1)
      expect(result.results[0].success).toBe(true)
      expect(result.results[1].success).toBe(false)
    })

    it('should add delay between requests for multiple queries', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ results: [] })
      }
      mockFetch.mockResolvedValue(mockResponse)

      const startTime = Date.now()
      await imageService.searchBatch(['cat', 'dog', 'bird'], 1)
      const endTime = Date.now()

      // Should have at least 200ms delay (100ms between each request)
      expect(endTime - startTime).toBeGreaterThanOrEqual(200)
    })

    it('should not add delay for single query', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ results: [] })
      }
      mockFetch.mockResolvedValue(mockResponse)

      const startTime = Date.now()
      await imageService.searchBatch(['cat'], 1)
      const endTime = Date.now()

      // Should be fast for single query
      expect(endTime - startTime).toBeLessThan(100)
    })
  })

  describe('getImageUrls', () => {
    it('should extract URLs for small size by default', () => {
      const mockImages: UnsplashImage[] = [
        {
          id: '1',
          urls: {
            small: 'https://example.com/small1.jpg',
            regular: 'https://example.com/regular1.jpg',
            full: 'https://example.com/full1.jpg'
          }
        },
        {
          id: '2',
          urls: {
            small: 'https://example.com/small2.jpg',
            regular: 'https://example.com/regular2.jpg',
            full: 'https://example.com/full2.jpg'
          }
        }
      ]

      const urls = imageService.getImageUrls(mockImages)

      expect(urls).toEqual([
        'https://example.com/small1.jpg',
        'https://example.com/small2.jpg'
      ])
    })

    it('should extract URLs for specified size', () => {
      const mockImages: UnsplashImage[] = [
        {
          id: '1',
          urls: {
            small: 'https://example.com/small1.jpg',
            regular: 'https://example.com/regular1.jpg',
            full: 'https://example.com/full1.jpg'
          }
        }
      ]

      const urls = imageService.getImageUrls(mockImages, 'full')

      expect(urls).toEqual(['https://example.com/full1.jpg'])
    })

    it('should handle empty images array', () => {
      const urls = imageService.getImageUrls([])
      expect(urls).toEqual([])
    })
  })

  describe('error handling', () => {
    it('should handle JSON parsing errors', async () => {
      process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY = 'test-key'
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await imageService.searchSingle('cat')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid JSON')
    })

    it('should handle missing results in response', async () => {
      process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY = 'test-key'
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({})
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await imageService.searchSingle('cat')

      expect(result.success).toBe(true)
      expect(result.images).toEqual([])
    })
  })
})
