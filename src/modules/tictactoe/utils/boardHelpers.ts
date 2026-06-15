import type { Board, GameState, Player } from "@/modules/tictactoe/types/tictactoe";
import type { Move } from "@/modules/tictactoe/types/move";

export const BOARD_SIZE = 9;

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

export function applyMove(board: Board, move: Move): Board {
  throw new Error("Not implemented");
}

export function switchPlayer(player: Player): Player {
  return player === "X" ? "O" : "X";
}
