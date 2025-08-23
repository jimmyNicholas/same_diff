import { createContext, useContext, useState, ReactNode } from 'react';
import { VocabularyWord } from '../types';

interface VocabularyContextType {
  vocabWords: VocabularyWord[];
  currentImageIndex: number;
  addWord: (word: string) => void;
  getImage: () => void;
  closeImage: () => void;
  previousImage: () => void;
  nextImage: () => void;
}

const mockVocabWords: VocabularyWord[] = [
    {
      id: "1",
      word: "pug",
      definition: "A small breed of dog with a wrinkly face",
      imageUrl: ["/images/pug-1.jpg", "/images/pug-2.jpg"],
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      word: "golden retriever",
      definition: "A calm and friendly dog with a golden coat",
      imageUrl: [
        "/images/golden-retriever-1.jpg",
        "/images/golden-retriever-2.jpg",
        "/images/golden-retriever-2.jpg",
      ],
      createdAt: new Date("2024-01-02"),
    },
  ];

export const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export function VocabularyProvider({ children }: { children: ReactNode }) {
  const [vocabWords, setVocabWords] = useState<VocabularyWord[]>(mockVocabWords);
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