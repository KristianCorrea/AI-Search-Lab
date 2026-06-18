import type { Board, GameState, Move, Player } from "@/modules/tictactoe/types";

export const BOARD_SIZE = 9;

export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export function createEmptyBoard(): Board {
  return Array(BOARD_SIZE).fill(null);
}

export function createInitialGameState(): GameState {
  return {
    board: createEmptyBoard(),
    currentPlayer: "X",
    status: "playing",
    winner: null,
  };
}

export function getAvailableMoves(board: Board): number[] {
  return board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);
}

export function applyMove(_board: Board, _move: Move): Board {
  throw new Error("Not implemented");
}

export function switchPlayer(player: Player): Player {
  return player === "X" ? "O" : "X";
}

export function findWinner(_board: Board): Player | null {
  throw new Error("Not implemented");
}

export function getGameStatus(_board: Board): GameState["status"] {
  throw new Error("Not implemented");
}

export function getWinningLine(_board: Board): number[] | null {
  throw new Error("Not implemented");
}

export class GameManager {
  private state: GameState;

  constructor() {
    this.state = createInitialGameState();
  }

  getState(): GameState {
    return this.state;
  }

  makeMove(_move: Move): GameState {
    throw new Error("Not implemented");
  }

  reset(): GameState {
    this.state = createInitialGameState();
    return this.state;
  }
}
