import Picture, { PictureProps } from "./picture";

interface PictureContainerProps {
  /** Array of pictures to display */
  pictures: PictureProps[];
}

const PictureContainer = ({
  pictures,
}: PictureContainerProps) => {
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
      {sortedPictures.map((picture) => (
        <Picture
          key={picture.id}
          {...picture}
        />
      ))}
    </div>
  );
};

export default PictureContainer;
