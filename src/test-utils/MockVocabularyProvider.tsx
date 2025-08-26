import { fn } from "storybook/test";
import { VocabularyContext } from "@/lib/contexts/VocabularyContext";
import { VocabularyWordType } from "@/lib/types";

export const mockVocabularyActions = {
  mockGetImage: fn().mockImplementation((pictureId: string) => {
    console.log("mockGetImage called for pictureId: ", pictureId);
  })  ,
  mockAddWord: fn().mockImplementation((word: string) => {
    console.log("mockAddWord called for word: ", word);
  }),
  mockNextImage: fn().mockImplementation(() => {
    console.log("mockNextImage called");
  }),
  mockPreviousImage: fn().mockImplementation(() => {
    console.log("mockPreviousImage called");
  }),
  mockCloseImage: fn().mockImplementation((pictureId: string) => {
    console.log("mockCloseImage called for pictureId: ", pictureId);
  }),
};

export const mockVocabularyWords = [{
        id: "1",
        word: "pug",
        definition: "A small breed of dog with a wrinkly face",
        imageUrl: [{
          id: "1-0",
          enabled: true,
          loading: false,
          src: "/images/pug-1.jpg",
          alt: "pug-0",
          size: "md",
        }, {
          id: "1-1",
          enabled: true,
          loading: false,
          src: "/images/pug-2.jpg",
          alt: "pug-1",
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
          id: "3-0",
          enabled: true,
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
    }}
  >
    {children}
  </VocabularyContext.Provider>
);
