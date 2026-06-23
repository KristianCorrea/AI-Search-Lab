import { Clock, GitBranch, Layers, Percent, Target } from "lucide-react";
import { MetricCard } from "@/shared/MetricCard";
import { formatCount, formatMs } from "@/shared/metrics";
import { cellLabel } from "@/modules/tictactoe/session";
import type { MoveResult, Player, PositionAnalysis } from "@/modules/tictactoe/types";

function formatEvalScore(score: number): string {
  return score > 0 ? `+${score}` : `${score}`;
}

function AlgorithmColumn({
  label,
  result,
  showPruning,
}: {
  label: string;
  result: MoveResult;
  showPruning?: boolean;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="text-sm font-semibold">
        Suggests:{" "}
        <span className="font-mono text-violet-600 dark:text-violet-400">
          {cellLabel(result.move.index)}
        </span>
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <MetricCard
          label="Eval"
          value={formatEvalScore(result.score)}
          icon={Target}
        />
        <MetricCard label="Time" value={formatMs(result.elapsedMs ?? 0)} icon={Clock} />
        <MetricCard label="Nodes" value={formatCount(result.nodesVisited)} icon={GitBranch} />
        <MetricCard label="Depth" value={formatCount(result.depth)} icon={Layers} />
        {showPruning && (
          <MetricCard
            label="Pruning"
            value={`${((result.pruningRate ?? 0) * 100).toFixed(1)}%`}
            icon={Percent}
          />
        )}
      </div>
    </div>
  );
}

export interface AlgorithmAdvisoryPanelProps {
  analysis: PositionAnalysis | null;
  isAnalyzing: boolean;
  currentPlayer: Player | null;
}

export function AlgorithmAdvisoryPanel({
  analysis,
  isAnalyzing,
  currentPlayer,
}: AlgorithmAdvisoryPanelProps) {
  if (!currentPlayer) {
    return (
      <p className="text-sm text-neutral-500">Game over — no further analysis.</p>
    );
  }

  if (isAnalyzing || !analysis) {
    return (
      <p className="text-sm text-violet-600 dark:text-violet-400">
        Analyzing position for {currentPlayer}&apos;s turn…
      </p>
    );
  }

  const { minimax, alphaBeta, consensus } = analysis;
  const suggestedCell = cellLabel(minimax.move.index);

  const consensusMessage =
    consensus === "agree"
      ? `Both algorithms agree — optimal move is ${suggestedCell} (${formatEvalScore(minimax.score)})`
      : consensus === "same-score"
      ? `Both optimal — same score (${formatEvalScore(minimax.score)}), different cells (${cellLabel(minimax.move.index)} vs ${cellLabel(alphaBeta.move.index)})`
      : `Algorithms disagree — Minimax ${cellLabel(minimax.move.index)} (${formatEvalScore(minimax.score)}) vs Alpha-Beta ${cellLabel(alphaBeta.move.index)} (${formatEvalScore(alphaBeta.score)})`;

  const consensusClass =
    consensus === "disagree"
      ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
      : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300";

  return (
    <div className="space-y-3">
      <p className="text-xs text-neutral-500">
        Live advisory for {currentPlayer}&apos;s turn — compare search algorithms on this position.
      </p>
      <div className="grid gap-3 lg:grid-cols-2">
        <AlgorithmColumn label="Minimax" result={minimax} />
        <AlgorithmColumn label="Alpha-Beta" result={alphaBeta} showPruning />
      </div>
      <div className={`rounded-lg border px-3 py-2 text-sm font-medium ${consensusClass}`}>
        {consensus === "agree" ? "✓ " : consensus === "disagree" ? "⚠ " : "≈ "}
        {consensusMessage}
      </div>
    </div>
  );
}
