import { useCallback } from "react";

export const useVocabularyActions = () => {
    const getImage = useCallback(() => {
      console.log('getImage called');
    }, []);
    
    const closeImage = useCallback(() => {
      console.log('closeImage called');
    }, []);
    
    const previousImage = useCallback(() => {
      console.log('previousImage called');
    }, []);
    
    const nextImage = useCallback(() => {
      console.log('nextImage called');
    }, []);

    const addWord = useCallback((word: string) => {
      console.log('addWord called for word: ', word);
    }, []);
    
    return { getImage, closeImage, previousImage, nextImage, addWord };
  };