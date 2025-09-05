import { useState, useCallback } from "react";

interface ItemPoolType<T> {
  id: string;
  tag: string;
  items: T[];
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
  poolChunkSize: number = 5,
  selectedSize: number = 3
) {
  const [itemPool, setItemPool] = useState<ItemPoolType<T>>({
    id: tag,
    tag,
    items: currentItems,
    poolChunkSize: poolChunkSize || 5,
    selectedSize: selectedSize || 3,
  });

  const initSelectedIndexes = Array.from(
    { length: selectedSize },
    (_, index) => index
  );
  const [selectedIndexes, setSelectedIndexes] =
    useState<number[]>(initSelectedIndexes);

  // mock API call
  const getNewItems = useCallback(
    (tag: string, size: number) => {
      return Array.from({ length: size }, (_, index) => ({
        id: `${tag}-${index + itemPool.items.length}`,
        src: `/images/pug-${index + itemPool.items.length + 1}.jpg`,
        alt: `${tag}-${index + itemPool.items.length}`,
      }));
    },
    [itemPool.items.length]
  );

  const getSelectedImages = useCallback(() => {
    return selectedIndexes.map((index) => itemPool.items[index] as T);
  }, [itemPool.items, selectedIndexes]);

  const fillPool = useCallback(() => {
    const newItems = getNewItems(itemPool.tag, itemPool.poolChunkSize).map(
      (item) => item as T
    );

    setItemPool((prev) => ({
      ...prev,
      items: [...prev.items, ...newItems],
    }));
    return newItems[0] as T;
  }, [itemPool.tag, itemPool.poolChunkSize, getNewItems]);

  if (itemPool.items.length === 0) {
    fillPool();
  }

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
    (currentIndex: number, modifier: number = 1) => {
      const newIndex = findNewIndex(modifier, currentIndex, selectedIndexes);

      let newItem = null;
      newItem = getItem(newIndex);
      if (newIndex === itemPool.items.length) {
        newItem = fillPool();
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
