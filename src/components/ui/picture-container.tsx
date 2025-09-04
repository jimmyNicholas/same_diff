import Picture from "./picture";
import { ImageType } from "@/lib/types";
import { ItemAction } from "@/lib/hooks/useItemPool";

interface PictureContainerProps {
  /** Array of image slots to display */
  images: ImageType[];
  manageItemPool: (action: ItemAction, imageId: string) => void;
}

const PictureContainer = ({ images, manageItemPool }: PictureContainerProps) => {

  return (
    <div
      data-testid="picture-container"
      className="flex flex-wrap justify-around gap-2"
    >
      {images.map((image, index) => (
        <Picture key={index} image={image} onImageClick={(action) => manageItemPool(action, image.id)} />
      ))}
    </div>
  );
};

export default PictureContainer;
