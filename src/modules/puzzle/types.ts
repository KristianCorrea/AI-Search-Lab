import type { PuzzleAlgorithmId } from "@/shared/constants";

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

export interface SolverResult {
  algorithm: PuzzleAlgorithmId;
  solved: boolean;
  moves: PuzzleMove[];
  nodesExpanded: number;
  maxFrontierSize: number;
  elapsedMs: number;
  finalState?: PuzzleState;
}

export interface SolverOptions {
  maxNodes?: number;
  timeoutMs?: number;
}

export type PuzzleSolver = (
  initial: PuzzleState,
  options?: SolverOptions,
) => SolverResult;
