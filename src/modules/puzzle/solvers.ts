import { createSolvedState, getNeighbors, serializeState } from "@/modules/puzzle/board";
import { PriorityQueue } from "@/modules/puzzle/PriorityQueue";
import { createTimer } from "@/shared/metrics";
import type { Heuristic, PuzzleMove, PuzzleState, SolverOptions, SolverResult } from "@/modules/puzzle/types";
import type { PuzzleAlgorithmId } from "@/shared/constants";
/**
 * Interface for the parent entry of the states.
 * @param state - The state of the parent.
 * @param move - The move that led to the parent state.
 */
interface ParentEntry {
  state: PuzzleState;
  move: PuzzleMove;
}

/*
 * Builds a failure result. Used when the puzzle is not solvable.
 * @param algorithm - The algorithm that failed.
 * @param nodesExpanded - The number of nodes expanded.
 * @param maxFrontierSize - The maximum size of the frontier.
 * @param elapsedMs - The elapsed time in milliseconds.
 * @returns The failure result.
 */
function buildFailureResult(
  algorithm: PuzzleAlgorithmId,
  nodesExpanded: number,
  maxFrontierSize: number,
  elapsedMs: number,
): SolverResult {
  return {
    algorithm,
    solved: false,
    moves: [],
    nodesExpanded,
    maxFrontierSize,
    elapsedMs,
  };
}

/*
 * Reconstructs the path from the start state to the goal state.
 * @param parent - The parent map of the states.
 * @param startKey - The key of the start state.
 * @param goalKey - The key of the goal state.
 * @returns The path from the start state to the goal state.
 */
function reconstructPath(
  parent: Map<string, ParentEntry>,
  startKey: string,
  goalKey: string,
): PuzzleMove[] {
  const moves: PuzzleMove[] = [];
  let key = goalKey;

  while (key !== startKey) {
    const entry = parent.get(key)!;
    moves.unshift(entry.move);
    key = serializeState(entry.state);
  }

  return moves;
}

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
 * Solves the puzzle using A* algorithm. This is a best-first search algorithm. Uses a heuristic to guide the search.
 * @param initial - The initial puzzle state.
 * @param options - The solver options. Pass `options.heuristic` to swap heuristics (e.g. manhattanDistance, misplacedTiles); defaults to manhattanDistance.
 * @returns The solver result.
 */
export function solveAstar(initial: PuzzleState, options?: SolverOptions): SolverResult {
  const timer = createTimer();
  timer.start();

  const heuristic: Heuristic = options?.heuristic ?? manhattanDistance; // Default to Manhattan distance if no heuristic is provided
  const goal = createSolvedState(initial.size); // Create the solved state
  const goalKey = serializeState(goal); // Serialize the solved state
  const startKey = serializeState(initial); // Serialize the initial state

  const frontier = new PriorityQueue<PuzzleState>();
  frontier.enqueue(initial, heuristic(initial));

  const cost = new Map<string, number>([[startKey, 0]]); // Map of cost of each state
  const parent = new Map<string, ParentEntry>(); // Map of parent states
  const closed = new Set<string>(); // Set of visited states

  let nodesExpanded = 0;
  let maxFrontierSize = 1;

  while (!frontier.isEmpty()) {
    // Check if the maximum number of nodes has been reached, if so, break
    if (options?.maxNodes !== undefined && nodesExpanded >= options.maxNodes) {
      break;
    }

    maxFrontierSize = Math.max(maxFrontierSize, frontier.size);

    const current = frontier.dequeue()!; // Get the state with the lowest priority
    const currentKey = serializeState(current);

    if (closed.has(currentKey)) {
      continue;
    }

    closed.add(currentKey); // Add the current state to the set of visited states
    nodesExpanded++;

    if (currentKey === goalKey) { // If the current state is the goal state, return the solution
      return {
        algorithm: "astar",
        solved: true,
        moves: reconstructPath(parent, startKey, goalKey),
        nodesExpanded,
        maxFrontierSize,
        elapsedMs: timer.stop().elapsedMs,
        finalState: current,
      };
    }

    const g = cost.get(currentKey)!; // Get the cost of the current state

    for (const { state: neighbor, move } of getNeighbors(current)) { // Get the neighbors of the current state
      const neighborKey = serializeState(neighbor);

      if (closed.has(neighborKey)) { // If the neighbor state has been visited, skip it
        continue;
      }

      const newCost = g + 1;
      const best = cost.get(neighborKey); // Get the cost of the neighbor state

      if (best === undefined || newCost < best) { // If the neighbor state has not been visited or the new cost is lower, update the cost and parent
        cost.set(neighborKey, newCost); // Set the cost of the neighbor state
        parent.set(neighborKey, { state: current, move }); // Set the parent of the neighbor state
        frontier.enqueue(neighbor, newCost + heuristic(neighbor)); // Add the neighbor state to the frontier
      }
    }
  }

  return buildFailureResult("astar", nodesExpanded, maxFrontierSize, timer.stop().elapsedMs);
}

export const PUZZLE_SOLVERS: Record<
  PuzzleAlgorithmId,
  (initial: PuzzleState, options?: SolverOptions) => SolverResult
> = {
  bfs: solveBfs,
  dijkstra: solveDijkstra,
  astar: solveAstar,
};
