import { fn } from "storybook/test";
import { ImageAction, VocabularyContext } from "@/lib/contexts/VocabularyContext";
import { ImageType, VocabularyWordType } from "@/lib/types";

export const mockVocabularyActions = {
  mockAddWord: fn().mockImplementation((word: string) => {
    console.log("mockAddWord called for word: ", word);
  }),
  mockManageImage: fn().mockImplementation((wordId: string, action: ImageAction) => {
    console.log("mockManageImage called for wordId: ", wordId, " and action: ", action);
  }),
};

export const mockVocabularyWords = [
  {
    id: "1",
    word: "pug",
    definition: "A small breed of dog with a wrinkly face",
    imageSlots: [
      {
        id: "0",
        status: "enabled",
        image: {
          id: "0",
          src: "/images/pug-1.jpg",
          alt: "pug-0",
        },
      },
      {
        id: "1",
        status: "enabled",
        image: {
          id: "1",
          src: "/images/pug-2.jpg",
          alt: "pug-1",
        },
      },
      {
        id: "2",
        status: "disabled",
        image: undefined,
      },
      {
        id: "3",
        status: "disabled",
        image: undefined,
      },
      {
        id: "4",
        status: "disabled",
        image: undefined,
      },
    ],
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    word: "golden retriever",
    definition: "A calm and friendly dog with a golden coat",
    imageSlots: [
      {
        id: "0",
        status: "disabled",
        image: {
          id: "0",
          src: "/images/golden-retriever-1.jpg",
          alt: "golden-retriever-0",
        },
      },
      {
        id: "1",
        status: "disabled",
        image: undefined,
      },
      {
        id: "2",
        status: "disabled",
        image: undefined,
      },
      {
        id: "3",
        status: "disabled",
        image: undefined,
      },
      {
        id: "4",
        status: "disabled",
        image: undefined,
      },
    ],
    createdAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    word: "border collie",
    definition: "An energetic breed of dog that herds sheep",
    imageSlots: [
      {
        id: "0",
        status: "enabled",
        image: {
          id: "0",
          src: "/images/placeholder.jpg",
          alt: "placeholder",
        },
      },
      {
        id: "1",
        status: "disabled",
        image: undefined,
      },
      {
        id: "2",
        status: "disabled",
        image: undefined,
      },
      {
        id: "3",
        status: "disabled",
        image: undefined,
      },
      {
        id: "4",
        status: "disabled",
        image: undefined,
      },
    ],
    createdAt: new Date("2024-01-03"),
  },
];

export const MockVocabularyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <VocabularyContext.Provider
    value={{
      addWord: mockVocabularyActions.mockAddWord,
      vocabWords: mockVocabularyWords as VocabularyWordType[],
      manageImage: mockVocabularyActions.mockManageImage,
    }}
  >
    {children}
  </VocabularyContext.Provider>
);

export const mockImagePool = [
  {
    id: "0",
    src: "/images/pug-1.jpg",
    alt: "pug-0",
  },
  {
    id: "1",
    src: "/images/pug-2.jpg",
    alt: "pug-1",
  },
  {
    id: "2",
    src: "/images/pug-3.jpg",
    alt: "pug-2",
  },
  {
    id: "3",
    src: "/images/pug-4.jpg",
    alt: "pug-3",
  },
  {
    id: "4",
    src: "/images/pug-5.jpg",
    alt: "pug-4",
  },
  {
    id: "5",
    src: "/images/pug-6.jpg",
    alt: "pug-5",
  },
  {
    id: "6",
    src: "/images/pug-7.jpg",
    alt: "pug-6",
  },
  {
    id: "7",
    src: "/images/pug-8.jpg",
    alt: "pug-7",
  },
  {
    id: "8",
    src: "/images/pug-9.jpg",
    alt: "pug-8",
  },
  {
    id: "9",
    src: "/images/pug-10.jpg",
    alt: "pug-9",
  },
] as ImageType[];
