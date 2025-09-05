//import { Button } from "./button";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { ImageType } from "@/lib/types";
import { ItemPoolAction } from "@/lib/hooks/useItemPool";

export interface PicturePropsType {
  image: ImageType;
  onImageClick: (action: ItemPoolAction) => void;
}

const Picture = ({ image, onImageClick }: PicturePropsType) => {
  // default size
  const pictureWidth = 100;
  const pictureHeight = 100;

  if (!image) {
    return (
      <div
        className={`w-${pictureWidth}px h-${pictureHeight}px bg-secondary/70 rounded-md`}
      >
        <Loader2 className="w-full h-full text-white" />
      </div>
    );
  }

  return (
    <div key={image.id}>
      <div
        className="relative rounded-md"
        style={{ width: `${pictureWidth}px`, height: `${pictureHeight}px` }}
      >
        <Image
          src={image.urls.thumb}
          alt={image.alt}
          width={pictureWidth}
          height={pictureHeight}
          className={`object-cover rounded-md`}
          style={{
            width: `${pictureWidth}px`,
            height: `${pictureHeight}px`,
          }}
        />

        {/* Close Button */}
        <div className="absolute top-0 right-0 rounded-full m-1">
          <button
            aria-label="Close this image"
            className="bg-destructive/70 rounded-full"
            onClick={() =>
              onImageClick({ type: "DELETE", payload: { itemId: image.id } })
            }
          >
            <X
              style={{
                width: `${Math.min(pictureWidth, pictureHeight) * 0.15}px`,
                height: `${Math.min(pictureWidth, pictureHeight) * 0.15}px`,
              }}
              className="text-white m-1"
            />
          </button>
        </div>

        {/* Previous Button */}
        <div className="absolute top-[45%] left-0 rounded-full ml-1">
          <button
            aria-label="Previous image"
            className="bg-secondary/70 rounded-full"
            onClick={() =>
              onImageClick({ type: "PREV", payload: { itemId: image.id } })
            }
          >
            <ChevronLeft
              style={{
                width: `${Math.min(pictureWidth, pictureHeight) * 0.15}px`,
                height: `${Math.min(pictureWidth, pictureHeight) * 0.15}px`,
              }}
              className="w-full h-full"
            />
          </button>
        </div>

        {/* Next Button */}
        <div className="absolute top-[45%] right-0 rounded-full mr-1">
          <button
            aria-label="Next image"
            className="bg-secondary/70 rounded-full"
            onClick={() =>
              onImageClick({ type: "NEXT", payload: { itemId: image.id } })
            }
          >
            <ChevronRight
              style={{
                width: `${Math.min(pictureWidth, pictureHeight) * 0.15}px`,
                height: `${Math.min(pictureWidth, pictureHeight) * 0.15}px`,
              }}
              className="w-full h-full"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Picture;
