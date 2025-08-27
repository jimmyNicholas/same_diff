import { fn } from "storybook/test";
import { VocabularyContext } from "@/lib/contexts/VocabularyContext";
import { VocabularyWordType } from "@/lib/types";

export const mockVocabularyActions = {
  mockAddWord: fn().mockImplementation((word: string) => {
    console.log("mockAddWord called for word: ", word);
  }),
  mockShowImage: fn().mockImplementation((pictureId: string) => {
    console.log("mockShowImage called for pictureId: ", pictureId);
  }),
  mockHideImage: fn().mockImplementation((pictureId: string) => {
    console.log("mockHideImage called for pictureId: ", pictureId);
  }),
  mockNavigateImage: fn().mockImplementation((command: "previous" | "next", pictureId: string) => {
    console.log("mockNavigateImage called for pictureId: ", pictureId);
  }),
};

export const mockVocabularyWords = [{
        id: "1",
        word: "pug",
        definition: "A small breed of dog with a wrinkly face",
        images: [{
          wordId: "1",
          pictureId: "0",
          status: "enabled",
          src: "/images/pug-1.jpg",
          alt: "pug-0",
          
        }, {
          wordId: "1",
          pictureId: "1",
          status: "enabled",
          src: "/images/pug-2.jpg",
          alt: "pug-1",
        }],
        createdAt: new Date("2024-01-01"),
     },{
        id: "2",
        word: "golden retriever",
        definition: "A calm and friendly dog with a golden coat",
        images: [],
        createdAt: new Date("2024-01-02"),
     },{
        id: "3",
        word: "border collie",
        definition: "An energetic breed of dog that herds sheep",
        images: [{
          wordId: "3",
          pictureId: "0",
          status: "enabled",
          src: "/images/placeholder.jpg",
          alt: "placeholder", 
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
      addWord: mockVocabularyActions.mockAddWord,
      showImage: mockVocabularyActions.mockShowImage,
      hideImage: mockVocabularyActions.mockHideImage,
      navigateImage: mockVocabularyActions.mockNavigateImage,
      vocabWords: mockVocabularyWords,
    }}
  >
    {children}
  </VocabularyContext.Provider>
);
