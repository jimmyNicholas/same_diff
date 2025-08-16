import Image from "next/image";

interface PictureProps {
  src: string;
  alt: string;
  size: "sm" | "md" | "lg";
  width?: number;
  height?: number;
}

const Picture = ({
  src,
  alt,
  size = "md",
  width,
  height,
}: PictureProps) => {
    
  let pictureWidth = 100, pictureHeight = 100;
  if (size === "sm") {
    pictureWidth = 100;
    pictureHeight = 100;
  } else if (size === "md") {
    pictureWidth = 150;
    pictureHeight = 150;
  } else if (size === "lg") {
    pictureWidth = 200;
    pictureHeight = 200;
  }

  const finalWidth = width || pictureWidth;
  const finalHeight = height || pictureHeight;

  return (
    <Image
        src={src}
        alt={alt}
        width={finalWidth}
        height={finalHeight}
        className={`object-cover rounded-md`}
        style={{ width: `${finalWidth}px`, height: `${finalHeight}px` }}
    />
  );
};

export default Picture;
