import { formatCount } from "@/shared/metrics";
import { cellLabel } from "@/modules/tictactoe/session";
import type { MoveRecord } from "@/modules/tictactoe/types";

export interface MoveLogPanelProps {
  history: MoveRecord[];
  viewStep: number | null;
  isLive: boolean;
  onStepSelect: (step: number) => void;
}

// ── MoveLogPanel ──────────────────────────────────────────────────────────────
/**
 * MoveLogPanel component
 * @description Displays the move log and allows the user to click on a move to view it.
 * @param history - The history of moves.
 * @param viewStep - The step to view.
 * @param isLive - Whether the game is live.
 * @param onStepSelect - The function to call when a step is selected.
 * @returns The MoveLogPanel component.
 */
export function MoveLogPanel({ history, viewStep, isLive, onStepSelect }: MoveLogPanelProps) {
  if (history.length === 0) {
    return <p className="text-xs italic text-neutral-400">No moves yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      <div className="max-h-52 overflow-y-auto">
        {history.map((rec, i) => {
          const step = i + 1;
          const isSelected = !isLive && viewStep === step;
          const isLatestLive = isLive && i === history.length - 1;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onStepSelect(step)}
              title={`Jump to move ${step}`}
              className={[
                "flex w-full cursor-pointer items-center gap-2 border-l-2 px-3 py-1.5 text-xs transition-colors",
                isSelected
                  ? "border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-950/40"
                  : isLatestLive
                  ? "border-neutral-300 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800/40"
                  : "border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/30",
              ].join(" ")}
            >
              {/* Move # */}
              <span className="w-5 shrink-0 text-center font-mono text-neutral-400">
                {rec.moveNumber}
              </span>

              {/* Player symbol colored by player */}
              <span
                className={[
                  "w-5 shrink-0 text-center font-bold",
                  rec.player === "X"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-violet-600 dark:text-violet-400",
                ].join(" ")}
              >
                {rec.player}
              </span>

              {/* Cell position */}
              <span className="font-mono text-neutral-500">{cellLabel(rec.cellIndex)}</span>

              {/* Algorithm badge */}
              <span className="shrink-0 text-neutral-400">
                {rec.algorithm === "human" ? "Human" : rec.algorithm === "minimax" ? "MM" : "AB"}
              </span>

              {/* Node count — right-aligned */}
              {rec.moveResult && (
                <span className="ml-auto shrink-0 text-neutral-400">
                  {formatCount(rec.moveResult.nodesVisited)} nodes
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
