import { useCallback, useState } from "react";
import { ImageType } from "../types";
import ItemPoolService from "../services/itemPoolService";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  addWord,
  updateWord,
  deleteWord,
  addImageToWord,
  deleteImageFromWord,
  updateImageInWord,
} from "@/store/slices/vocabularySlice";
import { mockImagePoolApiCall } from "@/test-utils/MockImagePool";

export type ImageAction = 
  | { type: "ADD_IMAGE_TO_WORD"; payload: { wordId: string; } }
  | { type: "DELETE_IMAGE_FROM_WORD"; payload: { wordId: string; imageId: string } }
  | { type: "NEXT_IMAGE_IN_WORD"; payload: { wordId: string; imageId: string } }
  | { type: "PREV_IMAGE_IN_WORD"; payload: { wordId: string; imageId: string } };

export type VocabularyAction =
  | { type: "ADD_WORD"; payload: { word: string } }
  | { type: "UPDATE_WORD"; payload: { id: string; word: string } }
  | { type: "DELETE_WORD"; payload: { id: string } }
  | ImageAction;

function useVocabulary() {
  const dispatch = useDispatch<AppDispatch>();
  const words = useSelector((state: RootState) => state.vocabulary.words);

  //const { searchSingle } = useImageSearch();
  const [activePools, setActivePools] = useState<Record<string, ItemPoolService<ImageType>>>({});

  const getImagePool = useCallback((wordId: string) => {
    if (activePools[wordId]) {
      return activePools[wordId];
    }
    const fetchImages = async (tag: string, page: number, chunkSize: number) => {
      const result = await mockImagePoolApiCall(tag,page,chunkSize);
      return result.images.map((img) => ({
        id: img.id,
        urls: img.urls,
        alt: img.alt_description || tag,
      }));
    };

    const pool = new ItemPoolService({
      id: `${wordId}_pool`,
      tag: wordId,
      pool: [],
      selectedIndexes: [],
      options: { currentPage: 1, poolChunkSize: 5, selectedSize: 3 },
      fetchItems: fetchImages
    });
    
    setActivePools(prev => ({ ...prev, [wordId]: pool }));
    return pool;
  }, []);

  const manageVocabulary = async (action: VocabularyAction) => {
    const { type } = action;
    let imagePool: ItemPoolService<ImageType>;
    switch (type) {
      case "ADD_WORD":
        const newWord = {
          id: `word_${Date.now()}`,
          word: action.payload.word,
          definition: "",
          images: [],
          createdAt: new Date().toISOString(),
        };
        getImagePool(newWord.id);
        dispatch(addWord(newWord));
        break;
      case "UPDATE_WORD":
        const word = words.find((word) => word.id === action.payload.id);
        if (word) {
          dispatch(
            updateWord({
              ...word,
              id: action.payload.id,
              word: action.payload.word,
            })
          );
        }
        break;
      case "DELETE_WORD":
        dispatch(deleteWord(action.payload.id));
        break;
     
      case "ADD_IMAGE_TO_WORD":
        imagePool = getImagePool(action.payload.wordId);
        const image = await imagePool.manageItemPool({ type: "ADD" }) as ImageType;
        dispatch(
          addImageToWord(
            { wordId: action.payload.wordId, image: image }
          )
        );
        break;

      case "DELETE_IMAGE_FROM_WORD":
        imagePool = getImagePool(action.payload.wordId);
        imagePool.manageItemPool({ type: "DELETE", payload: { itemId: action.payload.imageId } });
        dispatch(
          deleteImageFromWord(
            { wordId: action.payload.wordId, imageId: action.payload.imageId }
          )
        );
        break;

      case "NEXT_IMAGE_IN_WORD":
        imagePool = getImagePool(action.payload.wordId);
        const nextImage = await imagePool.manageItemPool({ type: "NEXT", payload: { itemId: action.payload.imageId } }) as ImageType;
        dispatch(
          updateImageInWord({
            wordId: action.payload.wordId,
            imageId: action.payload.imageId,
            image: nextImage
          })
        );
        break;

      case "PREV_IMAGE_IN_WORD":
        imagePool = getImagePool(action.payload.wordId);
        const prevImage = await imagePool.manageItemPool({ type: "PREV", payload: { itemId: action.payload.imageId } }) as ImageType;
        dispatch(
          updateImageInWord({
            wordId: action.payload.wordId,
            imageId: action.payload.imageId,
            image: prevImage
          })
        );
        break;
      
      default:
        break;
    }
  };

  return { words, manageVocabulary };
}

export default useVocabulary;

/*
deciding how to structure the vocabulary and the images
to reduce complexity, the vocabulary is the main entity and the images are the child entities
but! how to handle the images with the pool?
at the moment, the pool is managed from the vocabulary component

CURRENTLY:
  vocabulary actions:
    add word
    update word
    delete word
    sync images to word

  image pool actions:
    add image
    delete image
    next image
    previous image


POSSIBLE SOLUTION:
  vocabulary actions:
    add word
    update word
    delete word
    add image -> calls image pool actions add image
    delete image -> calls image pool actions delete image
    update image -> calls image pool actions next / previous image
    fetch images -> passed from vocabulary component to image pool hook

  image pool actions:
    add image
    delete image
    next image
    previous image

Pros:
  - images are managed from the vocabulary component
  - reduced complexity
  - vocabulary just needs to know about the images


Cons:
  - because the pool is general, the fetchImages function needs to be passed from the vocabulary component to the pool


but what does the basic structure look like?

words: {
  id: string
  word: string
  definition: string
  images: ImageType[]
  createdAt: Date
}[];

ItemPoolType<T> {
  id: string;
  tag: string;
  items: T[];
  currentPage: number;
  poolChunkSize: number;
  selectedSize: number;
}

but words is an array and the pool is a single object
so, we need to create a pool for each word. but how?
I don't really want to add the pool to the word object because it's not a word property



*/
