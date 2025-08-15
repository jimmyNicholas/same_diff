'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useImageSearch } from '@/lib/hooks/useImageSearch';

interface ImageSectionProps {
  rowId: string;
  pictures: string[];
  searchTerm: string;
  onUpdatePictures: (id: string, pictures: string[]) => void;
}

export default function ImageSection({ rowId, pictures, searchTerm, onUpdatePictures }: ImageSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { searchSingle } = useImageSearch();

  const updatePicture = (pictureIndex: number, value: string) => {
    const newPictures = [...pictures];
    newPictures[pictureIndex] = value;
    onUpdatePictures(rowId, newPictures);
  };

  const addPicture = () => {
    const newPictures = [...pictures, ''];
    onUpdatePictures(rowId, newPictures);
  };

  const removePicture = (pictureIndex: number) => {
    const newPictures = pictures.filter((_, index) => index !== pictureIndex);
    onUpdatePictures(rowId, newPictures);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Please enter a search term first');
      return;
    }

    try {
      setIsLoading(true);
      console.log(`Searching for: ${searchTerm}`);
      const result = await searchSingle(searchTerm, 4);
      
      if (result.success && result.images.length > 0) {
        // Update the row with found image URLs
        const imageUrls = result.images.map(img => img.urls.small);
        onUpdatePictures(rowId, imageUrls.slice(0, 5)); // Max 5 pictures
        console.log(`Found ${result.images.length} images for "${searchTerm}"`);
      } else {
        alert(`No images found for "${searchTerm}": ${result.error || 'No results'}`);
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert(`Search failed for "${searchTerm}"`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="flex flex-col items-center">
          {index < pictures.length && pictures[index] ? (
            <div className="relative group w-20 h-20">
              <Image
                src={pictures[index]}
                alt={`Picture ${index + 1}`}
                fill
                className="object-cover rounded"
                onError={(e) => {
                  console.error(`Failed to load image: ${pictures[index]}`);
                }}
              />
              <button
                onClick={() => removePicture(index)}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Remove image"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
              {index < pictures.length ? (
                <button
                  onClick={() => {
                    const url = prompt('Enter image URL:');
                    if (url) updatePicture(index, url);
                  }}
                  className="text-xs hover:text-gray-600"
                >
                  Add URL
                </button>
              ) : (
                <button
                  onClick={addPicture}
                  className="text-2xl hover:text-gray-600"
                >
                  +
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      
      <button
        onClick={handleSearch}
        disabled={!searchTerm.trim() || isLoading}
        className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
}
