import type { PuzzleConfig, PuzzleState } from "@/modules/puzzle/types/puzzle";

/** Generates a shuffled, solvable puzzle from configuration. */
export function generatePuzzle(config: PuzzleConfig): PuzzleState {
  throw new Error("Not implemented");
}

/** Shuffles a solved board with legal moves. */
export function shufflePuzzle(
  state: PuzzleState,
  moves: number,
): PuzzleState {
  throw new Error("Not implemented");
}
