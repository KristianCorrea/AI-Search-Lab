import type { Board, Player } from "@/modules/tictactoe/types/tictactoe";
import type { MoveResult } from "@/modules/tictactoe/types/move";

export interface MinimaxOptions {
  maxDepth?: number;
}

export function findBestMoveMinimax(
  _board: Board,
  _player: Player,
  _options?: MinimaxOptions,
): MoveResult {
  throw new Error("Not implemented");
}
