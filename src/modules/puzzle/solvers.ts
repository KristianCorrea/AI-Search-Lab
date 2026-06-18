import type { PuzzleAlgorithmId } from "@/shared/constants";
import type { PuzzleState } from "@/modules/puzzle/types";
import type { SolverOptions, SolverResult } from "@/modules/puzzle/types";

// --- Priority Queue ---

interface PriorityQueueItem<T> {
  value: T;
  priority: number;
}

// Reserved for Dijkstra / A* — implement in Phase 1
export class PriorityQueue<T> {
  private items: PriorityQueueItem<T>[] = [];

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  enqueue(_value: T, _priority: number): void {
    throw new Error("Not implemented");
  }

  dequeue(): T | undefined {
    throw new Error("Not implemented");
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
