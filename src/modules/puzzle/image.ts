import type { PuzzleConfig, PuzzleState } from "@/modules/puzzle/types";

export interface SlicedTile {
  index: number;
  dataUrl: string;
}

export interface SliceResult {
  size: number;
  tiles: SlicedTile[];
  sourceWidth: number;
  sourceHeight: number;
}

export async function sliceImage(_file: File, _gridSize: number): Promise<SliceResult> {
  throw new Error("Not implemented");
}

export function shufflePuzzle(_state: PuzzleState, _moves: number): PuzzleState {
  throw new Error("Not implemented");
}

export function generatePuzzle(_config: PuzzleConfig): PuzzleState {
  throw new Error("Not implemented");
}
