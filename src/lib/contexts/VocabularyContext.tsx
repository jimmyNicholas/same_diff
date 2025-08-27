import { createContext, useContext, useState, ReactNode } from "react";
import { VocabularyWordType } from "@/lib/types";
import { mockVocabularyWords } from "@/test-utils/MockVocabularyProvider";

interface VocabularyContextType {
  vocabWords: VocabularyWordType[];
  addWord: (word: string) => void;
  showImage: (wordId: string, pictureId: string) => void;
  hideImage: (wordId: string, pictureId: string) => void;
  navigateImage: (
    command: "previous" | "next",
    wordId: string,
    pictureId: string
  ) => void;
}

export const VocabularyContext = createContext<
  VocabularyContextType | undefined
>(undefined);

export function VocabularyProvider({ children }: { children: ReactNode }) {
  const [vocabWords, setVocabWords] =
    useState<VocabularyWordType[]>(mockVocabularyWords);

  const addWord = (word: string) => {
    console.log("addWord called for word: ", word);
  };

  const showImage = (wordId: string, pictureId: string) => {
    console.log(
      "showImage called for wordId: ",
      wordId,
      " and pictureId: ",
      pictureId
    );
    // if image.src === null, search for image in the pool

    // update the word in the current position in the array
    setVocabWords(
      vocabWords.map((word) =>
        word.id === wordId
          ? {
              ...word,
              images: word.images.map((image) =>
                image.pictureId === pictureId
                  ? { ...image, status: "enabled" }
                  : image
              ),
            }
          : word
      )
    );
  };  

  const hideImage = (wordId: string, pictureId: string) => {
    console.log("hideImage called for wordId: ", wordId, " and pictureId: ", pictureId);
    // update the word in the current position in the array
    setVocabWords(
      vocabWords.map((word) =>
        word.id === wordId
          ? {
              ...word,
              images: word.images.map((image) =>
                image.pictureId === pictureId
                  ? { ...image, status: "disabled" }
                  : image
              ),
            }
          : word
      )
    );
  };


  
  const navigateImage = (
    command: "previous" | "next",
    wordId: string,
    pictureId: string
  ) => {
    console.log("navigateImage called for wordId: ", wordId, " and pictureId: ", pictureId);
    // update the word in the current position in the array

  };

  return (
    <VocabularyContext.Provider
      value={{
        vocabWords,
        addWord,
        showImage,
        hideImage,
        navigateImage,
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
