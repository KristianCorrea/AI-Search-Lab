import type { Board, GameState, Move, Player, CellValue } from "@/modules/tictactoe/types";

export const BOARD_SIZE = 9;

export const WIN_LINES = [
  
  // Horizontal Line Victory 
  [0, 1, 2], 
  [3, 4, 5],
  [6, 7, 8],

  // Vertical Line Victory
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  // Diagonal Line Victory
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

export function applyMove(board: Board, move: Move): Board {
  const { index, player } = move;

  // If out of bounds
  if (index < 0 || index >= BOARD_SIZE) {
    throw new Error (`Invalid move index: ${index}`);
  }

  // If spot is occupied
  if (board[index] != null) {
    throw new Error (`Index ${index} already occupied`); 
  }

  const nextBoard = [...board]  // Get board copy
  nextBoard[index] = player;    // Set player's move at their index

  return nextBoard;
}

export function switchPlayer(player: Player): Player {
  return player === "X" ? "O" : "X";
}

export function findWinner(board: Board): Player | null {
  for (const [a, b, c] of WIN_LINES) { // Each set of 3 winning states

    // Check if not null, and A matches B matches C
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {

      return board[a]; // Return winning player identity
    } 
  }

  return null; // No winner
}

export function getGameStatus(board: Board): GameState["status"] {
  const winner = findWinner(board); //Check if there is a winner

  if (winner) {
    return "won"; // If a winner exists, return the game has been won
  }

  // Else check if the board has an empty square still available
  const hasEmptyCells = board.some(cell => cell === null);

  // If an empty square exists, game is still playing. Otherwise draw
  return hasEmptyCells ? "playing" : "draw";
}

export function getWinningLine(board: Board): number[] | null {
  for (const line of WIN_LINES) { // Each set of 3 winning states 
    const [a, b, c] = line; // Break the number into 3 pieces 

    // Check if not null, and A matches B matches C
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {

      return [...line]; // Return winning line
    } 
  }

  return null; // No winner
}

export function getWinner(board: Board): CellValue {
  const winnerLine = getWinningLine(board); // Get winning Line

  if (!winnerLine) { // If it doesn't exist

    return null;  // No winner
  }

  // Funky stuff to get the winner
  const [a] = winnerLine;
   return board[a]; 
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
