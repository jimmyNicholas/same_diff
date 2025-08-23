import { createContext, useContext, useState, ReactNode } from 'react';
import { VocabularyWord } from '../types';
import { mockVocabularyWords } from '@/test-utils/MockVocabularyProvider';

interface VocabularyContextType {
  vocabWords: VocabularyWord[];
  currentImageIndex: number;
  addWord: (word: string) => void;
  getImage: () => void;
  closeImage: () => void;
  previousImage: () => void;
  nextImage: () => void;
}

export const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export function VocabularyProvider({ children }: { children: ReactNode }) {
  const [vocabWords, setVocabWords] = useState<VocabularyWord[]>(mockVocabularyWords);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const addWord = (word: string) => {
    console.log("addWord called for word: ", word);
    setVocabWords(prev => [...prev, {
      id: (prev.length + 1).toString(),
      word,
      definition: "",
      imageUrl: [],
      createdAt: new Date(),
    }]);
  };

  const getImage = () => {
    console.log("getImage called");
  };

  const closeImage = () => {
    console.log("closeImage called");
    setCurrentImageIndex(0);
  };

  const previousImage = () => {
    console.log("previousImage called");
    setCurrentImageIndex(prev => 
      prev > 0 ? prev - 1 : vocabWords.length - 1
    );
  };

  const nextImage = () => {
    console.log("nextImage called");
    setCurrentImageIndex(prev => 
      prev < vocabWords.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <VocabularyContext.Provider value={{
      vocabWords,
      currentImageIndex,
      addWord,
      getImage,
      closeImage,
      previousImage,
      nextImage
    }}>
      {children}
    </VocabularyContext.Provider>
  );
}

export function useVocabulary() {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error('useVocabulary must be used within VocabularyProvider');
  }
  return context;
}