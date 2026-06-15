"use client";

import { RotateCcw, Shuffle } from "lucide-react";

interface PuzzleControlsProps {
  onShuffle: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export function PuzzleControls({ onShuffle, onReset, disabled }: PuzzleControlsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onShuffle}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
      >
        <Shuffle className="size-4" />
        Shuffle
      </button>
      <button
        type="button"
        onClick={onReset}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
      >
        <RotateCcw className="size-4" />
        Reset
      </button>
    </div>
  );
}
