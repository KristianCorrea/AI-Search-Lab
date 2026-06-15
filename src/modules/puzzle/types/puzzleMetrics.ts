import type { MetricSnapshot } from "@/shared/types/metrics";
import type { PuzzleAlgorithmId } from "@/shared/constants/algorithms";

export interface PuzzleMetricSnapshot extends MetricSnapshot {
  algorithmId: PuzzleAlgorithmId;
  maxFrontierSize: number;
  solved: boolean;
}

export interface PuzzleBenchmarkResult {
  algorithmId: PuzzleAlgorithmId;
  runs: PuzzleMetricSnapshot[];
  average: {
    elapsedMs: number;
    nodesExpanded: number;
    pathLength: number;
    maxFrontierSize: number;
  };
}
