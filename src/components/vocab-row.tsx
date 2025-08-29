import { VocabularyWordType } from "@/lib/types";
import { Input } from "./ui/input";
import PictureContainer from "./ui/picture-container";
import { useState } from "react";
import { ImageAction, useVocabulary } from "@/lib/contexts/VocabularyContext";

interface VocabRowProps {
  vocabulary: VocabularyWordType;
}

const VocabRow = ({ vocabulary }: VocabRowProps) => {
  const [inputValue, setInputValue] = useState(vocabulary.word);
  const { addWord, manageImage } = useVocabulary();
  const handleOnBlur = () => {
    addWord(inputValue);
  };

  // const pictures = Array.from({ length: 5 }, (_, index) => {
  //   const image = vocabulary.images[index];
  //   return {
  //     wordId: vocabulary.id,
  //     pictureId: index.toString(),
  //     status: image?.status || "disabled",
  //     image: image,
  //     onManageImage: (action: ImageAction) => manageImage(vocabulary.id, action),
  //   };
  // });

  const pictures = vocabulary.images.map((image) => ({
    id: image.id,
    status: image.status,
    image: image,
    onManageImage: (action: ImageAction) => manageImage(vocabulary.id, action),
  }));

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
          pictures={pictures}
          data-testid="picture-container"
        />
      </div>
    </div>
  );
};

export default VocabRow;
