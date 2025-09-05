import { useState } from "react";
import { VocabularyWordType } from "../types";
import { localStorageUtils } from "../storage/localStorage";

const storage = localStorageUtils;

export type VocabularyAction =
  | { type: "ADD"; payload: { word: string } }
  | { type: "UPDATE"; payload: { id: string; word: string } }
  | { type: "DELETE"; payload: { id: string } };

function useVocabulary() {
  const [words, setWords] = useState<VocabularyWordType[]>(
    storage.load("vocabularyWords", [])
  );  

  const addWord = (word: string) => {
    const newWord = {
      id: `word_${Date.now()}`,
      word,
      definition: "",
      images: [], 
      createdAt: new Date(),
    };
    setWords(prevWords => {
      const newWords = [...prevWords, newWord];
      storage.save("vocabularyWords", newWords);
      return newWords;
    });
  };

  const manageVocabulary = (action: VocabularyAction) => {
    const { type } = action;
    switch (type) {
      case "ADD":
        addWord(action.payload.word);
        break;
      case "UPDATE":
        setWords(prevWords => {
          const updatedWords = prevWords.map((word) =>
            word.id === action.payload.id
              ? { ...word, word: action.payload.word }
              : word
          );
          storage.save("vocabularyWords", updatedWords);
          return updatedWords;
        });
        break;
      case "DELETE":
        setWords(prevWords => {
          const filteredWords = prevWords.filter((word) => word.id !== action.payload.id);
          storage.save("vocabularyWords", filteredWords);
          return filteredWords;
        });
        break;
    }
  };

  return { words, manageVocabulary };
}

export default useVocabulary;
