import type { PuzzleAlgorithmId } from "@/shared/constants";
import type { PuzzleState } from "@/modules/puzzle/types";
import type { SolverOptions, SolverResult } from "@/modules/puzzle/types";

// --- Priority Queue ---

interface PriorityQueueItem<T> {
  value: T;
  priority: number;
}

/*
 * Min-heap priority queue for Dijkstra and A*.
 * Lower numeric priority = dequeued first (e.g. lower path cost or f-score).
 */
export class PriorityQueue<T> {
  private items: PriorityQueueItem<T>[] = [];

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /*
   * Returns the highest-priority item without removing it.
   * @returns The next value that dequeue would return, or undefined if empty.
   */
  peek(): T | undefined {
    return this.items[0]?.value;
  }

  /*
   * Inserts a value with the given priority.
   * @param value - The item to store (e.g. a search node or state key).
   * @param priority - Sort key; lower numbers leave the queue first.
   */
  enqueue(value: T, priority: number): void {
    this.items.push({ value, priority });
    this.bubbleUp(this.items.length - 1);
  }

  /*
   * Removes and returns the lowest-priority-number item.
   * @returns The highest-priority value, or undefined if the queue is empty.
   */
  dequeue(): T | undefined {
    if (this.items.length === 0) {
      return undefined;
    }
    if (this.items.length === 1) {
      return this.items.pop()!.value;
    }

    const min = this.items[0].value;
    // Move last leaf to root, then restore heap property.
    this.items[0] = this.items.pop()!;
    this.bubbleDown(0);
    return min;
  }

  // Restore min-heap order after enqueue by swapping with parent while too small.
  private bubbleUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.items[parent].priority <= this.items[index].priority) {
        break;
      }
      [this.items[parent], this.items[index]] = [this.items[index], this.items[parent]];
      index = parent;
    }
  }

  // Restore min-heap order after dequeue by swapping with smaller child while too large.
  private bubbleDown(index: number): void {
    const length = this.items.length;

    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;

      if (left < length && this.items[left].priority < this.items[smallest].priority) {
        smallest = left;
      }
      if (right < length && this.items[right].priority < this.items[smallest].priority) {
        smallest = right;
      }
      if (smallest === index) {
        break;
      }

      [this.items[index], this.items[smallest]] = [this.items[smallest], this.items[index]];
      index = smallest;
    }
  }
}

// --- Heuristics ---

export function manhattanDistance(_state: PuzzleState): number {
  throw new Error("Not implemented");
}

export function misplacedTiles(_state: PuzzleState): number {
  throw new Error("Not implemented");
}

// --- Solvers ---

export function solveBfs(_initial: PuzzleState, _options?: SolverOptions): SolverResult {
  throw new Error("Not implemented");
}

export function solveDijkstra(_initial: PuzzleState, _options?: SolverOptions): SolverResult {
  throw new Error("Not implemented");
}

export function solveAstar(_initial: PuzzleState, _options?: SolverOptions): SolverResult {
  throw new Error("Not implemented");
}

export const PUZZLE_SOLVERS: Record<
  PuzzleAlgorithmId,
  (initial: PuzzleState, options?: SolverOptions) => SolverResult
> = {
  bfs: solveBfs,
  dijkstra: solveDijkstra,
  astar: solveAstar,
};
