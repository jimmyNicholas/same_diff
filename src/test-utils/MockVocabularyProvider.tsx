import { fn } from "storybook/test";
import { VocabularyContext } from "@/lib/contexts/VocabularyContext";

export const mockVocabularyActions = {
  mockGetImage: fn(),
  mockAddWord: fn(),
  mockNextImage: fn(),
  mockPreviousImage: fn(),
  mockCloseImage: fn(),
};

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
      vocabWords: [],
      currentImageIndex: 0,
    }}
  >
    {children}
  </VocabularyContext.Provider>
);
