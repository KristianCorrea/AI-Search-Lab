export type Player = "X" | "O";
export type CellValue = Player | null;
export type Board = CellValue[];
export type GameStatus = "playing" | "won" | "draw";

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
