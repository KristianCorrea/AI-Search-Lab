import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import {
  Clock,
  GitBranch,
  ImagePlus,
  Pause,
  Play,
  RotateCcw,
  Route,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Layout } from "@/shared/Layout";
import { MetricCard } from "@/shared/MetricCard";
import { formatCount, formatMs } from "@/shared/metrics";
import { PUZZLE_ALGORITHMS, type PuzzleAlgorithmId } from "@/shared/constants";
import { sliceImage } from "@/modules/puzzle/image";
import { applyMove, createSolvedState, getNeighbors, shufflePuzzle } from "@/modules/puzzle/board";
import { PUZZLE_SOLVERS } from "@/modules/puzzle/solvers";
import type { PuzzleMove, PuzzleState, SolverResult } from "@/modules/puzzle/types";

const REPLAY_DELAY_MS = 350;

const layoutTransition = { type: "spring" as const, stiffness: 500, damping: 35 };

function applyMovesFrom(start: PuzzleState, moves: PuzzleMove[], count: number): PuzzleState {
  let current = start;
  for (let i = 0; i < count; i++) {
    current = applyMove(current, moves[i]!);
  }
  return current;
}

function PuzzleBoard({
  state,
  tileImages = {},
  onTileClick,
  disabled,
}: {
  state: PuzzleState;
  tileImages?: Record<number, string>;
  onTileClick?: (index: number) => void;
  disabled?: boolean;
}) {
  const movableIndices = new Set(
    disabled ? [] : getNeighbors(state).map(({ move }) => move.fromIndex),
  );

  return (
    <div
      className="grid gap-2 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      style={{
        gridTemplateColumns: `repeat(${state.size}, minmax(0, 1fr))`,
        width: `${state.size * 80 + (state.size - 1) * 8 + 32}px`,
      }}
    >
      {state.tiles.map((value, index) => {
        if (value === 0) {
          return (
            <motion.div
              key="blank"
              layout
              transition={layoutTransition}
              className="aspect-square rounded-lg bg-neutral-100 dark:bg-neutral-800"
            />
          );
        }
        const imageUrl = tileImages[value];
        const isMovable = movableIndices.has(index);
        return (
          <motion.button
            key={value}
            type="button"
            layout
            transition={layoutTransition}
            disabled={disabled || !isMovable}
            onClick={() => onTileClick?.(index)}
            title={isMovable && !disabled ? "Slide this tile into the empty space" : undefined}
            className={[
              "aspect-square overflow-hidden rounded-lg border text-lg font-semibold shadow-sm transition-colors",
              disabled
                ? "cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-50 dark:border-neutral-700 dark:bg-neutral-900"
                : isMovable
                ? "cursor-pointer border-violet-300 bg-neutral-50 ring-2 ring-violet-400/60 ring-offset-1 hover:border-violet-400 hover:shadow-md dark:border-violet-600 dark:bg-neutral-900 dark:ring-violet-500/50"
                : "cursor-default border-neutral-200 bg-neutral-50 opacity-75 dark:border-neutral-700 dark:bg-neutral-900",
            ].join(" ")}
            whileHover={disabled || !isMovable ? undefined : { scale: 1.02 }}
            whileTap={disabled || !isMovable ? undefined : { scale: 0.98 }}
          >
            {imageUrl ? (
              <img src={imageUrl} alt={`Tile ${value}`} className="size-full object-cover" />
            ) : (
              <span className="flex size-full items-center justify-center">{value}</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function ImageUploader({
  onDrop,
  disabled,
}: {
  onDrop: (files: File[]) => void;
  disabled?: boolean;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
        isDragActive
          ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
          : "border-neutral-300 hover:border-violet-400 dark:border-neutral-700"
      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      <input {...getInputProps()} />
      <ImagePlus className="mx-auto size-8 text-neutral-400" />
      <p className="mt-2 text-sm font-medium">
        {isDragActive ? "Drop image here" : "Drag & drop a puzzle image"}
      </p>
      <p className="mt-1 text-xs text-neutral-500">PNG, JPG, or WebP</p>
    </div>
  );
}

export default function Puzzle() {
  const [state, setState] = useState<PuzzleState>(() => createSolvedState(3));
  const [algorithm, setAlgorithm] = useState<PuzzleAlgorithmId>("bfs");
  const [isSolving, setIsSolving] = useState(false);
  const [lastResult, setLastResult] = useState<SolverResult | null>(null);
  const [tileImages, setTileImages] = useState<Record<number, string>>({});
  const [imageError, setImageError] = useState<string | null>(null);

  const [replayMoves, setReplayMoves] = useState<PuzzleMove[] | null>(null);
  const [replayStartState, setReplayStartState] = useState<PuzzleState | null>(null);
  const [replayStep, setReplayStep] = useState(0);
  const [isReplayPlaying, setIsReplayPlaying] = useState(false);

  const clearReplay = useCallback(() => {
    setReplayMoves(null);
    setReplayStartState(null);
    setReplayStep(0);
    setIsReplayPlaying(false);
  }, []);

  const replayInProgress = replayMoves !== null && replayStep < replayMoves.length;
  const controlsLocked = isSolving || isReplayPlaying;
  const manualPlayEnabled = !isSolving && !replayInProgress && !isReplayPlaying;

  useEffect(() => {
    if (!isReplayPlaying || !replayMoves || !replayStartState || replayStep >= replayMoves.length) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setReplayStep((step) => step + 1);
      setState(applyMovesFrom(replayStartState, replayMoves, replayStep + 1));
    }, REPLAY_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [isReplayPlaying, replayMoves, replayStartState, replayStep]);

  useEffect(() => {
    if (replayMoves && replayStep >= replayMoves.length) {
      setIsReplayPlaying(false);
    }
  }, [replayMoves, replayStep]);

  const shuffle = useCallback(() => {
    clearReplay();
    setLastResult(null);
    setState(shufflePuzzle(createSolvedState(3), 50));
  }, [clearReplay]);

  const solve = useCallback(() => {
    clearReplay();
    setIsSolving(true);
    setLastResult(null);

    const startState = state;

    try {
      const result = PUZZLE_SOLVERS[algorithm](startState);
      setLastResult(result);

      if (result.solved && result.moves.length > 0) {
        setReplayMoves(result.moves);
        setReplayStartState(startState);
        setReplayStep(0);
        setState(startState);
        setIsReplayPlaying(true);
      }
    } catch {
      // solver not implemented yet
    } finally {
      setIsSolving(false);
    }
  }, [algorithm, state, clearReplay]);

  const reset = useCallback(() => {
    clearReplay();
    setState(createSolvedState(3));
    setLastResult(null);
    setIsSolving(false);
    setTileImages({});
    setImageError(null);
  }, [clearReplay]);

  const handleImageDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;

      setImageError(null);
      clearReplay();

      try {
        const result = await sliceImage(file, state.size);
        const map: Record<number, string> = {};

        for (const tile of result.tiles) {
          const tileValue = tile.index + 1;
          if (tileValue < state.size * state.size) {
            map[tileValue] = tile.dataUrl;
          }
        }

        setTileImages(map);
        setLastResult(null);
      } catch {
        setImageError("Could not load or slice that image. Try another PNG or JPG.");
      }
    },
    [state.size, clearReplay],
  );

  const playTile = useCallback(
    (index: number) => {
      if (isSolving || replayInProgress || isReplayPlaying) return;

      const neighbor = getNeighbors(state).find(({ move }) => move.fromIndex === index);
      if (!neighbor) return;

      clearReplay();
      setLastResult(null);
      setState(neighbor.state);
    },
    [state, isSolving, replayInProgress, isReplayPlaying, clearReplay],
  );

  const playReplay = useCallback(() => {
    if (!replayMoves || !replayStartState) return;

    if (replayStep >= replayMoves.length) {
      setReplayStep(0);
      setState(replayStartState);
    }

    setIsReplayPlaying(true);
  }, [replayMoves, replayStartState, replayStep]);

  const pauseReplay = useCallback(() => {
    setIsReplayPlaying(false);
  }, []);

  const stepReplayForward = useCallback(() => {
    if (!replayMoves || !replayStartState || replayStep >= replayMoves.length) return;

    setIsReplayPlaying(false);
    const nextStep = replayStep + 1;
    setReplayStep(nextStep);
    setState(applyMovesFrom(replayStartState, replayMoves, nextStep));
  }, [replayMoves, replayStartState, replayStep]);

  const stepReplayBack = useCallback(() => {
    if (!replayMoves || !replayStartState || replayStep <= 0) return;

    setIsReplayPlaying(false);
    const nextStep = replayStep - 1;
    setReplayStep(nextStep);
    setState(applyMovesFrom(replayStartState, replayMoves, nextStep));
  }, [replayMoves, replayStartState, replayStep]);

  return (
    <Layout>
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Sliding Puzzle</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Compare uninformed and informed search algorithms on an N-puzzle.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <PuzzleBoard
              state={state}
              tileImages={tileImages}
              onTileClick={playTile}
              disabled={!manualPlayEnabled}
            />
            {manualPlayEnabled ? (
              <p className="text-xs text-neutral-500">
                Click a highlighted tile next to the empty space to slide it.
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={shuffle}
                disabled={controlsLocked}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Shuffle className="size-4" />
                Shuffle
              </button>
              <button
                type="button"
                onClick={reset}
                disabled={controlsLocked}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                <RotateCcw className="size-4" />
                Reset
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <ImageUploader onDrop={handleImageDrop} disabled={controlsLocked} />
            {imageError ? (
              <p className="text-sm text-red-600 dark:text-red-400">{imageError}</p>
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-medium">Search Algorithm</label>
              <div className="grid gap-2 sm:grid-cols-3">
                {PUZZLE_ALGORITHMS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setAlgorithm(option.id)}
                    disabled={controlsLocked}
                    className={`cursor-pointer rounded-xl border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      algorithm === option.id
                        ? "border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-950/50"
                        : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900"
                    }`}
                  >
                    <p className="text-sm font-semibold">{option.label}</p>
                    <p className="mt-1 text-xs text-neutral-500">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={solve}
              disabled={controlsLocked}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play className="size-4" />
              {isSolving ? "Solving…" : "Solve Puzzle"}
            </button>

            {replayMoves && replayMoves.length > 0 ? (
              <div className="space-y-2 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Solution replay</h2>
                  <span className="text-xs text-neutral-500">
                    Move {Math.min(replayStep, replayMoves.length)} / {replayMoves.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={playReplay}
                    disabled={isReplayPlaying}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  >
                    <Play className="size-4" />
                    Play
                  </button>
                  <button
                    type="button"
                    onClick={pauseReplay}
                    disabled={!isReplayPlaying}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  >
                    <Pause className="size-4" />
                    Pause
                  </button>
                  <button
                    type="button"
                    onClick={stepReplayBack}
                    disabled={isReplayPlaying || replayStep <= 0}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  >
                    <SkipBack className="size-4" />
                    Step back
                  </button>
                  <button
                    type="button"
                    onClick={stepReplayForward}
                    disabled={isReplayPlaying || replayStep >= replayMoves.length}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  >
                    <SkipForward className="size-4" />
                    Step forward
                  </button>
                </div>
              </div>
            ) : null}

            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Metrics</h2>
              {lastResult ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  <MetricCard label="Time" value={formatMs(lastResult.elapsedMs)} icon={Clock} />
                  <MetricCard label="Nodes Expanded" value={formatCount(lastResult.nodesExpanded)} icon={GitBranch} />
                  <MetricCard label="Solution Length" value={formatCount(lastResult.moves.length)} icon={Route} />
                </div>
              ) : (
                <p className="text-sm text-neutral-500">Run a solver to see performance metrics.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
