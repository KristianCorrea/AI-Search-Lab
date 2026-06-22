import { motion } from "framer-motion";
import type { Board, CellValue } from "@/modules/tictactoe/types";

export interface BoardGridProps {
  board: Board;
  winningLine?: number[] | null;
  lastMoveCellIndex?: number | null;
  disabled?: boolean;
  onCellClick?: (index: number) => void;
}

// ── BoardGrid ─────────────────────────────────────────────────────────────────
/**
 * BoardGrid component
 * @description Displays the game board and allows the user to click on a cell to make a move.
 * @param board - The board to display.
 * @param winningLine - The winning line to display.
 * @param lastMoveCellIndex - The last move cell index to display.
 * @param disabled - Whether the board is disabled.
 * @param onCellClick - The function to call when a cell is clicked.
 * @returns The BoardGrid component.
 */
export function BoardGrid({
  board,
  winningLine,
  lastMoveCellIndex,
  disabled,
  onCellClick,
}: BoardGridProps) {
  const winSet = new Set(winningLine ?? []);

  return (
    <div className="grid w-80 max-w-full grid-cols-3 gap-2">
      {board.map((value, i) => {
        const isWin = winSet.has(i);
        const isLast = !isWin && i === lastMoveCellIndex;

        return (
          <motion.button
            key={i}
            type="button"
            layout
            disabled={disabled || value !== null}
            onClick={() => onCellClick?.(i)}
            className={[
              "flex aspect-square cursor-pointer items-center justify-center rounded-xl border text-3xl font-bold transition-colors disabled:cursor-not-allowed",
              isWin
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                : isLast
                ? "border-violet-300 bg-violet-50/60 dark:border-violet-700 dark:bg-violet-950/30"
                : "border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800",
            ].join(" ")}
            whileTap={{ scale: value ? 1 : 0.95 }}
          >
            <span
              className={
                isWin
                  ? "text-emerald-700 dark:text-emerald-300"
                  : value === "X"
                  ? "text-blue-600 dark:text-blue-400"
                  : value === "O"
                  ? "text-violet-600 dark:text-violet-400"
                  : ""
              }
            >
              {value as CellValue}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
