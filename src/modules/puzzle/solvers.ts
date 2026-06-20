import { createSolvedState, getNeighbors, serializeState } from "@/modules/puzzle/board";
import { PriorityQueue } from "@/modules/puzzle/PriorityQueue";
import { createTimer } from "@/shared/metrics";
import type { PuzzleMove, PuzzleState } from "@/modules/puzzle/types";
import type { PuzzleAlgorithmId } from "@/shared/constants";
import type { SolverOptions, SolverResult } from "@/modules/puzzle/types";

// --- Heuristics ---

/*
 * Calculates the Manhattan distance between the tiles and the goal position.
 * This is an admissible heuristic for the A* algorithm.
 * @param state - The puzzle state to calculate the Manhattan distance for.
 * @returns The Manhattan distance.
 */
export function manhattanDistance(state: PuzzleState): number {
  const { size, tiles } = state;
  let total = 0; // total Manhattan distance of all tiles

  for (let i = 0; i < tiles.length; i++) { // iterate over all tiles
    const tile = tiles[i];
    if (tile === 0) continue; // skip the blank tile

    // In the goal layout, tile value n sits at index n - 1.
    const goalIndex = tile - 1;
    const row = Math.floor(i / size);
    const col = i % size;
    const goalRow = Math.floor(goalIndex / size);
    const goalCol = goalIndex % size;

    total += Math.abs(row - goalRow) + Math.abs(col - goalCol); // add the Manhattan distance of the tile
  }

  return total;
}

/*
 * Calculates the number of tiles that are not in the correct position.
 * This is an admissible heuristic for the A* algorithm. (weaker than Manhattan distance)
 * @param state - The puzzle state to calculate the number of misplaced tiles for.
 * @returns The number of misplaced tiles.
 */
export function misplacedTiles(state: PuzzleState): number {
  const { tiles } = state;
  let count = 0;

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    if (tile === 0) continue;
    if (i !== tile - 1) count++;
  }

  return count;
}

// --- Solvers ---

/*
 * Solves the puzzle using Breadth-First Search. This is a blind search algorithm.
 * @param initial - The initial puzzle state.
 * @param options - The solver options. (optional)
 * @returns The solver result.
 */
export function solveBfs(_initial: PuzzleState, _options?: SolverOptions): SolverResult {
  throw new Error("Not implemented");
}

/*
 * Solves the puzzle using Dijkstra's algorithm. This is a uniform-cost search algorithm.
 * @param initial - The initial puzzle state.
 * @param options - The solver options. (optional)
 * @returns The solver result.
 */
export function solveDijkstra(_initial: PuzzleState, _options?: SolverOptions): SolverResult {
  throw new Error("Not implemented");
}

/*
 * Solves the puzzle using A* algorithm. This is a best-first search algorithm.
 * @param initial - The initial puzzle state.
 * @param options - The solver options. (optional)
 * @returns The solver result.
 */
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
