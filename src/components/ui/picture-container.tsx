import Picture from "./picture";
import { PictureProps } from "./picture"

interface PictureContainerProps {
  /** Array of pictures to display */
  pictures: PictureProps[];
}

const PictureContainer = ({
  pictures,
}: PictureContainerProps) => {
 
  return (
    <div
      data-testid="picture-container"
      className="flex flex-wrap justify-around gap-2"
    >
      {pictures.map((picture, index) => (
        <Picture
          key={index}
          {...picture}
        />
      ))}
    </div>
  );
};

export default PictureContainer;
