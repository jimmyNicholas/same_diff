import Picture from "./picture";
import { ImageType } from "@/lib/types";
import { ManageItemPoolAction } from "@/lib/hooks/useItemPool";

interface PictureContainerProps {
  /** Array of image slots to display */
  images: ImageType[];
  manageItemPool: (action: ManageItemPoolAction, imageId?: string) => void;
}

const PictureContainer = ({ images, manageItemPool }: PictureContainerProps) => {

  return (
    <div
      data-testid="picture-container"
      className="grid grid-cols-5 justify-around gap-2"
    >
      {images.map((image, index) => (
        <Picture key={index} image={image} onImageClick={(action) => manageItemPool(action, image.id)} />
      ))}
      
    </div>
  );
};

export default PictureContainer;
