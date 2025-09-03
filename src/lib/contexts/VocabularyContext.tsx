import { createContext, useContext, useState, ReactNode } from "react";
import { ImageType, ImageSlotType, VocabularyWordType } from "@/lib/types";
import {
  mockVocabularyWords,
  mockImagePool,
} from "@/test-utils/MockVocabularyProvider";

export type ImageAction =
  | { type: "navigate"; direction: "previous" | "next" }
  | { type: "toggle" };

export interface VocabularyContextType {
  vocabWords: VocabularyWordType[];
  // TODO: update word interface
  addWord: (word: string) => void;
  manageImage: (
    wordId: string,
    imageSlotId: string,
    action: ImageAction
  ) => void;
}

export const VocabularyContext = createContext<
  VocabularyContextType | undefined
>(undefined);

export function VocabularyProvider({ children }: { children: ReactNode }) {
  const [vocabWords, setVocabWords] = useState<VocabularyWordType[]>(
    mockVocabularyWords.map((word) => ({
      ...word,
      imageSlots: word.imageSlots.map((imageSlot) => ({
        ...imageSlot,
        onImageClick: (action: ImageAction) =>
          manageImage(word.id, imageSlot.id, action),
      })),
    })) as VocabularyWordType[]
  );

  const addWord = (word: string) => {
    console.log("addWord called for word: ", word);
  };

  /* HELPERS*/
  const updateImage = (
    wordId: string,
    pictureId: string,
    // part of image type
    newData: Partial<ImageType>
  ) => {
    setVocabWords(
      vocabWords.map((w) => {
        if (w.id === wordId) {
          return {
            ...w,
            imageSlots: w.imageSlots.map((img) =>
              img.id === pictureId ? { ...img, ...newData } : img
            ),
          };
        }
        return w;
      })
    );
  };

  /* NAVIGATE IMAGE */
  const getImageFromPool = (
    wordId: string,
    image: ImageType,
    direction: "previous" | "next"
  ): ImageType | null => {
    const word = vocabWords.find((w) => w.id === wordId);
    if (!word) return null;

    // 2. Get current pool (images in use)
    const currentPool = word.imageSlots
      .filter((slot) => slot.status === "enabled" && slot.image)
      .map((slot) => slot.image!);

    // 3. Get external image pool
    const pool = mockImagePool.find((pool) => pool.wordId === wordId);
    if (!pool) return null;

    const { images } = pool;
    // 4. Find current image in external pool
    let currentIndex = 0;

    if (image?.src) {
      currentIndex = images.findIndex(
        (poolImage) => poolImage.src === image.src
      );
    }
    if (currentIndex === -1) return null;

    // 5. Look for next image that's NOT in current pool
    const getNextImageIndex = (
      currentIndex: number,
      currentPool: ImageType[],
      maxIndex: number,
      direction: "previous" | "next"
    ): number | null => {
      let nextIndex = currentIndex;
      if (direction === "next") {
        nextIndex = currentIndex + 1;
      } else {
        nextIndex = currentIndex - 1;
      }
      if (nextIndex <= 0 || nextIndex >= maxIndex) {
        return null;
      }
      if (
        !currentPool.some((image) => image.src === images[nextIndex]?.src)
      ) {
        return nextIndex;
      }

      return getNextImageIndex(nextIndex, currentPool, maxIndex, direction);
    };

    const nextImageIndex = getNextImageIndex(
      currentIndex,
      currentPool,
      images.length,
      direction
    );

    if (nextImageIndex === null) {
      console.log("No available image found, call API to refill pool");
      return image;
    }

    return images[nextImageIndex];
  }; 

  /* MANAGE IMAGE */
  const manageImage = (
    wordId: string,
    imageSlotId: string,
    action: ImageAction
  ) => {
    const prepareRequest = (
      wordId: string,
      imageSlotId: string
    ):
      | { data: { word: VocabularyWordType; imageSlot: ImageSlotType } }
      | Error => {
      console.log(
        "prepareRequest called for wordId: ",
        wordId,
        " and imageSlotId: ",
        imageSlotId
      );
      const word = vocabWords.find((word) => word.id === wordId);
      if (!word) return new Error(`Word not found for wordId: ${wordId}`);
      const imageSlot = word.imageSlots.find(
        (imageSlot) => imageSlot.id === imageSlotId
      );
      if (!imageSlot)
        return new Error(`Picture not found for wordId: ${imageSlotId}`);
      return { data: { word, imageSlot } };
    };

    const requestData = prepareRequest(wordId, imageSlotId);
    if (requestData instanceof Error) return console.error(requestData.message);
    const { imageSlot } = requestData.data;
    let newData: Partial<ImageSlotType> | null = null;

    switch (action.type) {
      case "navigate":
        const newImage = getImageFromPool(
          wordId,
          imageSlot.image as ImageType,
          action.direction
        );

        if (newImage) {
          newData = {
            image: newImage,
            status: "enabled",
          };
        }

        break;
      case "toggle":
        if (imageSlot.status !== "enabled" && imageSlot.status !== "disabled")
          return;

        if (imageSlot.status === "enabled") {
          newData = {
            status: "disabled",
            image: null,
          };
        } else if (imageSlot.status === "disabled") {
          newData = {
            status: "enabled",
            image:
              imageSlot.image ||
              getImageFromPool(wordId, imageSlot.image as unknown as ImageType, "next")               
          };
        }
        break;
      default:
        throw new Error("Invalid action type");
    }

    if (newData) {
      updateImage(wordId, imageSlotId, newData);
    }
  };

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