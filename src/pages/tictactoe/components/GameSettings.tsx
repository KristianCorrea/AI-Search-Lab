import { Play } from "lucide-react";
import type { TicTacToeAlgorithmId } from "@/shared/constants";
import type { Player } from "@/modules/tictactoe/types";
import { AlgoPicker } from "@/pages/tictactoe/components/AlgoPicker";
import { PlaybackControls } from "@/pages/tictactoe/components/PlaybackControls";

export interface HumanVsAiSettingsProps {
  humanPlayer: Player;
  aiAlgorithm: TicTacToeAlgorithmId;
  isAiThinking: boolean;
  onHumanPlayerChange: (player: Player) => void;
  onAiAlgorithmChange: (algorithm: TicTacToeAlgorithmId) => void;
}



export function HumanVsAiSettings({
  humanPlayer,
  aiAlgorithm,
  isAiThinking,
  onHumanPlayerChange,
  onAiAlgorithmChange,
}: HumanVsAiSettingsProps) {
  return (
    <>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Play as</p>
        <div className="flex gap-2">
          {(["X", "O"] as Player[]).map((p) => (
            <button
              key={p}
              type="button"
              disabled={isAiThinking}
              onClick={() => onHumanPlayerChange(p)}
              className={[
                "flex-1 cursor-pointer rounded-xl border py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                humanPlayer === p
                  ? p === "X"
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-300"
                    : "border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-400 dark:bg-violet-950/40 dark:text-violet-300"
                  : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900",
              ].join(" ")}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <AlgoPicker
        label="AI Algorithm"
        value={aiAlgorithm}
        onChange={onAiAlgorithmChange}
        disabled={isAiThinking}
      />
    </>
  );
}

export function HumanVsHumanSettings() {
  return (
    <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
      <h2 className="text-sm font-semibold">Human vs Human</h2>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Two players take turns on this device. The lab runs Minimax and Alpha-Beta on each
        position and suggests the optimal move — both algorithms should agree on optimal play.
      </p>
    </div>
  );
}

export interface AiVsAiSettingsProps {
  algorithmX: TicTacToeAlgorithmId;
  algorithmO: TicTacToeAlgorithmId;
  aiAiStarted: boolean;
  viewStep: number | null;
  moveCount: number;
  isAutoPlaying: boolean;
  onAlgorithmXChange: (algorithm: TicTacToeAlgorithmId) => void;
  onAlgorithmOChange: (algorithm: TicTacToeAlgorithmId) => void;
  onStartGame: () => void;
  onJumpToStart: () => void;
  onStepBack: () => void;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onJumpToEnd: () => void;
}

export function AiVsAiSettings({
  algorithmX,
  algorithmO,
  aiAiStarted,
  viewStep,
  moveCount,
  isAutoPlaying,
  onAlgorithmXChange,
  onAlgorithmOChange,
  onStartGame,
  onJumpToStart,
  onStepBack,
  onTogglePlay,
  onStepForward,
  onJumpToEnd,
}: AiVsAiSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <AlgoPicker
          label="X Algorithm"
          value={algorithmX}
          onChange={onAlgorithmXChange}
          disabled={aiAiStarted}
        />
        <AlgoPicker
          label="O Algorithm"
          value={algorithmO}
          onChange={onAlgorithmOChange}
          disabled={aiAiStarted}
        />
      </div>

      {!aiAiStarted ? (
        <button
          type="button"
          onClick={onStartGame}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          <Play className="size-4" />
          Start Game
        </button>
      ) : (
        <PlaybackControls
          viewStep={viewStep}
          moveCount={moveCount}
          isAutoPlaying={isAutoPlaying}
          onJumpToStart={onJumpToStart}
          onStepBack={onStepBack}
          onTogglePlay={onTogglePlay}
          onStepForward={onStepForward}
          onJumpToEnd={onJumpToEnd}
        />
      )}
    </div>
  );
}
