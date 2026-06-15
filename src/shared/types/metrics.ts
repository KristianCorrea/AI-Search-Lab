export interface TimingResult {
  elapsedMs: number;
  startedAt: number;
  endedAt: number;
}

export interface MetricSnapshot {
  algorithmId: string;
  nodesExpanded: number;
  pathLength: number;
  elapsedMs: number;
  memoryBytes?: number;
}
