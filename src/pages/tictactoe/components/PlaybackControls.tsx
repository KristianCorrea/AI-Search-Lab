import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

export interface PlaybackControlsProps {
  viewStep: number | null;
  moveCount: number;
  isAutoPlaying: boolean;
  onJumpToStart: () => void;
  onStepBack: () => void;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onJumpToEnd: () => void;
}

export function PlaybackControls({
  viewStep,
  moveCount,
  isAutoPlaying,
  onJumpToStart,
  onStepBack,
  onTogglePlay,
  onStepForward,
  onJumpToEnd,
}: PlaybackControlsProps) {
  return (
    <div className="space-y-2">
      {/* Playback controls */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          title="Jump to start"
          onClick={onJumpToStart}
          disabled={viewStep === 0}
          className="inline-flex items-center justify-center rounded-lg border border-neutral-200 p-1.5 hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-700"
        >
          <SkipBack className="size-4" />
        </button>
        <button
          type="button"
          title="Step back"
          onClick={onStepBack}
          disabled={(viewStep ?? 0) <= 0}
          className="rounded-lg border border-neutral-200 px-2.5 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-700"
        >
          ‹ Back
        </button>
        <button
          type="button"
          onClick={onTogglePlay}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700"
        >
          {isAutoPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
          {isAutoPlaying ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          title="Step forward"
          onClick={onStepForward}
          disabled={(viewStep ?? 0) >= moveCount}
          className="rounded-lg border border-neutral-200 px-2.5 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-700"
        >
          Fwd ›
        </button>
        <button
          type="button"
          title="Jump to end"
          onClick={onJumpToEnd}
          disabled={viewStep === moveCount}
          className="inline-flex items-center justify-center rounded-lg border border-neutral-200 p-1.5 hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-700"
        >
          <SkipForward className="size-4" />
        </button>
      </div>
      <p className="text-xs text-neutral-500">
        Move {viewStep ?? 0} of {moveCount}
      </p>
    </div>
  );
}
