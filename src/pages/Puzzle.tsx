import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Clock, GitBranch, ImagePlus, Play, RotateCcw, Route, Shuffle } from "lucide-react";
import { Layout } from "@/shared/Layout";
import { MetricCard } from "@/shared/MetricCard";
import { formatCount, formatMs } from "@/shared/metrics";
import { PUZZLE_ALGORITHMS, type PuzzleAlgorithmId } from "@/shared/constants";
import { createSolvedState, getNeighbors, shufflePuzzle } from "@/modules/puzzle/board";
import { PUZZLE_SOLVERS } from "@/modules/puzzle/solvers";
import type { PuzzleState, SolverResult } from "@/modules/puzzle/types";

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
            <div key={index} className="aspect-square rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          );
        }
        const imageUrl = tileImages[value];
        return (
          <motion.button
            key={index}
            type="button"
            layout
            disabled={disabled}
            onClick={() => onTileClick?.(index)}
            className="aspect-square overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 text-lg font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
  const [tileImages] = useState<Record<number, string>>({});

  const shuffle = useCallback(() => {
    setLastResult(null);
    setState(shufflePuzzle(createSolvedState(3), 50));
  }, []);

  const solve = useCallback(() => {
    setIsSolving(true);
    setLastResult(null);
    try {
      const result = PUZZLE_SOLVERS[algorithm](state);
      setLastResult(result);
    } catch {
      // solver not implemented yet
    } finally {
      setIsSolving(false);
    }
  }, [algorithm, state]);

  const reset = useCallback(() => {
    setState(createSolvedState(3));
    setLastResult(null);
    setIsSolving(false);
  }, []);

  const handleImageDrop = useCallback((_files: File[]) => {
    // TODO: wire up sliceImage from image.ts
  }, []);

  const playTile = useCallback(
    (index: number) => {
      if (isSolving) return;

      const neighbor = getNeighbors(state).find(({ move }) => move.fromIndex === index);
      if (!neighbor) return;

      setLastResult(null);
      setState(neighbor.state);
    },
    [state, isSolving],
  );

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
              disabled={isSolving}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={shuffle}
                disabled={isSolving}
                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
              >
                <Shuffle className="size-4" />
                Shuffle
              </button>
              <button
                type="button"
                onClick={reset}
                disabled={isSolving}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                <RotateCcw className="size-4" />
                Reset
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <ImageUploader onDrop={handleImageDrop} disabled={isSolving} />

            <div className="space-y-2">
              <label className="text-sm font-medium">Search Algorithm</label>
              <div className="grid gap-2 sm:grid-cols-3">
                {PUZZLE_ALGORITHMS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setAlgorithm(option.id)}
                    className={`rounded-xl border p-3 text-left transition-colors ${
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
              disabled={isSolving}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Play className="size-4" />
              {isSolving ? "Solving…" : "Solve Puzzle"}
            </button>

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
