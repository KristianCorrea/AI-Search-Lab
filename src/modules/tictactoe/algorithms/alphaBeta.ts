import type { Board, Player } from "@/modules/tictactoe/types/tictactoe";
import type { MoveResult } from "@/modules/tictactoe/types/move";

export interface AlphaBetaOptions {
  maxDepth?: number;
}

export function findBestMoveAlphaBeta(
  _board: Board,
  _player: Player,
  _options?: AlphaBetaOptions,
): MoveResult {
  throw new Error("Not implemented");
}
