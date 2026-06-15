import type { PuzzleState } from "@/modules/puzzle/types/puzzle";

/** Manhattan distance heuristic for A* on sliding puzzles. */
export function manhattanDistance(state: PuzzleState): number {
  throw new Error("Not implemented");
}

/** Misplaced tile count heuristic. */
export function misplacedTiles(state: PuzzleState): number {
  throw new Error("Not implemented");
}
