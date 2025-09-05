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

function useVocabulary(currentWords: VocabularyWordType[] = mockVocabularyWords) {
  const [words, setWords] = useState<VocabularyWordType[]>(currentWords);

  // create
  // addWord(word: string)
  const addWord = (word: string) => {
    console.log("addWord called for word: ", word);
  };

  // props (action: string, payload {})
  const manageVocabulary = () => {
    // add word = (word: 'string') -> creates new { VocabWord }, adds to vocabulary words
    // update word = (id: 'string', 'new word')
    // deleye word = (id: 'string') 
  }

  return { words, addWord };
}

export default useVocabulary;
