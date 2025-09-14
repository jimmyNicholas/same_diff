import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { vocabularySlice } from "@/store/slices/vocabularySlice";
import { imageApi } from "@/store/api/imageApi";
import { VocabularyWordType } from "@/lib/types";
import { fn } from "storybook/test";

// Mock data
export const mockVocabularyWords: VocabularyWordType[] = [
  {
    id: "word_1",
    word: "border collie",
    definition: "A small domesticated carnivorous mammal",
    images: [
      {
        id: "img_1",
        urls: {
          full: "https://images.unsplash.com/photo-1568393691080-d016376b767d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1MzE5OTR8MHwxfHNlYXJjaHwxfHxib3JkZXIlMjBjb2xsaWV8ZW58MXx8fHwxNzU1OTE1NzI3fDA&ixlib=rb-4.1.0&q=85",
          regular:
            "https://images.unsplash.com/photo-1568393691080-d016376b767d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzE5OTR8MHwxfHNlYXJjaHwxfHxib3JkZXIlMjBjb2xsaWV8ZW58MXx8fHwxNzU1OTE1NzI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
          small:
            "https://images.unsplash.com/photo-1568393691080-d016376b767d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzE5OTR8MHwxfHNlYXJjaHwxfHxib3JkZXIlMjBjb2xsaWV8ZW58MXx8fHwxNzU1OTE1NzI3fDA&ixlib=rb-4.1.0&q=80&w=400",
          thumb:
            "https://images.unsplash.com/photo-1568393691080-d016376b767d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzE5OTR8MHwxfHNlYXJjaHwxfHxib3JkZXIlMjBjb2xsaWV8ZW58MXx8fHwxNzU1OTE1NzI3fDA&ixlib=rb-4.1.0&q=80&w=200",
        },
        alt: "close-up-photography-of-adult-brown-and-white-border-collie-md2_P9X7t4M",
      },
      {
        id: "img_2",
        urls: {
          full: "https://images.unsplash.com/photo-1654256578072-b932c33cb92e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1MzE5OTR8MHwxfHNlYXJjaHwyfHxib3JkZXIlMjBjb2xsaWV8ZW58MXx8fHwxNzU1OTE1NzI3fDA&ixlib=rb-4.1.0&q=85",
          regular:
            "https://images.unsplash.com/photo-1654256578072-b932c33cb92e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzE5OTR8MHwxfHNlYXJjaHwyfHxib3JkZXIlMjBjb2xsaWV8ZW58MXx8fHwxNzU1OTE1NzI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
          small:
            "https://images.unsplash.com/photo-1654256578072-b932c33cb92e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzE5OTR8MHwxfHNlYXJjaHwyfHxib3JkZXIlMjBjb2xsaWV8ZW58MXx8fHwxNzU1OTE1NzI3fDA&ixlib=rb-4.1.0&q=80&w=400",
          thumb:
            "https://images.unsplash.com/photo-1654256578072-b932c33cb92e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzE5OTR8MHwxfHNlYXJjaHwyfHxib3JkZXIlMjBjb2xsaWV8ZW58MXx8fHwxNzU1OTE1NzI3fDA&ixlib=rb-4.1.0&q=80&w=200",
        },
        alt: "a-black-and-white-dog-laying-in-the-grass-w7lH4jLh9V0",
      },
      {
        id: "img_3",
        urls: {
            full: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1MzE5OTR8MHwxfHNlYXJjaHwzfHxib3JkZXIlMjBjb2xsaWV8ZW58MXx8fHwxNzU1OTE1NzI3fDA&ixlib=rb-4.1.0&q=85',
            regular: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzE5OTR8MHwxfHNlYXJjaHwzfHxib3JkZXIlMjBjb2xsaWV8ZW58MXx8fHwxNzU1OTE1NzI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
            small: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzE5OTR8MHwxfHNlYXJjaHwzfHxib3JkZXIlMjBjb2xsaWV8ZW58MXx8fHwxNzU1OTE1NzI3fDA&ixlib=rb-4.1.0&q=80&w=400',
            thumb: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzE5OTR8MHwxfHNlYXJjaHwzfHxib3JkZXIlMjBjb2xsaWV8ZW58MXx8fHwxNzU1OTE1NzI3fDA&ixlib=rb-4.1.0&q=80&w=200',
          },
        alt: "long-coated-black-and-white-dog-during-daytime-mx0DEnfYxic",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "word_2",
    word: "dog",
    definition: "A domesticated carnivorous mammal",
    images: [],
    createdAt: new Date().toISOString(),
  },
];

// Create mock store with preloaded state
const mockStore = configureStore({
  reducer: {
    vocabulary: vocabularySlice.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(imageApi.middleware),
  preloadedState: {
    vocabulary: {
      words: mockVocabularyWords,
    },
  },
});

// Mock actions for testing
export const mockVocabularyActions = {
  mockShowImage: fn(),
  mockHideImage: fn(),
  mockNavigateImage: fn(),
  mockAddWord: fn(),
  mockUpdateWord: fn(),
  mockDeleteWord: fn(),
  mockAddImageToWord: fn(),
  mockDeleteImageFromWord: fn(),
  mockOnImageClick: fn(),
};

export const MockVocabularyProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <Provider store={mockStore}>{children}</Provider>;
};
