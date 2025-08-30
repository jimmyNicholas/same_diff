//import { Button } from "./button";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader, Plus, X } from "lucide-react";
import { ImageSlotType } from "@/lib/types";
import { ImageAction } from "@/lib/contexts/VocabularyContext";

export interface PicturePropsType {
  imageSlot: ImageSlotType;
  onImageClick: (action: ImageAction) => void;
}

const Picture = ({ imageSlot, onImageClick }: PicturePropsType) => {
  const { id, status, image } = imageSlot;

  // default size is md
  const pictureWidth = 150;
  const pictureHeight = 150;

  return (
    <div key={id}>
      {status === "enabled" && image ? (
        <div
          className="relative rounded-md"
          style={{ width: `${pictureWidth}px`, height: `${pictureHeight}px` }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={pictureWidth}
            height={pictureHeight}
            className={`object-cover rounded-md`}
            style={{ width: `${pictureWidth}px`, height: `${pictureHeight}px` }}
          />

          {/* Close Button */}
          <div className="absolute top-0 right-0 rounded-full m-1">
            <button
              aria-label="Close this image"
              className="bg-destructive/70 rounded-full"
              onClick={() => onImageClick({ type: "toggle" })}
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
              onClick={() => onImageClick({ type: "navigate", direction: "previous" })}
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
              onClick={() => onImageClick({ type: "navigate", direction: "next" })}
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
      ) : (
        <div
          className="flex items-center justify-center border rounded-md cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
          style={{ width: `${pictureWidth}px`, height: `${pictureHeight}px` }}
          onClick={
            status === "loading"
              ? undefined
              : () => onImageClick({ type: "toggle" })
          }
        >
          {status === "loading" ? (
            <Loader className="w-full h-full animate-pulse" />
          ) : (
            <Plus className="w-full h-full" />
          )}
        </div>
      )}
    </div>
  );
};

export default Picture;
