import type { TicTacToeAlgorithmId } from "@/shared/constants";
import type { GameState } from "@/modules/tictactoe/types";

export interface AutoplayOptions {
  algorithmX: TicTacToeAlgorithmId;
  algorithmO: TicTacToeAlgorithmId;
  games: number;
}

export interface AutoplayResult {
  games: GameState[];
  metrics: {
    algorithmId: TicTacToeAlgorithmId;
    nodesVisited: number;
    elapsedMs: number;
  }[];
}

export function runAutoplay(_options: AutoplayOptions): AutoplayResult {
  throw new Error("Not implemented");
}
