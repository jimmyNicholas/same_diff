import { Input } from "./ui/input";
import PictureContainer from "./ui/picture-container";
import { useState } from "react";
import useItemPool from "@/lib/hooks/useItemPool";
import { ImageType, VocabularyWordType } from "@/lib/types";
import useVocabulary from "@/lib/hooks/useVocabulary";

interface VocabRowContainerProps {
  vocabularyWords: VocabularyWordType[];
  addWord: (word: string) => void;
}

const VocabRowContainer = ({
  vocabularyWords,
  addWord,
}: VocabRowContainerProps) => {
  const [inputValue, setInputValue] = useState("");
  const handleAddWord = () => {
    //validate input
    if (inputValue.trim() === "") {
      return;
    }
    addWord(inputValue);
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
      {vocabularyWords.map((vocabularyWord) => (
        <VocabRow key={vocabularyWord.id} vocabulary={vocabularyWord} />
      ))}
    </div>
  );
};

export default VocabRowContainer;

interface VocabRowProps {
  vocabulary: VocabularyWordType;
}

const VocabRow = ({ vocabulary }: VocabRowProps) => {
  const [inputValue, setInputValue] = useState(vocabulary.word);
  const { addWord } = useVocabulary([vocabulary]);
  const handleOnBlur = () => {
    addWord(inputValue);
  };

  const { manageItemPool, getSelectedImages } = useItemPool<ImageType>(
    vocabulary.word, vocabulary.images
  );

  return (
    <div className="flex flex-row gap-2 border-foreground border-2 rounded-md p-2 items-center">
      <div className="flex flex-col gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleOnBlur}
          className="w-44 flex-shrink-0"
          data-testid="vocab-row-input"
        />
        <button className="bg-accent text-accent-foreground px-4 py-2 rounded-md" onClick={() => manageItemPool({ type: "ADD" })}>Add Image</button>
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
