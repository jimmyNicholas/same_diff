//import { Button } from "./button";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader, Plus, X } from "lucide-react";
import { useVocabularyActions } from "@/lib/hooks/useVocabularyActions";

export interface PictureProps {
  /** Unique identifier for the picture */
  id: string;
  /** Whether the picture is enabled/visible */
  enabled: boolean;
  /** Loading state for the picture */
  loading: boolean;
  /** Image source URL */
  src?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Size variant: sm (100px), md (150px), lg (200px) */
  size?: "sm" | "md" | "lg";
}

const Picture = ({
  id,
  enabled,
  loading,
  src,
  alt,
  size,
}: PictureProps) => {

  const { getImage, closeImage, previousImage, nextImage } = useVocabularyActions();
  
  // default size is md
  let pictureWidth = 150,
    pictureHeight = 150;

  if (size === "sm") {
    pictureWidth = 100;
    pictureHeight = 100;
  } else if (size === "lg") {
    pictureWidth = 200;
    pictureHeight = 200;
  }

  const finalWidth = pictureWidth;
  const finalHeight = pictureHeight;

  return (
    <div data-testid={"picture-" + id}>
      {enabled && src && alt ? (
        <div
          className="relative rounded-md"
          style={{ width: `${finalWidth}px`, height: `${finalHeight}px` }}
        >
          <Image
            src={src}
            alt={alt}
            width={finalWidth}
            height={finalHeight}
            className={`object-cover rounded-md`}
            style={{ width: `${finalWidth}px`, height: `${finalHeight}px` }}
          />

          {/* Close Button */}
          <div className="absolute top-0 right-0 rounded-full m-1">
            <button
              data-testid={"close-image-button-" + id}
              aria-label="Close this image"
              className="bg-destructive/70 rounded-full"
              onClick={closeImage}
            >
              <X
                style={{
                  width: `${Math.min(finalWidth, finalHeight) * 0.15}px`,
                  height: `${Math.min(finalWidth, finalHeight) * 0.15}px`,
                }}
                className="text-white m-1"
              />
            </button>
          </div>

          {/* Previous Button */}
          <div className="absolute top-[45%] left-0 rounded-full ml-1">
            <button
              data-testid={"previous-image-button-" + id}
              aria-label="Previous image"
              className="bg-secondary/70 rounded-full"
              onClick={previousImage}
            >
              <ChevronLeft
                style={{
                  width: `${Math.min(finalWidth, finalHeight) * 0.15}px`,
                  height: `${Math.min(finalWidth, finalHeight) * 0.15}px`,
                }}
                className="w-full h-full"
              />
            </button>
          </div>

          {/* Next Button */}
          <div className="absolute top-[45%] right-0 rounded-full mr-1">
            <button
              data-testid={"next-image-button-" + id}
              aria-label="Next image"
              className="bg-secondary/70 rounded-full"
              onClick={nextImage}
            >
              <ChevronRight
                style={{
                  width: `${Math.min(finalWidth, finalHeight) * 0.15}px`,
                  height: `${Math.min(finalWidth, finalHeight) * 0.15}px`,
                }}
                className="w-full h-full"
              />
            </button>
          </div>
        </div>
      ) : (
        <div
          data-testid={"get-image-button-" + id}
          className="flex items-center justify-center border rounded-md cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
          style={{ width: `${finalWidth}px`, height: `${finalHeight}px` }}
          onClick={!loading ? getImage : undefined}
        >
          {loading ? (
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
