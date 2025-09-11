import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { VocabularyWordType, ImageType } from "@/lib/types";

interface VocabularyState {
  words: VocabularyWordType[];
}

const initialState: VocabularyState = {
  words: [],
};

export const vocabularySlice = createSlice({
  name: "vocabulary",
  initialState,
  reducers: {
    // Vocabulary Actions
    addWord: (state, action: PayloadAction<VocabularyWordType>) => {
      state.words.push(action.payload);
    },
    updateWord: (state, action: PayloadAction<VocabularyWordType>) => {
      state.words = state.words.map((word) =>
        word.id === action.payload.id ? action.payload : word
      );
    },
    deleteWord: (state, action: PayloadAction<string>) => {
      const wordId = action.payload;
      state.words = state.words.filter((word) => word.id !== wordId);
    },
    addImageToWord: (state, action: PayloadAction<{ wordId: string; image: ImageType }>) => {
      const word = state.words.find((word) => word.id === action.payload.wordId);
      if (!word) return;
      word.images.push(action.payload.image);
    },
    deleteImageFromWord: (state, action: PayloadAction<{ wordId: string; imageId: string }>) => {
      const word = state.words.find((word) => word.id === action.payload.wordId);
      if (!word) return;
      word.images = word.images.filter((image) => image.id !== action.payload.imageId);
    },
    updateImageInWord: (state, action: PayloadAction<{ wordId: string; imageId: string; image: ImageType }>) => {
      const word = state.words.find((word) => word.id === action.payload.wordId);
      if (!word) return;
      word.images = word.images.map((image) => image.id === action.payload.imageId ? action.payload.image : image);
    },
  },
});

export const { addWord, updateWord, deleteWord, addImageToWord, deleteImageFromWord, updateImageInWord } = vocabularySlice.actions;
