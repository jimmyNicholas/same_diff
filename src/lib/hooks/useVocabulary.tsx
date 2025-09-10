import { useState } from "react";
import { VocabularyWordType } from "../types";
import { localStorageUtils } from "../storage/localStorage";

const storage = localStorageUtils;

export type VocabularyAction =
  | { type: "ADD_WORD"; payload: { word: string } }
  | { type: "UPDATE_WORD"; payload: { id: string; word: string } }
  | { type: "DELETE_WORD"; payload: { id: string } };

function useVocabulary() {
  const [words, setWords] = useState<VocabularyWordType[]>(
    storage.load("vocabularyWords", [])
  );

  const manageVocabulary = async (action: VocabularyAction) => {
    const { type } = action;
    switch (type) {
      case "ADD_WORD":
        const newWord = {
          id: `word_${Date.now()}`,
          word: action.payload.word,
          definition: "",
          images: [],
          createdAt: new Date(),
        };
        setWords(prevWords => {
          const newWords = [...prevWords, newWord];
          storage.save("vocabularyWords", newWords);
          return newWords;
        });
        break;
      case "UPDATE_WORD":
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
      case "DELETE_WORD":
        setWords(prevWords => {
          const filteredWords = prevWords.filter((word) => word.id !== action.payload.id);
          storage.save("vocabularyWords", filteredWords);
          return filteredWords;
        });
        break;
      default:
        break;
    }
  };

  return { words, manageVocabulary };
}

export default useVocabulary;