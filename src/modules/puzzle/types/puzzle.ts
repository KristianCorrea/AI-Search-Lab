export type TileValue = number;

export interface PuzzleState {
  size: number;
  tiles: TileValue[];
  blankIndex: number;
}

export interface PuzzleMove {
  fromIndex: number;
  toIndex: number;
  direction: "up" | "down" | "left" | "right";
}

export interface PuzzleConfig {
  size: number;
  imageUrl?: string;
  shuffleMoves?: number;
}
