import { VocabularyWordType } from "@/lib/types";
import { Input } from "./ui/input";
import PictureContainer from "./ui/picture-container";
import { useState } from "react";
import { useVocabulary } from "@/lib/contexts/VocabularyContext";
import useItemPool from "@/lib/hooks/useItemPool";
import { ImageType } from "@/lib/types";

interface VocabRowProps {
  vocabulary: VocabularyWordType;
}

const VocabRow = ({ vocabulary }: VocabRowProps) => {
  const [inputValue, setInputValue] = useState(vocabulary.word);
  const { addWord } = useVocabulary();
  const handleOnBlur = () => {
    addWord(inputValue);
  };

  // const imageSlots = vocabulary.imageSlots.map((imageSlot) => ({
  //   imageSlot,
  //   onImageClick: (action: ImageAction) =>
  //     manageImage(vocabulary.id, imageSlot.id, action),
  // }));

  const { manageItemPool, getSelectedImages } = useItemPool<ImageType>(vocabulary.word);

  return (
    <div className="flex flex-row gap-2 border-gray-200 border-2 rounded-md p-2 items-center">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleOnBlur}
        className="w-44 flex-shrink-0"
        data-testid="vocab-row-input"
      />
      <div className="overflow-x-auto w-full">
        <PictureContainer
          images={getSelectedImages() as ImageType[]}
          manageItemPool={manageItemPool}
          data-testid="picture-container"
        />
      </div>
      <button onClick={() => manageItemPool("add")}>Add</button>
    </div>
  );
};

export default VocabRow;
