import { useState, useCallback, useEffect } from "react";
//import { mockImagePoolApiResponse } from '@/test-utils/MockImagePool';
import { useImageSearch } from './useImageSearch';
import { mockImagePoolApiCall } from "@/test-utils/MockImagePool";

interface ItemPoolType<T> {
  id: string;
  tag: string;
  items: T[];
  currentPage: number;
  poolChunkSize: number;
  selectedSize: number;
}

export type ItemPoolAction =
| { type: "ADD" }
| { type: "DELETE"; payload: { itemId: string } }
| { type: "NEXT"; payload: { itemId: string } }
| { type: "PREV"; payload: { itemId: string } };

function useItemPool<T>(
  tag: string,
  currentItems: T[] = [],
  currentPage: number = 1,
  poolChunkSize: number = 5,
  selectedSize: number = 3
) {
  const [itemPool, setItemPool] = useState<ItemPoolType<T>>({
    id: tag,
    tag,
    items: currentItems,
    currentPage: currentPage || 1,
    poolChunkSize: poolChunkSize || 5,
    selectedSize: selectedSize || 3,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const initSelectedIndexes = Array.from(
    { length: selectedSize },
    (_, index) => index
  );
  const [selectedIndexes, setSelectedIndexes] =
    useState<number[]>(initSelectedIndexes);

  const { searchSingle } = useImageSearch();
  const incrementPage = useCallback(() => {
    setItemPool((prev) => ({
      ...prev,
      currentPage: prev.currentPage + 1,
    }));
  }, []);

  // mock API call
  const getNewItems = useCallback(
    async (tag: string, page: number, chunkSize: number) => {
      try {
        //const result = await searchSingle(tag, page, chunkSize);
        const result = await mockImagePoolApiCall(tag, page, chunkSize);
        if (result.success && result.images.length > 0) { incrementPage(); }
        console.log("result", result);
        return result.images.map((img) => ({
          id: img.id,
          urls: img.urls,
          alt: img.alt_description || tag,
        }));
      } catch (error) {
        console.error('Error getting new items:', error);
        return [];
      }
    },
    [incrementPage]
  );

  const getSelectedImages = useCallback(() => {
    return selectedIndexes.map((index) => itemPool.items[index] as T);
  }, [itemPool.items, selectedIndexes]);

  // fillPool should be async and not use setItemPool with an async updater
  const fillPool = useCallback(async () => {
    try {
      const items = await getNewItems(itemPool.tag, itemPool.currentPage, itemPool.poolChunkSize);
      const typedItems = items.map((item) => item as T);
      setItemPool((prev) => ({
        ...prev,
        items: [...prev.items, ...typedItems],
      }));
      return typedItems;
    } catch (error) {
      console.error('Error getting new items:', error);
      return [];
    }
  }, [itemPool.tag, itemPool.currentPage, itemPool.poolChunkSize, getNewItems]);

  // useEffect(() => {
  useEffect(() => {
    if (itemPool.items.length === 0 && !isInitialized) {
      fillPool().then(() => {
        setIsInitialized(true);
      });
    }
  }, []); // Empty dependency array - runs only once

  // ✅ Initialize selected indexes after items are loaded
  useEffect(() => {
    if (itemPool.items.length > 0 && selectedIndexes.length === 0) {
      const initIndexes = Array.from(
        { length: Math.min(selectedSize, itemPool.items.length) },
        (_, index) => index
      );
      setSelectedIndexes(initIndexes);
    }
  }, [itemPool.items.length, selectedSize, selectedIndexes.length]);

  const getItem = useCallback(
    (index: number) => {
      return itemPool.items[index];
    },
    [itemPool.items]
  );

  const getItemIndex = useCallback(
    (itemId: string) => {
      return itemPool.items.findIndex((i) => {
        if (typeof i === "object" && i !== null && "id" in i) {
          return i.id === itemId;
        }
        return false;
      });
    },
    [itemPool.items]
  );

  const findNewIndex = useCallback(
    (mod: number, currentIndex: number, selectedIndexes: number[]) => {
      let newIndex = currentIndex;
      const min = 0;
      const max = itemPool.items.length;

      let intterations = 0;
      const intterationsLimit = 100;
      while (newIndex <= max && intterations < intterationsLimit) {
        newIndex += mod;
        intterations++;
        if (newIndex < min) {
          newIndex = currentIndex;
        }
        if (!selectedIndexes.includes(newIndex)) {
          return newIndex;
        }
      }
      return currentIndex;
    },
    [itemPool.items.length]
  );

  const navigateItemPool = useCallback(
    async (currentIndex: number, modifier: number = 1) => {
      const newIndex = findNewIndex(modifier, currentIndex, selectedIndexes);

      let newItem = null;
      newItem = getItem(newIndex);
      if (newIndex === itemPool.items.length) {
        const newItems = await fillPool();
        newItem = newItems[0];
      }
      setSelectedIndexes((prev) =>
        prev.map((i) => (i === currentIndex ? newIndex : i))
      );

      console.log("selectedIndexes", selectedIndexes);
      console.log("newItem", newItem);
      return newItem || (getItem(currentIndex) as T);
    },
    [
      findNewIndex,
      getItem,
      fillPool,
      selectedIndexes,
      itemPool.items,
    ]
  );

  const addItem = useCallback(() => {
    const highestSelectedIndex = Math.max(...selectedIndexes);
    const nextIndex = highestSelectedIndex + 1;

    // Ensure we have enough items in the pool
    if (nextIndex >= itemPool.items.length) {
      fillPool();
    }
    setSelectedIndexes((prev) => [...prev, nextIndex]);
  }, [selectedIndexes, fillPool, itemPool.items.length]);

  const manageItemPool = useCallback(
    (action: ItemPoolAction) => {
      const { type } = action;
      let index = 0;
      if ("payload" in action) {
        index = getItemIndex(action.payload.itemId);
        if (index === -1) { return };
      }
      switch (type) {
        case "ADD":
          addItem();
          break;
        case "DELETE": 
          setSelectedIndexes((prev) => prev.filter((i) => i !== index));
          break;
        case "NEXT":
          navigateItemPool(index, 1);
          break;
        case "PREV":
          navigateItemPool(index, -1);
          break;
        default:
          break;
      }
    },
    [addItem, getItemIndex, navigateItemPool]
  );

  return { getSelectedImages, manageItemPool };
}

export default useItemPool;
