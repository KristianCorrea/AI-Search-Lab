import type { TicTacToeAlgorithmId } from "@/shared/constants";

export type Player = "X" | "O";
export type CellValue = Player | null;
export type Board = CellValue[];
export type GameStatus = "playing" | "won" | "draw";

export type GameMode = "human-ai" | "ai-ai";

export interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
}

export interface Move {
  index: number;
  player: Player;
}

export interface MoveResult {
  move: Move;
  score: number;
  nodesVisited: number;
  depth: number;
  nodesPruned?: number;
  pruningRate?: number;
  elapsedMs?: number;
}

/**
 * A snapshot of one completed move, including the resulting board and any
 * AI search metrics. Human moves have `moveResult: null`.
 */
export interface MoveRecord {
  moveNumber: number;
  player: Player;
  cellIndex: number;
  algorithm: TicTacToeAlgorithmId | "human";
  boardAfter: Board;
  moveResult: MoveResult | null;
  winningLine: number[] | null;
  gameStatus: GameStatus;
  winner: Player | null;
}
