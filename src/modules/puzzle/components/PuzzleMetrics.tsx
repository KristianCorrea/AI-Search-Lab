"use client";

import { Clock, GitBranch, Route } from "lucide-react";
import { MetricCard } from "@/shared/components/MetricCard";
import { formatCount, formatMs } from "@/shared/utils/formatting";
import type { SolverResult } from "@/modules/puzzle/types/solver";

interface PuzzleMetricsProps {
  result: SolverResult | null;
}

export function PuzzleMetrics({ result }: PuzzleMetricsProps) {
  if (!result) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Run a solver to see performance metrics.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <MetricCard
        label="Time"
        value={formatMs(result.elapsedMs)}
        icon={Clock}
      />
      <MetricCard
        label="Nodes Expanded"
        value={formatCount(result.nodesExpanded)}
        icon={GitBranch}
      />
      <MetricCard
        label="Solution Length"
        value={formatCount(result.moves.length)}
        icon={Route}
      />
    </div>
  );
}
