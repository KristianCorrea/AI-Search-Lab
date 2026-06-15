"use client";

import { Bot } from "lucide-react";
import { AlgorithmSelector } from "@/shared/components/AlgorithmSelector";
import { TICTACTOE_ALGORITHMS, type TicTacToeAlgorithmId } from "@/shared/constants/algorithms";

interface AIControlsProps {
  algorithm: TicTacToeAlgorithmId;
  onAlgorithmChange: (algorithm: TicTacToeAlgorithmId) => void;
  onAiMove: () => void;
  isThinking?: boolean;
}

export function AIControls({
  algorithm,
  onAlgorithmChange,
  onAiMove,
  isThinking,
}: AIControlsProps) {
  return (
    <div className="space-y-4">
      <AlgorithmSelector
        options={TICTACTOE_ALGORITHMS}
        value={algorithm}
        onChange={onAlgorithmChange}
        label="AI Algorithm"
      />
      <button
        type="button"
        onClick={onAiMove}
        disabled={isThinking}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
      >
        <Bot className="size-4" />
        {isThinking ? "Thinking…" : "AI Move"}
      </button>
    </div>
  );
}
