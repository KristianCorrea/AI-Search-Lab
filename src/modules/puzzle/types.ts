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

export interface NeighborResult {
  state: PuzzleState;
  move: PuzzleMove;
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

/** Function that returns an admissible estimate of remaining cost from a state to the goal. Used by A*. */
export type Heuristic = (state: PuzzleState) => number;

export interface SolverOptions {
  maxNodes?: number;
  timeoutMs?: number;
  /** A* only. Defaults to `manhattanDistance` when omitted. */
  heuristic?: Heuristic;
}

export type PuzzleSolver = (
  initial: PuzzleState,
  options?: SolverOptions,
) => SolverResult;
