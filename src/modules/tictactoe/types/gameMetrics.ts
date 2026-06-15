import type { MetricSnapshot } from "@/shared/types/metrics";
import type { TicTacToeAlgorithmId } from "@/shared/constants/algorithms";

export interface GameMetricSnapshot extends MetricSnapshot {
  algorithmId: TicTacToeAlgorithmId;
  nodesVisited: number;
  depth: number;
}

export interface GameBenchmarkResult {
  algorithmId: TicTacToeAlgorithmId;
  runs: GameMetricSnapshot[];
  winRate: number;
  average: {
    elapsedMs: number;
    nodesVisited: number;
    depth: number;
  };
}
