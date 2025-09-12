import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  createItemPoolService,
  ItemPoolServiceInterface,
} from "../itemPoolService";

// ===== MOCK DATA & TYPES =====
interface MockItem {
  id: string;
  name: string;
  value: number;
}

// ===== TEST UTILITIES =====
function createMockItem(id: string, name: string): MockItem {
  return { id, name, value: Math.random() };
}

function createMockItems(count: number): MockItem[] {
  return Array.from({ length: count }, (_, i) =>
    createMockItem(`item-${i}`, `Item ${i}`)
  );
}

// ===== TEST SETUP =====
describe("ItemPoolService", () => {
  let items: MockItem[];
  let service: ItemPoolServiceInterface<MockItem>;
  let mockFetchItems: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    items = createMockItems(10);
    mockFetchItems = vi.fn().mockImplementation((tag, page, chunkSize) => {
      const start = (page - 1) * chunkSize + 2;
      return Promise.resolve(items.slice(start, start + chunkSize));
    });

    service = await createItemPoolService({
      id: "test-pool",
      tag: "test-tag",
      pool: items.slice(0, 2), // Start with 2 items
      selectedIndexes: [],
      options: { currentPage: 1, poolChunkSize: 5, selectedSize: 3 },
      fetchItems: mockFetchItems,
    });
  });

  // ===== INITIALIZATION TESTS =====
  describe("Initialization", () => {
    it("should create service with correct properties", () => {
      expect(service).toBeDefined();
      expect(service.id).toBe("test-pool");
      expect(service.tag).toBe("test-tag");
    });

    it("should fetch items when pool is smaller than selectedSize", () => {
      expect(mockFetchItems).toHaveBeenCalledWith("test-tag", 1, 5);
    });

    it("should have correct number of selected items", () => {
      expect(service.getSelectedItems()).toHaveLength(3);
    });

    it("should set default selected indexes when none provided", () => {
      const selectedItems = service.getSelectedItems();
      expect(selectedItems).toHaveLength(3);
      expect(selectedItems[0].id).toBe("item-0");
      expect(selectedItems[1].id).toBe("item-1");
      expect(selectedItems[2].id).toBe("item-2");
    });
  });

  // ===== DEFAULT OPTIONS TESTS =====
  describe("Default Options", () => {
    it("should use default currentPage (1)", async () => {
      const mockFetch = vi.fn().mockResolvedValue(items.slice(0, 5));

      await createItemPoolService({
        id: "test",
        tag: "test",
        pool: [],
        selectedIndexes: [],
        options: {
          currentPage: undefined as unknown as number,
          poolChunkSize: 5,
          selectedSize: 3,
        },
        fetchItems: mockFetch,
      });

      expect(mockFetch).toHaveBeenCalledWith("test", 1, 5);
    });

    it("should use default poolChunkSize (5)", async () => {
      const mockFetch = vi.fn().mockResolvedValue(items.slice(0, 5));

      await createItemPoolService({
        id: "test",
        tag: "test",
        pool: [],
        selectedIndexes: [],
        options: {
          currentPage: 1,
          poolChunkSize: undefined as unknown as number,
          selectedSize: 3,
        },
        fetchItems: mockFetch,
      });

      expect(mockFetch).toHaveBeenCalledWith("test", 1, 5);
    });

    it("should use default selectedSize (3)", async () => {
      const mockFetch = vi.fn().mockResolvedValue(items.slice(0, 5));

      const service = await createItemPoolService({
        id: "test",
        tag: "test",
        pool: [],
        selectedIndexes: [],
        options: {
          currentPage: 1,
          poolChunkSize: 5,
          selectedSize: undefined as unknown as number,
        },
        fetchItems: mockFetch,
      });

      expect(service.getSelectedItems()).toHaveLength(3);
    });
  });

  // ===== POOL MANAGEMENT TESTS =====
  
  describe('Pool Management', () => {
    it('should add new item to selection', async () => {
      const initialCount = service.getSelectedItems().length;
      
      const result = await service.manageItemPool({ type: 'ADD' });
      
      expect(result).toBeDefined();
      expect(service.getSelectedItems()).toHaveLength(initialCount + 1);
    });

    it('should remove item from selection when deleting', async () => {
      const initialCount = service.getSelectedItems().length;
      const firstItem = service.getSelectedItems()[0];
      
      await service.manageItemPool({ 
        type: 'DELETE', 
        payload: { itemId: firstItem.id } 
      });
      
      expect(service.getSelectedItems()).toHaveLength(initialCount - 1);
      expect(service.getSelectedItems()).not.toContainEqual(firstItem);
    });

    it('should handle delete of non-existent item gracefully', async () => {
      const initialSelection = service.getSelectedItems();
      
      await service.manageItemPool({ 
        type: 'DELETE', 
        payload: { itemId: 'non-existent' } 
      });
      
      expect(service.getSelectedItems()).toEqual(initialSelection);
    });
  });

  // ===== NAVIGATION TESTS =====
  
  describe('Navigation', () => {
    it('should move to next available item when navigating forward', async () => {
      const initialSelection = service.getSelectedItems();
      const firstItem = initialSelection[0];
      
      await service.manageItemPool({ type: "NEXT", payload: { itemId: firstItem.id } });
      
      const newSelection = service.getSelectedItems();
      expect(newSelection[0]).not.toEqual(firstItem);
      expect(newSelection[0]).toBeDefined();
    });

    it('should move to previous available item when navigating backward after moving forward', async () => {
        const initialSelection = service.getSelectedItems();
        const firstItem = initialSelection[0];
        
        await service.manageItemPool({ type: "NEXT", payload: { itemId: firstItem.id } });
        
        const newSelection = service.getSelectedItems();
        expect(newSelection[0]).not.toEqual(firstItem);
        expect(newSelection[0]).toBeDefined();

        await service.manageItemPool({ type: "PREV", payload: { itemId: newSelection[0].id } });
        
        const newSelection2 = service.getSelectedItems();
        expect(newSelection2[0]).toEqual(firstItem);
        expect(newSelection2[0]).toBeDefined();
    });
    
    it('should not move to previous available item when navigating backward', async () => {
      const initialSelection = service.getSelectedItems();
      const firstItem = initialSelection[0];
      
      await service.manageItemPool({ type: "PREV", payload: { itemId: firstItem.id } });
      
      const newSelection = service.getSelectedItems();
      expect(newSelection[0]).toEqual(firstItem);
      expect(newSelection[0]).toBeDefined();
    });

    it('should skip already selected items during navigation', async () => {
      const allItems = service.getSelectedItems();
      const firstItem = allItems[0];
      
      await service.manageItemPool({ type: "NEXT", payload: { itemId: firstItem.id } });
      
      const newSelection = service.getSelectedItems();
      // The new item should not be in the original selection
      expect(allItems).not.toContainEqual(newSelection[0]);
    });

    it('should maintain selection count during navigation', async () => {
      const initialCount = service.getSelectedItems().length;
      
      await service.manageItemPool({ 
        type: "NEXT", 
        payload: { itemId: service.getSelectedItems()[0].id } 
      });
      
      expect(service.getSelectedItems()).toHaveLength(initialCount);
    });

    it('should handle navigation of non-existent item gracefully', async () => {
      const initialSelection = service.getSelectedItems();
      
      await service.manageItemPool({ 
        type: "NEXT", 
        payload: { itemId: 'non-existent' } 
      });
      
      expect(service.getSelectedItems()).toEqual(initialSelection);
    });
  });
  
  // ===== TAG MANAGEMENT TESTS =====
  
  describe('Tag Management', () => {
    it('should update tag', async () => {
      const newTag = 'new-tag';
      
      await service.manageItemPool({ 
        type: 'UPDATE_TAG', 
        payload: { tag: newTag } 
      });
      
      expect(service.tag).toBe(newTag);
    });

    it('should preserve selection when updating tag', async () => {
      const initialSelection = service.getSelectedItems();
      
      await service.manageItemPool({ 
        type: 'UPDATE_TAG', 
        payload: { tag: 'new-tag' } 
      });
      
      expect(service.getSelectedItems()).toEqual(initialSelection);
    });
  });

  // ===== EDGE CASES =====
  describe("Edge Cases", () => {
    it("should handle empty pool initialization", async () => {
      const mockFetch = vi.fn().mockResolvedValue(items.slice(0, 5));

      const service = await createItemPoolService({
        id: "test",
        tag: "test",
        pool: [],
        selectedIndexes: [],
        options: { currentPage: 1, poolChunkSize: 5, selectedSize: 3 },
        fetchItems: mockFetch,
      });

      expect(service.getSelectedItems()).toHaveLength(3);
      expect(mockFetch).toHaveBeenCalled();
    });

    it("should handle pool larger than selectedSize", async () => {
      const mockFetch = vi.fn().mockResolvedValue([]);

      const service = await createItemPoolService({
        id: "test",
        tag: "test",
        pool: items.slice(0, 10), // More than selectedSize
        selectedIndexes: [],
        options: { currentPage: 1, poolChunkSize: 5, selectedSize: 3 },
        fetchItems: mockFetch,
      });

      expect(service.getSelectedItems()).toHaveLength(3);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should preserve custom selected indexes", async () => {
      const customIndexes = [1, 3, 5];
      const mockFetch = vi.fn().mockResolvedValue([]);

      const service = await createItemPoolService({
        id: "test",
        tag: "test",
        pool: items.slice(0, 10),
        selectedIndexes: customIndexes,
        options: { currentPage: 1, poolChunkSize: 5, selectedSize: 3 },
        fetchItems: mockFetch,
      });

      const selectedItems = service.getSelectedItems();
      expect(selectedItems).toHaveLength(3);
      expect(selectedItems[0].id).toBe("item-1");
      expect(selectedItems[1].id).toBe("item-3");
      expect(selectedItems[2].id).toBe("item-5");
    });
  });

  // ===== ERROR HANDLING =====
  
  describe('Error Handling', () => {
    it('should handle fetchItems failure gracefully', async () => {
      const failingFetch = vi.fn().mockRejectedValue(new Error('Fetch failed'));
      
      const service = await createItemPoolService({
        id: 'test',
        tag: 'test',
        pool: [],
        selectedIndexes: [],
        options: { currentPage: 1, poolChunkSize: 5, selectedSize: 3 },
        fetchItems: failingFetch,
      });

      // Should still create service even if fetch fails
      expect(service).toBeDefined();
      expect(service.getSelectedItems()).toHaveLength(0);
    });
  });
});
