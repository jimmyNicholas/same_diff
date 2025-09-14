import Picture from "./picture";
import { ImageType } from "@/lib/types";

export type ManageImageType = "DELETE"| "NEXT" | "PREV";

interface PictureContainerProps {
  images: ImageType[];
  manageImage: (
    action: ManageImageType,
    itemId: string,
  ) => void;
}

const PictureContainer = ({
  images,
  manageImage,
}: PictureContainerProps) => {

  const onImageClick = (type: string, imageId: string) => {
    manageImage(type as ManageImageType, imageId);
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
