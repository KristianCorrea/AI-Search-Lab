import type { MetricSnapshot } from "@/shared/types/metrics";

/** Aggregates multiple metric snapshots into summary statistics. */
export function aggregateMetrics(snapshots: MetricSnapshot[]) {
  if (snapshots.length === 0) {
    return {
      count: 0,
      avgElapsedMs: 0,
      avgNodesExpanded: 0,
      avgPathLength: 0,
    };
  }

  const count = snapshots.length;
  const totals = snapshots.reduce(
    (acc, snapshot) => ({
      elapsedMs: acc.elapsedMs + snapshot.elapsedMs,
      nodesExpanded: acc.nodesExpanded + snapshot.nodesExpanded,
      pathLength: acc.pathLength + snapshot.pathLength,
    }),
    { elapsedMs: 0, nodesExpanded: 0, pathLength: 0 },
  );

  return {
    count,
    avgElapsedMs: totals.elapsedMs / count,
    avgNodesExpanded: totals.nodesExpanded / count,
    avgPathLength: totals.pathLength / count,
  };
}
