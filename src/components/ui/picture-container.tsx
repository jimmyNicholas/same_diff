import Picture from "./picture";
import { ImageType } from "@/lib/types";
import { ItemPoolAction } from "@/lib/hooks/useItemPool";

interface PictureContainerProps {
  images: ImageType[];
  manageItemPool: (
    action: ItemPoolAction,
  ) => void;
}

const PictureContainer = ({
  images,
  manageItemPool,
}: PictureContainerProps) => {
  return (
    <div
      data-testid="picture-container"
      className="flex flex-wrap justify-around gap-2"
    >
      {images.map((image, index) => (
        <Picture
          key={index}
          image={image}
          onImageClick={manageItemPool}
        />
      ))}
    </div>
  );
};

export default PictureContainer;
