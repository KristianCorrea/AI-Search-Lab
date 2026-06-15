import type { PuzzleMove, PuzzleState } from "@/modules/puzzle/types/puzzle";
import type { PuzzleAlgorithmId } from "@/shared/constants/algorithms";

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
