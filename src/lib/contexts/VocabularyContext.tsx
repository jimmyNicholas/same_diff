import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
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

  // const getNextImageIndex = (
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
  //   return getNextImageIndex(
  //     nextIndex,
  //     enabledPoolIndexes,
  //     maxIndex,
  //     direction
  //   );
  // };
  /* HELPERS*/
  /* 
  const navigateImage = (
    word: VocabularyWordType,
    picture: ImageType,
    direction: "previous" | "next"
  ) => {
    console.log(
      "navigateImage called for word: ",
      word,
      " and picture: ",
      picture,
      " and direction: ",
      direction
    );

    // get next available image
    const currentPoolIndex = mockImagePool.findIndex(
      (poolImage) => poolImage.src === picture.src
    );

    if (currentPoolIndex === -1) {
      console.log("Refilling pool");
      //refillPool(word);
      return;
    }

    // get all src from the images with status "enabled"
    const enabledPoolIndexes = word.images
      .map((image) =>
        image.status === "enabled"
          ? mockImagePool.findIndex((poolImage) => poolImage.src === image.src)
          : null
      )
      .filter((src) => src !== null);

    const nextImageIndex = getNextImageIndex(
      currentPoolIndex,
      enabledPoolIndexes,
      mockImagePool.length,
      direction
    );
    if (nextImageIndex === null) {
      console.log("Refilling pool");
      return;
    }

    const nextImage = mockImagePool[nextImageIndex];
    console.log("nextImage: ", nextImage);
    updateImage(word, picture, {
      id: picture.id,
      status: "enabled" as const,
      src: nextImage.src,
      alt: nextImage.alt,
    });
  };
  */

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

    const { imagePool } = pool;
    // 4. Find current image in external pool
    let currentIndex = 0;

    if (image?.src) {
      currentIndex = imagePool.findIndex(
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
      if (!currentPool.some((image) => image.src === imagePool[nextIndex]?.src)) {
        return nextIndex;
      }
      
      return getNextImageIndex(
        nextIndex,
        currentPool,
        maxIndex,
        direction
      );
    };

    const nextImageIndex = getNextImageIndex(
      currentIndex,
      currentPool,
      imagePool.length,
      direction
    );


    if (nextImageIndex === null) {
      console.log("No available image found, call API to refill pool");
      return image;
    }

    return imagePool[nextImageIndex];

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
        //navigateImage(word, imageSlot, action.direction);
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
          // Disabling - remove the image
          newData = {
            status: "disabled",
            image: null,
          };
        } else {
          // Enabling - need to get an image from the pool
          const newImage = getImageFromPool(
            wordId,
            imageSlot.image as ImageType,
            "next"
          );
          newData = {
            status: "enabled",
            image: newImage || imageSlot.image, // Use new image or keep existing
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

  // const setImageSlots = (word: VocabularyWordType) => {
  //   return word.imageSlots.map((imageSlot) => ({
  //     ...imageSlot,
  //     onImageClick: (action: ImageAction) =>
  //       manageImage(word.id, imageSlot.id, action),
  //     // image:
  //     //   imageSlot.image === undefined
  //     //     ? getImageFromPool(word.id, imageSlot.image as ImageType, "next")
  //     //     : imageSlot.image,
  //   }));
  // };

  // useEffect(() => {
  //   setVocabWords(
  //     vocabWords.map((word) => ({
  //       ...word,
  //       imageSlots: setImageSlots(word),
  //     }))
  //   );
  // }, []);

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
