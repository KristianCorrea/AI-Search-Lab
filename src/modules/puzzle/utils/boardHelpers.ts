import type { PuzzleMove, PuzzleState } from "@/modules/puzzle/types/puzzle";

export function createSolvedState(size: number): PuzzleState {
  const total = size * size;
  const tiles = Array.from({ length: total - 1 }, (_, i) => i + 1);
  tiles.push(0);
  return { size, tiles, blankIndex: total - 1 };
}

export function getNeighbors(state: PuzzleState): PuzzleState[] {
  throw new Error("Not implemented");
}

export function applyMove(state: PuzzleState, move: PuzzleMove): PuzzleState {
  throw new Error("Not implemented");
}

export function statesEqual(a: PuzzleState, b: PuzzleState): boolean {
  return a.size === b.size && a.tiles.every((tile, i) => tile === b.tiles[i]);
}
