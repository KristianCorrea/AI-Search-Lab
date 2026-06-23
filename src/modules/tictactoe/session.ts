import type { TicTacToeAlgorithmId } from "@/shared/constants";
import { findBestMoveMinimax, findBestMoveAlphaBeta } from "@/modules/tictactoe/ai";
import { createEmptyBoard, getWinningLine } from "@/modules/tictactoe/game";
import type { Board, GameState, MoveRecord, MoveResult, Player, PositionAnalysis, AdvisoryConsensus } from "@/modules/tictactoe/types";

export const INITIAL_BOARD: Board = createEmptyBoard();

export function runAiSearch(
  board: Board,
  player: Player,
  algorithm: TicTacToeAlgorithmId,
): MoveResult {
  return algorithm === "minimax"
    ? findBestMoveMinimax(board, player)
    : findBestMoveAlphaBeta(board, player);
}

/**
 * Run both search algorithms on the same position and compare move + score.
 * Used by Human vs Human mode to show live algorithm advisory.
 */
export function analyzePosition(board: Board, player: Player): PositionAnalysis {
  const minimax = findBestMoveMinimax(board, player);
  const alphaBeta = findBestMoveAlphaBeta(board, player);

  let consensus: AdvisoryConsensus;
  if (minimax.move.index === alphaBeta.move.index) {
    consensus = "agree";
  } else if (minimax.score === alphaBeta.score) {
    consensus = "same-score";
  } else {
    consensus = "disagree";
  }

  return { minimax, alphaBeta, consensus };
}

/** "R2C3" label for a flat cell index 0–8. */
export function cellLabel(index: number): string {
  return `R${Math.floor(index / 3) + 1}C${(index % 3) + 1}`;
}

/** Build a move-log entry from a completed move and resulting game state. */
export function buildMoveRecord(
  moveNumber: number,
  player: Player,
  cellIndex: number,
  algorithm: MoveRecord["algorithm"],
  boardAfter: Board,
  moveResult: MoveResult | null,
  gameStatus: GameState["status"],
  winner: Player | null,
): MoveRecord {
  return {
    moveNumber,
    player,
    cellIndex,
    algorithm,
    boardAfter,
    moveResult,
    winningLine: getWinningLine(boardAfter),
    gameStatus,
    winner,
  };
}
