import { VocabularyWord } from "@/lib/types";
import { Input } from "./ui/input";
import PictureContainer from "./ui/picture-container";
import { useVocabulary } from "@/lib/contexts/VocabularyContext";

interface VocabRowProps {
  vocabulary: VocabularyWord;
}

const VocabRow = ({
  vocabulary,
}: VocabRowProps) => {
  const { addWord } = useVocabulary();
  const pictures = Array.from({ length: 5 }, (_, index) => {
    const imageUrl = vocabulary.imageUrl[index];

    return {
      id: `${vocabulary.id}-${index}`,
      enabled: !!imageUrl,
      loading: false,
      src: imageUrl || undefined,
      alt: vocabulary.word + " " + (index + 1),
      size: "sm" as const,
    };
  });

  return (
    <div className="flex flex-row gap-2 border-gray-200 border-2 rounded-md p-2 items-center">
      <Input
        value={vocabulary.word}
        onBlur={(e) => addWord(e.target.value)}
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
