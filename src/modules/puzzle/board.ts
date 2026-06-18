import type { PuzzleMove, PuzzleState } from "@/modules/puzzle/types";

export function createSolvedState(size: number): PuzzleState {
  const total = size * size;
  const tiles = Array.from({ length: total - 1 }, (_, i) => i + 1);
  tiles.push(0);
  return { size, tiles, blankIndex: total - 1 };
}

export function statesEqual(a: PuzzleState, b: PuzzleState): boolean {
  return a.size === b.size && a.tiles.every((tile, i) => tile === b.tiles[i]);
}

export function serializeState(state: PuzzleState): string {
  return `${state.size}:${state.tiles.join(",")}`;
}

export function deserializeState(serialized: string): PuzzleState {
  const [sizeStr, tilesStr] = serialized.split(":");
  const size = Number(sizeStr);
  const tiles = tilesStr.split(",").map(Number);
  return { size, tiles, blankIndex: tiles.indexOf(0) };
}

export function getNeighbors(_state: PuzzleState): PuzzleState[] {
  throw new Error("Not implemented");
}

export function applyMove(_state: PuzzleState, _move: PuzzleMove): PuzzleState {
  throw new Error("Not implemented");
}

export function isSolvable(_state: PuzzleState): boolean {
  throw new Error("Not implemented");
}

export function stateFromTiles(size: number, tiles: number[]): PuzzleState {
  return { size, tiles: [...tiles], blankIndex: tiles.indexOf(0) };
}
