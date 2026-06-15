import type { Board, GameStatus, Player } from "@/modules/tictactoe/types/tictactoe";

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export function findWinner(board: Board): Player | null {
  throw new Error("Not implemented");
}

export function getGameStatus(board: Board): GameStatus {
  throw new Error("Not implemented");
}

export function getWinningLine(board: Board): number[] | null {
  throw new Error("Not implemented");
}
