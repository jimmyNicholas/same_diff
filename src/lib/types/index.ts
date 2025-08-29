// Core types for ELICOS Game Generator

export interface ImageType {
  id: string;  
  status: "enabled" | "disabled" | "loading" | "error";
  src: string;
  alt: string;
}

export interface VocabularyWordType {
  id: string;
  word: string;
  definition: string;
  images: ImageType[];
  createdAt: Date;
}

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

export interface GameConfig {
  unitId: string;
  playerCount: 2 | 3 | 4 | 5;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AdminUser {
  username: string;
  passwordHash: string;
}

// Route parameters for dynamic routing
export interface GameRouteParams {
  level: string;
  unit: string;
  lesson: string;
  players: string;
}
