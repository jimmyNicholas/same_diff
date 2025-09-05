import { useState, useCallback } from 'react';
import { imageService, type ImageSearchResult, type BatchImageSearchResult, UnsplashImage } from '@/lib/services/imageService';

export const useImageSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchSingle = useCallback(async (query: string, page: number = 1, maxImages: number = 5): Promise<ImageSearchResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await imageService.searchSingle(query, page, maxImages);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return {
        query,
        images: [],
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchBatch = useCallback(async (queries: string[], page: number = 1, maxImagesPerQuery: number = 5): Promise<BatchImageSearchResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await imageService.searchBatch(queries, page, maxImagesPerQuery);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return {
        results: queries.map(query => ({
          query,
          images: [],
          success: false,
          error: errorMessage
        })),
        totalQueries: queries.length,
        successfulQueries: 0,
        failedQueries: queries.length
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getImageUrls = useCallback((images: UnsplashImage[], size: 'small' | 'regular' | 'full' = 'small'): string[] => {
    return imageService.getImageUrls(images, size);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    searchSingle,
    searchBatch,
    isLoading,
    error,
    clearError,
    getImageUrls
  };
};
