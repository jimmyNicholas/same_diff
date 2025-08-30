import { ImageAction } from "@/lib/contexts/VocabularyContext";
import Picture from "./picture";
import { ImageSlotType } from "@/lib/types";

interface PictureContainerProps {
  /** Array of image slots to display */
  imageSlots: {
    imageSlot: ImageSlotType;
    onImageClick: (action: ImageAction) => void;
  }[];
}

const PictureContainer = ({ imageSlots }: PictureContainerProps) => {
  return (
    <div
      data-testid="picture-container"
      className="flex flex-wrap justify-around gap-2"
    >
      {imageSlots.map((imageSlot, index) => (
        <Picture key={index} imageSlot={imageSlot.imageSlot} onImageClick={imageSlot.onImageClick} />
      ))}
    </div>
  );
};

export default PictureContainer;
