import type { Board, MoveResult, Player } from "@/modules/tictactoe/types";

export function evaluateBoard(_board: Board, _player: Player): number {
  throw new Error("Not implemented");
}

export function findBestMoveMinimax(
  _board: Board,
  _player: Player,
  _options?: { maxDepth?: number },
): MoveResult {
  throw new Error("Not implemented");
}

export function findBestMoveAlphaBeta(
  _board: Board,
  _player: Player,
  _options?: { maxDepth?: number },
): MoveResult {
  throw new Error("Not implemented");
}
