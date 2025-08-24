import { fn } from "storybook/test";
import { VocabularyContext } from "@/lib/contexts/VocabularyContext";
import { VocabularyWordType } from "@/lib/types";

export const mockVocabularyActions = {
  mockGetImage: fn(),
  mockAddWord: fn(),
  mockNextImage: fn(),
  mockPreviousImage: fn(),
  mockCloseImage: fn(),
};

export const mockVocabularyWords = [{
        id: "1",
        word: "pug",
        definition: "A small breed of dog with a wrinkly face",
        imageUrl: [{
          id: "1",
          enabled: false,
          loading: false,
          src: "/images/pug-1.jpg",
          alt: "pug-1",
          size: "md",
        }, {
          id: "2",
          enabled: false,
          loading: false,
          src: "/images/pug-2.jpg",
          alt: "pug-2",
          size: "md",
        }],
        createdAt: new Date("2024-01-01"),
     },{
        id: "2",
        word: "golden retriever",
        definition: "A calm and friendly dog with a golden coat",
        imageUrl: [],
        createdAt: new Date("2024-01-02"),
     },{
        id: "3",
        word: "border collie",
        definition: "An energetic breed of dog that herds sheep",
        imageUrl: [{
          id: "1",
          enabled: false,
          loading: false,
          src: "/images/placeholder.jpg",
          alt: "placeholder",
          size: "md",
        }],
        createdAt: new Date("2024-01-03"),
      }
] as VocabularyWordType[];

export const MockVocabularyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <VocabularyContext.Provider
    value={{
      getImage: mockVocabularyActions.mockGetImage,
      addWord: mockVocabularyActions.mockAddWord,
      nextImage: mockVocabularyActions.mockNextImage,
      previousImage: mockVocabularyActions.mockPreviousImage,
      closeImage: mockVocabularyActions.mockCloseImage,
      vocabWords: mockVocabularyWords,
      currentImageIndex: 0,
    }}
  >
    {children}
  </VocabularyContext.Provider>
);
