import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ImageType, VocabularyWordType } from "@/lib/types";
import {
  mockVocabularyWords,
  mockImagePool,
} from "@/test-utils/MockVocabularyProvider";

export type ImageAction =
  | { type: "navigate"; direction: "previous" | "next"; pictureId: string }
  | { type: "toggle"; pictureId: string };

export interface VocabularyContextType {
  vocabWords: VocabularyWordType[];
  manageImage: (wordId: string, action: ImageAction) => void;
  // TODO: update word interface
  addWord: (word: string) => void;
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
  /* FOR THE NAVIGATION SYSTEM */
  // const getNextImage = (
  //   currentIndex: number,
  //   enabledPoolIndexes: number[],
  //   maxIndex: number,
  //   direction: "previous" | "next"
  // ) => {
  //   let nextIndex = currentIndex;
  //   if (direction === "next") {
  //     nextIndex = currentIndex + 1;
  //   } else {
  //     nextIndex = currentIndex - 1;
  //   }
  //   console.log("nextIndex: ", nextIndex);
  //   if (!enabledPoolIndexes.includes(nextIndex)) {
  //     return nextIndex;
  //   }
  //   if (nextIndex === maxIndex) {
  //     return null;
  //   }
  //   return getNextImage(nextIndex, enabledPoolIndexes, maxIndex, direction);
  // };

  // const getPoolIndex = (src: string) => {
  //   return mockImagePool.findIndex((image) => image.src === src);
  // };

  // const getAvailableImage = (
  //   wordId: string,
  //   pictureId: string,
  //   direction: "previous" | "next"
  // ) => {
  //   // get the index of the current image
  //   const currentWord = vocabWords.find((word) => word.id === wordId);
  //   const currentPicture = currentWord?.images.find(
  //     (image) => image.pictureId === pictureId
  //   );

  //   if (!currentPicture || !currentWord) {
  //     return null;
  //   }
  //   const currentPoolIndex = getPoolIndex(currentPicture.src);

  //   // get all src from the images with status "enabled"
  //   const enabledPoolIndexes = currentWord.images
  //     .map((image) =>
  //       image.status === "enabled" ? getPoolIndex(image.src) : null
  //     )
  //     .filter((src) => src !== null);

  //   console.log(
  //     "currentPoolIndex: ",
  //     currentPoolIndex,
  //     "enabledPoolIndexes: ",
  //     enabledPoolIndexes
  //   );

  //   const nextImage = getNextImage(
  //     currentPoolIndex,
  //     enabledPoolIndexes,
  //     mockImagePool.length,
  //     direction
  //   );
  //   if (nextImage === null) {
  //     return null;
  //   }
  //   return mockImagePool[nextImage];
  // };

  const navigateImage = (
    direction: "previous" | "next",
    wordId: string,
    pictureId: string
  ) => {
    console.log(
      "navigateImage called for wordId: ",
      wordId,
      direction,
      " and pictureId: ",
      pictureId
    );

    // const availableImage = getAvailableImage(wordId, pictureId, command);

    // // if new image -> update the image at pictureId to the new image
    // if (!availableImage) {
    //   return;
    // }
    // setVocabWords(
    //   vocabWords.map((word) =>
    //     word.id === wordId
    //       ? {
    //           ...word,
    //           images: word.images.map((image) =>
    //             image.pictureId === pictureId
    //               ? {
    //                   ...image,
    //                   src: availableImage.src,
    //                   alt: availableImage.alt,
    //                 }
    //               : image
    //           ),
    //         }
    //       : word
    //   )
    // );
  };

  /* HELPERS*/
  const findWord = (wordId: string) => {
    return vocabWords.find((word) => word.id === wordId);
  };
  const findImage = (word: VocabularyWordType, pictureId: string) => {
    return word.images.find((image) => image.id === pictureId);
  };
  const updateImage = (wordId: string, pictureId: string, image: ImageType) => {
    setVocabWords(vocabWords.map((word) => {
      if (word.id === wordId) {
        return { ...word, images: word.images.map((img) => img.id === pictureId ? image : img) };
      }
      return word;
    }));
  };
  /* HELPERS*/

  const toggleImage = (wordId: string, pictureId: string) => {
    console.log(
      "toggleImage called for wordId: ",
      wordId,
      " and pictureId: ",
      pictureId
    );
    if (pictureId === "DISABLED") {
      navigateImage('next', wordId, pictureId);
      return;
    };
    const word = findWord(wordId);
    if (!word) return;
    const image = findImage(word, pictureId);
    if (!image) return;
    const newStatus = image.status === "enabled" ? "disabled" : "enabled";

    // Delegate to update layer
    updateImage(wordId, pictureId, { ...image, status: newStatus as "enabled" | "disabled" });
  };

  const manageImage = (wordId: string, action: ImageAction) => {
    switch (action.type) {
      case "navigate":
        navigateImage(action.direction, wordId, action.pictureId);
        break;
      case "toggle":
        toggleImage(wordId, action.pictureId);
        break;
      default:
        throw new Error("Invalid action type");
    }
  };

  // check vocabwords has 5 image slots, if not, add disabled image slots
  useEffect(() => {
    const updatedVocabWords = vocabWords.map((word) => {
      if (word.images.length === 5) return word;

      const disabledSlots = Array(5 - word.images.length)
        .fill(null)
        .map(() => ({
          id: "DISABLED",
          status: "disabled" as const,
          src: "",
          alt: "",
        }));

      return {
        ...word,
        images: [...word.images, ...disabledSlots],
      };
    });

    // Only update if there are actual changes
    if (JSON.stringify(updatedVocabWords) !== JSON.stringify(vocabWords)) {
      setVocabWords(updatedVocabWords);
    }
  }, [vocabWords]);

  return (
    <VocabularyContext.Provider
      value={{
        vocabWords,
        addWord,
        manageImage,
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
