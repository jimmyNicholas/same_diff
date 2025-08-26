import { createContext, useContext, useState, ReactNode } from "react";
import { VocabularyWordType } from "@/lib/types";
import { mockVocabularyWords } from "@/test-utils/MockVocabularyProvider";

interface VocabularyContextType {
  vocabWords: VocabularyWordType[];
  addWord: (word: string) => void;
  getImage: () => void;
  closeImage: (pictureId: string) => void;
  previousImage: () => void;
  nextImage: () => void;
}

export const VocabularyContext = createContext<
  VocabularyContextType | undefined
>(undefined);

export function VocabularyProvider({ children }: { children: ReactNode }) {
  const [vocabWords, setVocabWords] =
    useState<VocabularyWordType[]>(mockVocabularyWords);

  const addWord = (word: string) => {
    console.log("addWord called for word: ", word);
    setVocabWords((prev) => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        word,
        definition: "",
        imageUrl: [
          {
            id: (prev.length + 1).toString(),
            enabled: false,
            loading: false,
            src: "",
            alt: "",
            size: "md",
          },
        ],
        createdAt: new Date(),
      },
    ]);
  };

  const getImage = () => {
    console.log("getImage called");
  };

  // Takes pictureId, finds the VocabularyWord, and updates picture.enabled to false
  const closeImage = (pictureId: string) => {
    console.log("closeImage called for pictureId: ", pictureId);
    const [wordId, imageIndexStr] = pictureId.split("-");
    const imageIndex = parseInt(imageIndexStr);
    
    setVocabWords(prevVocabWords => 
      prevVocabWords.map(word => 
        word.id === wordId 
          ? {
              ...word,
              imageUrl: word.imageUrl.map((image, idx) =>
                idx === imageIndex 
                  ? { ...image, enabled: false }
                  : image
              )
            }
          : word
      )
    );
  };

  const previousImage = () => {
    console.log("previousImage called");
  };

  const nextImage = () => {
    console.log("nextImage called");
  };

  return (
    <VocabularyContext.Provider
      value={{
        vocabWords,
        addWord,
        getImage,
        closeImage,
        previousImage,
        nextImage,
      }}
    >
      {children}
    </VocabularyContext.Provider>
  );
}

export function useVocabulary() {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error("useVocabulary must be used within VocabularyProvider");
  }
  return context;
}
