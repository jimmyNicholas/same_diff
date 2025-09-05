// Unsplash API configuration
const UNSPLASH_API_BASE_URL = 'https://api.unsplash.com';

export interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description?: string;
}

export interface ImageSearchResult {
  query: string;
  images: UnsplashImage[];
  success: boolean;
  error?: string;
}

export interface BatchImageSearchResult {
  results: ImageSearchResult[];
  totalQueries: number;
  successfulQueries: number;
  failedQueries: number;
}

class ImageService {
  private isConfigured(): boolean {
    return !!(process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY);
  }

  /**
   * Search for images for a single term
   */
  async searchSingle(query: string, page: number = 1, maxImages: number = 5): Promise<ImageSearchResult> {
    if (!this.isConfigured()) {
      return {
        query,
        images: [],
        success: false,
        error: 'Unsplash access key not configured'
      };
    }

    try {
      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
        query: query.trim(),
        page: page.toString(),
        per_page: maxImages.toString(),
        content_filter: 'high',
      });
      
      const response = await fetch(`${UNSPLASH_API_BASE_URL}/search/photos?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const images = data.results || [];
      
      console.log(`Found ${images.length} images for "${query}"`);
      
      return {
        query,
        images,
        success: true
      };
    } catch (error) {
      console.error(`Error searching for "${query}":`, error);
      return {
        query,
        images: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Search for images for multiple terms
   */
  async searchBatch(queries: string[], page: number = 1, maxImagesPerQuery: number = 5): Promise<BatchImageSearchResult> {
    if (!this.isConfigured()) {
      return {
        results: queries.map(query => ({
          query,
          images: [],
          success: false,
          error: 'Unsplash access key not configured'
        })),
        totalQueries: queries.length,
        successfulQueries: 0,
        failedQueries: queries.length
      };
    }

    const results: ImageSearchResult[] = [];
    let successfulQueries = 0;
    let failedQueries = 0;

    // Process queries sequentially to avoid rate limiting
    for (const query of queries) {
      const result = await this.searchSingle(query, page, maxImagesPerQuery);
      results.push(result);
      
      if (result.success) {
        successfulQueries++;
      } else {
        failedQueries++;
      }

      // Small delay between requests to be respectful to the API
      if (queries.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return {
      results,
      totalQueries: queries.length,
      successfulQueries,
      failedQueries
    };
  }

  /**
   * Get image URLs in a specific size
   */
  getImageUrls(images: UnsplashImage[], size: 'small' | 'regular' | 'full' = 'small'): string[] {
    return images.map(img => img.urls[size]);
  }
}

// Export singleton instance
export const imageService = new ImageService();
