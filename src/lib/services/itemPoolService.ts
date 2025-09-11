export type ItemPoolAction =
  | { type: "ADD" }
  | { type: "DELETE"; payload: { itemId: string } }
  | { type: "NEXT"; payload: { itemId: string } }
  | { type: "PREV"; payload: { itemId: string } }
  | { type: "UPDATE_TAG"; payload: { tag: string } };

interface ItemPoolOptions {
  currentPage: number;
  poolChunkSize: number;
  selectedSize: number;
}

interface ItemPoolProps<T> {
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
  }

class ItemPoolService<T> implements ItemPoolServiceInterface<T> {
  public readonly id: string;
  public tag: string;
  private pool: T[];
  private selectedIndexes: number[];
  private options: ItemPoolOptions;
  private fetchItems: (tag: string, page: number, chunkSize: number) => Promise<T[]>;

  constructor(props: ItemPoolProps<T>) {
    this.id = props.id;
    this.tag = props.tag;
    this.pool = props.pool;
    this.selectedIndexes = props.selectedIndexes;
    this.options = {
      currentPage: props.options.currentPage || 1,
      poolChunkSize: props.options.poolChunkSize || 5,
      selectedSize: props.options.selectedSize || 3,
    };
    this.fetchItems = props.fetchItems;
  }

  private async _fillPool() {
    const newItems = await this.fetchItems(
      this.tag,
      this.options.currentPage,
      this.options.poolChunkSize
    );
    if (newItems.length > 0) {
      this.options.currentPage++;
    }
    this.pool = [...this.pool, ...newItems];
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

      if (newIndex <= min) {
        newIndex = currentIndex;
        break;
      }

      if (newIndex === max) {
        await this._fillPool();
        break;
      }

      if (newIndex === min || !this.selectedIndexes.includes(newIndex)) {
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
        break;

      default:
        break;
    }
  }
}

export function createItemPoolService<T>(props: ItemPoolProps<T>): ItemPoolServiceInterface<T> {
    const service = new ItemPoolService<T>(props);
    return {
        get id() { return service.id; },
        get tag() { return service.tag; },
        getSelectedItems: service.getSelectedItems.bind(service),
        manageItemPool: service.manageItemPool.bind(service), 
    };
}

export default createItemPoolService;
