import type { Player } from "@/modules/tictactoe/types/tictactoe";

export interface Move {
  index: number;
  player: Player;
}

export interface MoveResult {
  move: Move;
  score: number;
  nodesVisited: number;
  depth: number;
}
