import { useCallback } from "react";
import { VocabularyWord } from "../types";

interface UseVocabularyActionsProps {
  vocabWords: VocabularyWord[];
  setVocabWords: React.Dispatch<React.SetStateAction<VocabularyWord[]>>;
}

export const useVocabularyActions = ({
  vocabWords,
  setVocabWords,
}: UseVocabularyActionsProps) => {
  
  const getImage = useCallback(() => {
    console.log("getImage called");
  }, []);

  const closeImage = useCallback(() => {
    console.log("closeImage called");
  }, []);

  const previousImage = useCallback(() => {
    console.log("previousImage called");
  }, []);

  const nextImage = useCallback(() => {
    console.log("nextImage called");
  }, []);

  const addWord = useCallback((word: string) => {
    console.log("addWord called for word: ", word);
  }, []);

  return { getImage, closeImage, previousImage, nextImage, addWord };
};
