import Picture from "./picture";
import { PictureType } from "@/lib/types";

interface PictureContainerProps {
  /** Array of pictures to display */
  pictures: PictureType[];
}

const PictureContainer = ({
  pictures,
}: PictureContainerProps) => {
  //const sortedPictures = pictures;
  const sortedPictures = pictures.sort((a, b) => {
    if (a.enabled && !b.enabled) return -1;
    if (!a.enabled && b.enabled) return 1;
    if (a.loading && !b.loading) return -1;
    if (!a.loading && b.loading) return 1;
    return 0;
  });

  return (
    <div
      data-testid="picture-container"
      className="flex flex-wrap justify-around gap-2"
    >
      {sortedPictures.map((picture, index) => (
        <Picture
          key={index}
          {...picture}
        />
      ))}
    </div>
  );
};

export default PictureContainer;
