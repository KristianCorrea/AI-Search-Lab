import type { TicTacToeAlgorithmId } from "@/shared/constants/algorithms";
import type { GameState } from "@/modules/tictactoe/types/tictactoe";
import type { GameMetricSnapshot } from "@/modules/tictactoe/types/gameMetrics";

export interface AutoplayOptions {
  algorithmX: TicTacToeAlgorithmId;
  algorithmO: TicTacToeAlgorithmId;
  games: number;
}

export interface AutoplayResult {
  games: GameState[];
  metrics: GameMetricSnapshot[];
}

/** Runs AI vs AI games for benchmarking. */
export function runAutoplay(_options: AutoplayOptions): AutoplayResult {
  throw new Error("Not implemented");
}
