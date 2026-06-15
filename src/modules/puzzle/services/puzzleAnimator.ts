import type { PuzzleMove, PuzzleState } from "@/modules/puzzle/types/puzzle";

export interface AnimationStep {
  state: PuzzleState;
  move?: PuzzleMove;
  delayMs: number;
}

/** Builds animation frames from a solution path. */
export function buildAnimationSequence(
  _initial: PuzzleState,
  _moves: PuzzleMove[],
  _stepDelayMs = 200,
): AnimationStep[] {
  throw new Error("Not implemented");
}
