export interface PriorityQueueItem<T> {
  value: T;
  priority: number;
}

/** Min-heap priority queue for graph search algorithms. */
export class PriorityQueue<T> {
  private items: PriorityQueueItem<T>[] = [];

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  enqueue(value: T, priority: number): void {
    throw new Error("Not implemented");
  }

  dequeue(): T | undefined {
    throw new Error("Not implemented");
  }

  peek(): T | undefined {
    throw new Error("Not implemented");
  }
}
