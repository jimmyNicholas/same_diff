import { useState, useCallback } from "react";

export type ManageItemPoolAction = "next" | "prev" | "add" | "delete";

interface ItemPoolType<T> {
  id: string;
  tag: string;
  items: T[];
  size?: number;
  selectedSize?: number;
}

function useItemPool<T>(
  tag: string,
  currentItems: T[] = [],
  size: number = 5,
  selectedSize: number = 3
) {
  const [itemPool, setItemPool] = useState<ItemPoolType<T>>({
    id: tag,
    tag,
    items: currentItems,
    size: size || 5,
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
    const newItems = getNewItems(itemPool.tag, itemPool.size || 5).map(
      (item) => item as T
    );

    setItemPool((prev) => ({
      ...prev,
      items: [...prev.items, ...newItems],
    }));
    return newItems[0] as T;
  }, [itemPool.tag, itemPool.size, getNewItems]);

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
    (action: "next" | "prev", itemId: string) => {
      console.log("manageItemPool", action, itemId);
      console.log("itemPool", itemPool.items);

      const currentIndex = getItemIndex(itemId) || 0;
      const mod = action === "next" ? 1 : action === "prev" ? -1 : 0;
      const newIndex = findNewIndex(mod, currentIndex, selectedIndexes);

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
      getItemIndex,
      findNewIndex,
      getItem,
      fillPool,
      selectedIndexes,
      itemPool.items,
    ]
  );

  const updateItemPool = useCallback(
    (action: "add" | "delete", itemId?: string) => {
      if (action === "add") {
        const highestSelectedIndex = Math.max(...selectedIndexes);
        const nextIndex = highestSelectedIndex + 1;

        // Ensure we have enough items in the pool
        if (nextIndex >= itemPool.items.length) {
          fillPool();
        }

        setSelectedIndexes((prev) => [...prev, nextIndex]);
      } else if (action === "delete") {
        if (!itemId) { return; }
        const index = getItemIndex(itemId);
        if (index === -1) {
          return;
        }
        setSelectedIndexes((prev) => prev.filter((i) => i !== index));
      }
    },
    [selectedIndexes, fillPool, itemPool.items.length, getItemIndex]
  );

  const manageItemPool = useCallback(
    (action: "add" | "delete" | "next" | "prev", itemId?: string) => {
      switch (action) {
        case "add":
          updateItemPool("add");
          break;
        case "delete":
          updateItemPool("delete", itemId);
          break;
        case "next":
          if (!itemId) {
            return;
          }
          navigateItemPool("next", itemId);
          break;
        case "prev":
          if (!itemId) {
            return;
          }
          navigateItemPool("prev", itemId);
          break;
        default:
          break;
      }
    },
    [updateItemPool, navigateItemPool]
  );

  return { getSelectedImages, manageItemPool };
}

export default useItemPool;
