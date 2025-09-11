import { Input } from "./ui/input";
import PictureContainer from "./ui/picture-container";
import { useState } from "react";
import { VocabularyWordType } from "@/lib/types";
import { VocabularyAction } from "@/lib/hooks/useVocabulary";

interface VocabRowContainerProps {
  vocabularyWords: VocabularyWordType[];
  manageVocabulary: (action: VocabularyAction) => void;
}

const VocabRowContainer = ({
  vocabularyWords,
  manageVocabulary,
}: VocabRowContainerProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddWord = () => {
    if (inputValue.trim() === "") {
      return;
    }
    manageVocabulary({ type: "ADD_WORD", payload: { word: inputValue } });
    setInputValue("");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-center items-center">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-44 flex-shrink-0"
        />
        <button
          className="bg-accent text-accent-foreground px-4 py-2 rounded-md"
          onClick={handleAddWord}
        >
          Add New Word
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {vocabularyWords.map((vocabularyWord) => (
          <VocabRow
            key={vocabularyWord.id}
            vocabulary={vocabularyWord}
            manageVocabulary={manageVocabulary}
          />
        ))}
      </div>
    </div>
  );
};

export default VocabRowContainer;

interface VocabRowProps {
  vocabulary: VocabularyWordType;
  manageVocabulary: (action: VocabularyAction) => void;
}

const VocabRow = ({ vocabulary, manageVocabulary }: VocabRowProps) => {
  const [inputValue, setInputValue] = useState(vocabulary.word);

  const onHandleUpdateWord = () => {
    if (inputValue.trim() === "") {
      return;
    }
    manageVocabulary({ type: "UPDATE_WORD", payload: { id: vocabulary.id, word: inputValue } });
  };

  const onManageImage = (action: "DELETE"| "NEXT" | "PREV", itemId: string) => {
    const actionType = action === "DELETE" ? "DELETE_IMAGE_FROM_WORD" : action === "NEXT" ? "NEXT_IMAGE_IN_WORD" : "PREV_IMAGE_IN_WORD";
    const payload = { wordId: vocabulary.id, imageId: itemId };
    manageVocabulary({ type: actionType, payload: payload });
  };

  return (
    <div className="flex flex-col gap-2 border-foreground border-2 rounded-md p-2 items-center">
      <div className="flex flex-row gap-2 items-center">
        <label htmlFor="vocab-row-input">{'Word: '}</label>
        <Input
          value={inputValue}
          onBlur={onHandleUpdateWord}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-44 flex-shrink-0"
          data-testid="vocab-row-input"
        />
        <button
          className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md"
          onClick={() => manageVocabulary({ type: "ADD_IMAGE_TO_WORD", payload: { wordId: vocabulary.id } })}
        >
          Add Image
        </button>
        <button
          className="bg-destructive/25 text-destructive px-4 py-2 rounded-md"
          onClick={() => manageVocabulary({ type: "DELETE_WORD", payload: { id: vocabulary.id } })}
        >
          Delete Word
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <PictureContainer
          images={vocabulary.images}
          manageImage={onManageImage}
          data-testid="picture-container"
        />
      </div>
    </div>
  );
};
