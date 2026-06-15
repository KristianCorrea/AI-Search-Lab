import type { PuzzleState } from "@/modules/puzzle/types/puzzle";

export function serializeState(state: PuzzleState): string {
  return `${state.size}:${state.tiles.join(",")}`;
}

export function deserializeState(serialized: string): PuzzleState {
  const [sizeStr, tilesStr] = serialized.split(":");
  const size = Number(sizeStr);
  const tiles = tilesStr.split(",").map(Number);
  const blankIndex = tiles.indexOf(0);
  return { size, tiles, blankIndex };
}
