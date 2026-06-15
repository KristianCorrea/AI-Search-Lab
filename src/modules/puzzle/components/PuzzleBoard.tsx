"use client";

import { PuzzleTile } from "@/modules/puzzle/components/PuzzleTile";
import type { PuzzleState } from "@/modules/puzzle/types/puzzle";

interface PuzzleBoardProps {
  state: PuzzleState;
  tileImages?: Record<number, string>;
  onTileClick?: (index: number) => void;
}

export function PuzzleBoard({ state, tileImages = {}, onTileClick }: PuzzleBoardProps) {
  return (
    <div
      className="grid gap-2 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      style={{
        gridTemplateColumns: `repeat(${state.size}, minmax(0, 1fr))`,
        width: `${state.size * 80 + (state.size - 1) * 8 + 32}px`,
      }}
    >
      {state.tiles.map((value, index) => (
        <PuzzleTile
          key={index}
          value={value}
          isBlank={value === 0}
          imageUrl={tileImages[value]}
          onClick={() => onTileClick?.(index)}
        />
      ))}
    </div>
  );
}
