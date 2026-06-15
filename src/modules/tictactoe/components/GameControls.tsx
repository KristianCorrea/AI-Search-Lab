"use client";

import { RotateCcw } from "lucide-react";

interface GameControlsProps {
  onReset: () => void;
  statusLabel: string;
  disabled?: boolean;
}

export function GameControls({ onReset, statusLabel, disabled }: GameControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
        {statusLabel}
      </p>
      <button
        type="button"
        onClick={onReset}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
      >
        <RotateCcw className="size-4" />
        New Game
      </button>
    </div>
  );
}
