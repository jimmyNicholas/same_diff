import Picture from "./picture";
import { ImageType } from "@/lib/types";
import { ItemPoolAction } from "@/lib/hooks/useItemPool";

interface PictureContainerProps {
  images: ImageType[];
  manageImage: (
    action: ItemPoolAction,
  ) => void;
}

const PictureContainer = ({
  images,
  manageImage,
}: PictureContainerProps) => {

  const onImageClick = (type: string, imageId: string) => {
    const action = { type, payload: { itemId: imageId } };
    manageImage(action as ItemPoolAction);
  };

  return (
    <div
      data-testid="picture-container"
      className="flex flex-wrap justify-around gap-2"
    >
      {images.map((image, index) => (
        <Picture
          key={index}
          image={image}
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
};

export default PictureContainer;
