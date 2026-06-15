"use client";

import { motion } from "framer-motion";
import type { CellValue } from "@/modules/tictactoe/types/tictactoe";

interface CellProps {
  value: CellValue;
  index: number;
  isWinning?: boolean;
  disabled?: boolean;
  onClick: (index: number) => void;
}

export function Cell({ value, index, isWinning, disabled, onClick }: CellProps) {
  return (
    <motion.button
      type="button"
      layout
      disabled={disabled || value !== null}
      onClick={() => onClick(index)}
      className={`flex aspect-square items-center justify-center rounded-xl border text-3xl font-bold transition-colors ${
        isWinning
          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          : "border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
      } disabled:cursor-default`}
      whileTap={{ scale: value ? 1 : 0.95 }}
    >
      {value}
    </motion.button>
  );
}
