import { Clock, GitBranch, Layers, Percent } from "lucide-react";
import { MetricCard } from "@/shared/MetricCard";
import { formatCount, formatMs } from "@/shared/metrics";
import type { TicTacToeAlgorithmId } from "@/shared/constants";
import type { MoveResult } from "@/modules/tictactoe/types";

export interface MetricsPanelProps {
  result: MoveResult | null;
  algorithm: TicTacToeAlgorithmId | "human" | null;
}

// ── MetricsPanel ──────────────────────────────────────────────────────────────
/**
 * MetricsPanel component
 * @description Displays the metrics for a move.
 * @param result - The result of the move.
 * @param algorithm - The algorithm used to make the move.
 * @returns The MetricsPanel component.
 */
export function MetricsPanel({ result, algorithm }: MetricsPanelProps) {
  if (!result || algorithm === "human" || algorithm === null) {
    const msg =
      algorithm === "human"
        ? "Human move — no AI search metrics."
        : "Select a move in the log to see metrics.";
    return <p className="text-sm text-neutral-500">{msg}</p>;
  }

  const showPruning = algorithm === "alpha-beta" && result.pruningRate !== undefined;

  return (
    <div className={`grid gap-3 ${showPruning ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
      <MetricCard label="Search Time" value={formatMs(result.elapsedMs ?? 0)} icon={Clock} />
      <MetricCard label="Nodes Visited" value={formatCount(result.nodesVisited)} icon={GitBranch} />
      <MetricCard label="Search Depth" value={formatCount(result.depth)} icon={Layers} />
      {showPruning && (
        <MetricCard
          label="Pruning Rate"
          value={`${((result.pruningRate ?? 0) * 100).toFixed(1)}%`}
          icon={Percent}
        />
      )}
    </div>
  );
}
