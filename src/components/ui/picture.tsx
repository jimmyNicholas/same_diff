//import { Button } from "./button";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader, Plus, X } from "lucide-react";
import { useVocabulary } from "@/lib/contexts/VocabularyContext";
import { ImageType } from "@/lib/types";

export interface PictureProps {
  /** Unique identifier for the parent word */
  wordId: string;
  /** Unique identifier for the picture */
  pictureId: string;
  /** Status of the picture */
  status: "enabled" | "disabled" | "loading" | "error";
  /** Image object */
  image: ImageType;
}

const Picture = ({
  wordId,
  pictureId,
  status,
  image,
}: PictureProps) => {

  const { showImage, hideImage, navigateImage } = useVocabulary();
  
  // default size is md
  const pictureWidth = 150;
  const pictureHeight = 150;


  return (
    <div data-testid={"picture-" + wordId + "-" + pictureId}>
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
              data-testid={"close-image-button-" + wordId + "-" + pictureId}
              aria-label="Close this image"
              className="bg-destructive/70 rounded-full"
              onClick={() => hideImage(wordId, pictureId)}
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
              data-testid={"previous-image-button-" + wordId + "-" + pictureId}
              aria-label="Previous image"
              className="bg-secondary/70 rounded-full"
              onClick={() => navigateImage("previous", wordId, pictureId)}
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
              data-testid={"next-image-button-" + wordId + "-" + pictureId}
              aria-label="Next image"
              className="bg-secondary/70 rounded-full"
              onClick={() => navigateImage("next", wordId, pictureId)}
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
          data-testid={"get-image-button-" + wordId + "-" + pictureId}
          className="flex items-center justify-center border rounded-md cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
          style={{ width: `${pictureWidth}px`, height: `${pictureHeight}px` }}
          onClick={status === "loading" ? undefined : () => showImage(wordId, pictureId)}
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
