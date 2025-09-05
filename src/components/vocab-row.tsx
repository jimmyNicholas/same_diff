import { Input } from "./ui/input";
import PictureContainer from "./ui/picture-container";
import { useState } from "react";
import useItemPool from "@/lib/hooks/useItemPool";
import { ImageType, VocabularyWordType } from "@/lib/types";
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
    manageVocabulary({ type: "ADD", payload: { word: inputValue } });
    setInputValue("");
  };

  const onManageVocabulary = (action: VocabularyAction) => {
    manageVocabulary(action);
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
            onManageVocabulary={onManageVocabulary}
          />
        ))}
      </div>
    </div>
  );
};

export default VocabRowContainer;

interface VocabRowProps {
  vocabulary: VocabularyWordType;
  onManageVocabulary: (action: VocabularyAction) => void;
}

const VocabRow = ({ vocabulary, onManageVocabulary }: VocabRowProps) => {
  const [inputValue, setInputValue] = useState(vocabulary.word);

  const onHandleUpdateWord = () => {
    if (inputValue.trim() === "") {
      return;
    }
    onManageVocabulary({ type: "UPDATE", payload: { id: vocabulary.id, word: inputValue } });
  };

  const { manageItemPool, getSelectedImages } = useItemPool<ImageType>(
    vocabulary.word,
    vocabulary.images
  );

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
          onClick={() => manageItemPool({ type: "ADD" })}
        >
          Add Image
        </button>
        <button
          className="bg-destructive/25 text-destructive px-4 py-2 rounded-md"
          onClick={() => onManageVocabulary({ type: "DELETE", payload: { id: vocabulary.id } })}
        >
          Delete Word
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <PictureContainer
          images={getSelectedImages() as ImageType[]}
          manageItemPool={manageItemPool}
          data-testid="picture-container"
        />
      </div>
    </div>
  );
};
