
// ===== DOMAIN TYPES =====
export interface ImageType {
  id: string;
  urls: {
    thumb: string;
    small: string;
    regular: string;
    full: string;
  };
  alt: string;
}

export interface ImagePoolType {
  id: string;
  tag: string;
  pool: ImageType[];
  selectedIndexes: number[];
  currentPage: number;
  poolChunkSize: number;
  selectedSize: number;
  isLoading: boolean;
}

export interface VocabularyWordType {
  id: string;
  word: string;
  definition: string;
  images: ImageType[];
  imagePool?: ImagePoolType;
  createdAt: string;
}

// ===== ADMIN TYPES =====
export interface AdminUser {
  username: string;
  passwordHash: string;
}

// After this line, all types are miscellaneous types
// ===== MISCELLANEOUS TYPES =====

export interface Unit {
  id: string;
  name: string;
  level: string;
  vocabulary: VocabularyWordType[];
  createdAt: Date;
}

export interface Level {
  id: string;
  name: string;
  units: Unit[];
}

// ===== GAME TYPES =====
export interface GameConfig {
  unitId: string;
  playerCount: 2 | 3 | 4 | 5;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameRouteParams {
  level: string;
  unit: string;
  lesson: string;
  players: string;
}

// ===== SERVICE TYPES =====
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
}

export interface BatchImageSearchResult {
  results: ImageSearchResult[];
}