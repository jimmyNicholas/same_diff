export type ItemPoolAction =
  | { type: "ADD" }
  | { type: "DELETE"; payload: { itemId: string } }
  | { type: "NEXT"; payload: { itemId: string } }
  | { type: "PREV"; payload: { itemId: string } }
  | { type: "UPDATE_TAG"; payload: { tag: string } };

interface ItemPoolOptions {
  currentPage: number;
  poolChunkSize: number;
  initialSize: number;
}

export interface ItemPoolProps<T> {
  id: string;
  tag: string;
  pool: T[];
  selectedIndexes: number[];
  options: ItemPoolOptions;
  fetchItems: (tag: string, page: number, chunkSize: number) => Promise<T[]>;
}

export interface ItemPoolServiceInterface<T> {
  readonly id: string;
  tag: string;
  getSelectedItems(): T[];
  manageItemPool(action: ItemPoolAction): Promise<T | undefined>;
  getAllItems(): T[];
}

class ItemPoolService<T> implements ItemPoolServiceInterface<T> {
  public readonly id: string;
  public tag: string;
  private pool: T[];
  private selectedIndexes: number[];
  private options: ItemPoolOptions;
  private fetchItems: (
    tag: string,
    page: number,
    chunkSize: number
  ) => Promise<T[]>;

  constructor(props: ItemPoolProps<T>) {
    this.id = props.id;
    this.tag = props.tag;
    this.pool = props.pool;
    this.selectedIndexes = props.selectedIndexes || [];
    this.options = {
      currentPage: props.options.currentPage || 1,
      poolChunkSize: props.options.poolChunkSize || 5,
      initialSize: props.options.initialSize || 3,
    };
    this.fetchItems = props.fetchItems;
  }

  public async initialize(): Promise<void> {
    try {
      if (this.pool.length < this.options.initialSize) {
        await this._fillPool();
      }

      if (this.selectedIndexes.length === 0) {
        const maxIndexes = Math.min(
          this.options.initialSize,
          this.pool.length
        );
        this.selectedIndexes = Array.from({ length: maxIndexes }, (_, i) => i);
      }

      this.selectedIndexes = this.selectedIndexes.filter(
        (index) => index < this.pool.length
      );
    } catch (error) {
      console.warn("Failed to initialize item pool:", error);
      const maxIndexes = Math.min(this.options.initialSize, this.pool.length);
      this.selectedIndexes = Array.from({ length: maxIndexes }, (_, i) => i);
    }
  }

  private async _fillPool() {
    try {
      const newItems = await this.fetchItems(
        this.tag,
        this.options.currentPage,
        this.options.poolChunkSize
      );
      if (!Array.isArray(newItems)) {
        console.warn("fetchItems returned non-array:", newItems);
        return;
      }

      if (newItems.length > 0) {
        this.options.currentPage++;
        this.pool = [...this.pool, ...newItems];
      }
    } catch (error) {
      console.warn("Failed to fetch items:", error);
    }
  }

  private async _navigateItemPool(currentIndex: number, modifier: number = 1) {
    let newIndex = currentIndex;
    const min = 0;
    const max = this.pool.length;

    // find new index
    let iterations = 0;
    const iterationsLimit = 100;

    while (newIndex <= max && iterations < iterationsLimit) {
      newIndex += modifier;
      iterations++;

      if (newIndex < min) {
        newIndex = currentIndex;
        break;
      }

      if (newIndex === max) {
        await this._fillPool();
        break;
      }

      if (!this.selectedIndexes.includes(newIndex)) {
        break;
      }
    }

    if (iterations >= iterationsLimit) {
      return this.pool[currentIndex];
    }

    let newItem = this.pool[newIndex];
    if (newIndex === this.pool.length) {
      await this._fillPool();
      newItem = this.pool[newIndex];
    }
    this.selectedIndexes = this.selectedIndexes.map((index) =>
      index === currentIndex ? newIndex : index
    );
    return newItem;
  }

  getSelectedItems() {
    return this.selectedIndexes.map((index) => this.pool[index]);
  }

  getAllItems() {
    return this.pool;
  }

  public async manageItemPool(action: ItemPoolAction) {
    const { type } = action;
    let index = 0;

    switch (type) {
      case "ADD":
        const highestSelectedIndex =
          this.selectedIndexes.length > 0
            ? Math.max(...this.selectedIndexes)
            : -1;
        const nextIndex = highestSelectedIndex + 1;
        if (nextIndex >= this.pool.length) {
          await this._fillPool();
        }
        this.selectedIndexes.push(nextIndex);
        return this.pool[nextIndex];

      case "DELETE":
        // Find the index of the item to delete
        index = this.pool.findIndex(
          (item: T) => (item as { id: string }).id === action.payload.itemId
        );
        if (index !== -1) {
          // Remove the index from selectedIndexes
          this.selectedIndexes = this.selectedIndexes.filter(
            (idx) => idx !== index
          );
        }
        break;

      case "NEXT":
        index = this.pool.findIndex(
          (item: T) => (item as { id: string }).id === action.payload.itemId
        );
        return await this._navigateItemPool(index, 1);

      case "PREV":
        index = this.pool.findIndex(
          (item: T) => (item as { id: string }).id === action.payload.itemId
        );
        return await this._navigateItemPool(index, -1);

      case "UPDATE_TAG":
        this.tag = action.payload.tag;
        this.pool = this.getSelectedItems() as T[];
        this.selectedIndexes = this.selectedIndexes.map((index) => index);
        this.options.currentPage = 1;
        await this._fillPool();
        break;

      default:
        break;
    }
  }
}

export async function createItemPoolService<T>(
  props: ItemPoolProps<T>
): Promise<ItemPoolServiceInterface<T>> {
  const service = new ItemPoolService<T>(props);
  try {
    await service.initialize();
  } catch (error) {
    console.warn("Failed to create item pool service:", error);
  }

  return {
    get id() {
      return service.id;
    },
    get tag() {
      return service.tag;
    },
    getAllItems: service.getAllItems.bind(service),
    getSelectedItems: service.getSelectedItems.bind(service),
    manageItemPool: service.manageItemPool.bind(service),
  };
}

export default createItemPoolService;
