import { useCallback, useState } from "react";
import { ImageType } from "../types";
import { createItemPoolService, ItemPoolServiceInterface } from "../services/itemPoolService";

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
import { useImageSearch } from "./useImageSearch";
import { mockImagePoolApiCall } from "@/test-utils/MockImagePool";

export type ImageAction =
  | { type: "ADD_IMAGE_TO_WORD"; payload: { wordId: string } }
  | {
      type: "DELETE_IMAGE_FROM_WORD";
      payload: { wordId: string; imageId: string };
    }
  | { type: "NEXT_IMAGE_IN_WORD"; payload: { wordId: string; imageId: string } }
  | {
      type: "PREV_IMAGE_IN_WORD";
      payload: { wordId: string; imageId: string };
    };

export type VocabularyAction =
  | { type: "ADD_WORD"; payload: { word: string } }
  | { type: "UPDATE_WORD"; payload: { id: string; word: string } }
  | { type: "DELETE_WORD"; payload: { id: string } }
  | ImageAction;

function useVocabulary() {
  const dispatch = useDispatch<AppDispatch>();
  const words = useSelector((state: RootState) => state.vocabulary.words);

  const { searchSingle } = useImageSearch();
  const [activePools, setActivePools] = useState<
    Record<string, ItemPoolServiceInterface<ImageType>>
  >({});

  const getImagePool = useCallback(
    async (wordId: string, wordTag?: string) => {
      if (activePools[wordId]) {
        console.log("activePools[wordId]", activePools[wordId]);
        return activePools[wordId];
      }
 
      let wordImages: ImageType[] = [];

      if (!wordTag) {
        const word = words.find((word) => word.id === wordId);
        wordTag = word?.word || wordId;
        wordImages = word?.images || [];
      }

      const fetchImages = async (
        tag: string,
        page: number,
        chunkSize: number
      ) => {
        const mock = true;
        let result;
        if (mock) {
          result = await mockImagePoolApiCall(tag, page, chunkSize);
        } else {
          result = await searchSingle(tag, page, chunkSize);
        }
        return result.images.map((img) => ({
          id: img.id,
          urls: {
            thumb: img.urls.thumb,
            small: img.urls.small,
            regular: img.urls.regular,
            full: img.urls.full,
          },
          alt: img.alt_description || tag,
        }));
      };
  
      const pool = await createItemPoolService({
        id: `${wordId}_pool`,
        tag: wordTag,
        pool: wordImages || [],
        selectedIndexes: [],
        options: { currentPage: 1, poolChunkSize: 5, initialSize: wordImages.length || 3 },
        fetchItems: fetchImages,
      });

      setActivePools((prev) => ({ ...prev, [wordId]: pool }));
      return pool;
    },
    [activePools, searchSingle, words]
  );

  const manageVocabulary = async (action: VocabularyAction) => {
    const { type } = action;
    let imagePool: ItemPoolServiceInterface<ImageType>;
    switch (type) {
      case "ADD_WORD":
        const newWord = {
          id: `${action.payload.word}_${Date.now()}`,
          word: action.payload.word,
          definition: "",
          images: [] as ImageType[],
          createdAt: new Date().toISOString(),
        };
        imagePool = await getImagePool(newWord.id, newWord.word);
        newWord.images = imagePool.getSelectedItems() as ImageType[];
        dispatch(addWord(newWord));
        break;
      case "UPDATE_WORD":
        const word = words.find((word) => word.id === action.payload.id);
        if (word) {
          imagePool = await getImagePool(word.id, word.word);
          imagePool.manageItemPool({
            type: "UPDATE_TAG",
            payload: { tag: action.payload.word },
          });
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
        setActivePools((prev) => {
          const newPools = { ...prev };
          delete newPools[action.payload.id];
          return newPools;
        });
        break;

      case "ADD_IMAGE_TO_WORD":
        imagePool = await getImagePool(action.payload.wordId);
        const image = (await imagePool.manageItemPool({
          type: "ADD",
        })) as ImageType;
        dispatch(
          addImageToWord({ wordId: action.payload.wordId, image: image })
        );
        break;

      case "DELETE_IMAGE_FROM_WORD":
        imagePool = await getImagePool(action.payload.wordId);
        imagePool.manageItemPool({
          type: "DELETE",
          payload: { itemId: action.payload.imageId },
        });
        dispatch(
          deleteImageFromWord({
            wordId: action.payload.wordId,
            imageId: action.payload.imageId,
          })
        );
        break;

      case "NEXT_IMAGE_IN_WORD":
        imagePool = await getImagePool(action.payload.wordId);
        const nextImage = (await imagePool.manageItemPool({
          type: "NEXT",
          payload: { itemId: action.payload.imageId },
        })) as ImageType;
        dispatch(
          updateImageInWord({
            wordId: action.payload.wordId,
            imageId: action.payload.imageId,
            image: nextImage,
          })
        );
        break;

      case "PREV_IMAGE_IN_WORD":
        imagePool = await getImagePool(action.payload.wordId);
        const prevImage = (await imagePool.manageItemPool({
          type: "PREV",
          payload: { itemId: action.payload.imageId },
        })) as ImageType;
        dispatch(
          updateImageInWord({
            wordId: action.payload.wordId,
            imageId: action.payload.imageId,
            image: prevImage,
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
