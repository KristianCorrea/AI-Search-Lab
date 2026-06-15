"use client";

import { Clock, GitBranch, Layers } from "lucide-react";
import { MetricCard } from "@/shared/components/MetricCard";
import { formatCount, formatMs } from "@/shared/utils/formatting";
import type { MoveResult } from "@/modules/tictactoe/types/move";

interface GameMetricsProps {
  result: MoveResult | null;
}

export function GameMetrics({ result }: GameMetricsProps) {
  if (!result) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Request an AI move to see search metrics.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <MetricCard
        label="Search Time"
        value={formatMs(0)}
        icon={Clock}
        description="Timing stub — wire up measure()"
      />
      <MetricCard
        label="Nodes Visited"
        value={formatCount(result.nodesVisited)}
        icon={GitBranch}
      />
      <MetricCard
        label="Depth"
        value={formatCount(result.depth)}
        icon={Layers}
      />
    </div>
  );
}
