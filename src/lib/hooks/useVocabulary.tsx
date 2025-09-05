import { useState } from "react";
import { VocabularyWordType } from "../types";

export const mockVocabularyWords: VocabularyWordType[] = [
  {
    id: "1",
    word: "pug",
    definition: "A small breed of dog with a wrinkly face",
    images: [],
    createdAt: new Date(),
  },
  {
    id: "2",
    word: "golden retriever",
    definition: "A breed of dog with a golden coat",
    images: [],
    createdAt: new Date(),
  },
  {
    id: "3",
    word: "border collie",
    definition: "A high-energy breed of dog that is used for herding",
    images: [],
    createdAt: new Date(),
  },
];

export type VocabularyAction =
  | { type: "ADD"; payload: { word: string } }
  | { type: "UPDATE"; payload: { id: string; word: string } }
  | { type: "DELETE"; payload: { id: string } };

function useVocabulary(
  currentWords: VocabularyWordType[] = mockVocabularyWords
) {
  const [words, setWords] = useState<VocabularyWordType[]>(currentWords);  

  // create
  // addWord(word: string)
  const addWord = (word: string) => {
    console.log("addWord called for word: ", word);
    const newWord = {
      id: words.length + 1,
      word,
      definition: "",
      images: [],
      createdAt: new Date(),
    };
    setWords([...words, newWord] as VocabularyWordType[]);
  };

  const manageVocabulary = (action: VocabularyAction) => {
    const { type } = action;
    switch (type) {
      case "ADD":
        addWord(action.payload.word);
        break;
      case "UPDATE":
        setWords((prevWords) =>
          prevWords.map((word) =>
            word.id === action.payload.id
              ? { ...word, word: action.payload.word }
              : word
          )
        );
        break;
      case "DELETE":
        setWords(words.filter((word) => word.id !== action.payload.id));
        break;
    }
  };

  return { words, manageVocabulary };
}

export default useVocabulary;
