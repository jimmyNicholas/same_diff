export type ItemPoolAction =
| { type: "ADD" }
| { type: "DELETE"; payload: { itemId: string } }
| { type: "NEXT"; payload: { itemId: string } }
| { type: "PREV"; payload: { itemId: string } };

interface ItemPoolOptions {
  currentPage: number,
  poolChunkSize: number,
  selectedSize: number
}

interface ItemPoolProps<T> {
  id: string;
  tag: string;
  pool: T[];
  selectedIndexes: number[];
  options: ItemPoolOptions;
  fetchItems: (tag: string, page: number, chunkSize: number) => Promise<T[]>;
}

class ItemPoolService<T> {
  id: string;
  tag: string;
  private pool: T[];
  private selectedIndexes: number[];
  private options: ItemPoolOptions;
  fetchItems: (tag: string, page: number, chunkSize: number) => Promise<T[]>;

  constructor(props: ItemPoolProps<T>) {
    this.id = props.id;
    this.tag = props.tag;
    this.pool = props.pool;
    this.selectedIndexes = [];
    this.options = {
        currentPage: props.options.currentPage || 1,
        poolChunkSize: props.options.poolChunkSize || 5,
        selectedSize: props.options.selectedSize || 3
    };
    this.fetchItems = props.fetchItems;
  }

  private async _fillPool() {
    const newItems = await this.fetchItems(
        this.tag,
        this.options.currentPage,
        this.options.poolChunkSize
    );
    if (newItems.length > 0) { this.options.currentPage++; }
    this.pool = [...this.pool, ...newItems];
  }

  private async _navigateItemPool(currentIndex: number, modifier: number = 1) {
    let newIndex = currentIndex;
    const min = 0;
    const max = this.pool.length;
    
    // find new index
    let intterations = 0;
    const intterationsLimit = 100;

    while (newIndex <= max && intterations < intterationsLimit) {
      newIndex += modifier;
      intterations++;
      if (newIndex < min) {
        newIndex = currentIndex;
      }
      if (!this.selectedIndexes.includes(newIndex)) {
        return newIndex;
      }
    }

    let newItem = this.pool[newIndex];
    if (newIndex === this.pool.length) {
        await this._fillPool();
        newItem = this.pool[newIndex];
      }
      this.selectedIndexes = this.selectedIndexes.map((index) => index === currentIndex ? newIndex : index);
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
        const highestSelectedIndex = Math.max(...this.selectedIndexes);
        const nextIndex = highestSelectedIndex + 1;
        if (nextIndex >= this.pool.length) {
          await this._fillPool();
        }
        this.selectedIndexes.push(nextIndex);
        return this.pool[nextIndex];

      case "DELETE":
        // Find the index of the item to delete
        index = this.pool.findIndex((item: T) => (item as { id: string }).id === action.payload.itemId);
        if (index !== -1) {
          // Remove the index from selectedIndexes
          this.selectedIndexes = this.selectedIndexes.filter(idx => idx !== index);
        }
        break;

      case "NEXT":
        index = this.pool.findIndex((item: T) => (item as { id: string }).id === action.payload.itemId);
        await this._navigateItemPool(index, 1);
        break;

      case "PREV":
        index = this.pool.findIndex((item: T) => (item as { id: string }).id === action.payload.itemId);
        await this._navigateItemPool(index, -1);
        break;

      default:

        break;
    }
  }
}

export default ItemPoolService;