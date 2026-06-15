"use client";

import { Play } from "lucide-react";
import { AlgorithmSelector } from "@/shared/components/AlgorithmSelector";
import { PUZZLE_ALGORITHMS, type PuzzleAlgorithmId } from "@/shared/constants/algorithms";

interface SolverControlsProps {
  algorithm: PuzzleAlgorithmId;
  onAlgorithmChange: (algorithm: PuzzleAlgorithmId) => void;
  onSolve: () => void;
  isSolving?: boolean;
}

export function SolverControls({
  algorithm,
  onAlgorithmChange,
  onSolve,
  isSolving,
}: SolverControlsProps) {
  return (
    <div className="space-y-4">
      <AlgorithmSelector
        options={PUZZLE_ALGORITHMS}
        value={algorithm}
        onChange={onAlgorithmChange}
        label="Search Algorithm"
      />
      <button
        type="button"
        onClick={onSolve}
        disabled={isSolving}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
      >
        <Play className="size-4" />
        {isSolving ? "Solving…" : "Solve Puzzle"}
      </button>
    </div>
  );
}
