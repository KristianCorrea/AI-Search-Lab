"use client";

import { Layout } from "@/shared/components/Layout";
import { ImageUploader } from "@/modules/puzzle/components/ImageUploader";
import { PuzzleBoard } from "@/modules/puzzle/components/PuzzleBoard";
import { PuzzleControls } from "@/modules/puzzle/components/PuzzleControls";
import { PuzzleMetrics } from "@/modules/puzzle/components/PuzzleMetrics";
import { SolverControls } from "@/modules/puzzle/components/SolverControls";
import { usePuzzle } from "@/modules/puzzle/hooks/usePuzzle";

export default function PuzzlePage() {
  const {
    state,
    algorithm,
    isSolving,
    lastResult,
    tileImages,
    setAlgorithm,
    shuffle,
    solve,
    reset,
    handleImageDrop,
  } = usePuzzle(3);

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
            <PuzzleBoard state={state} tileImages={tileImages} />
            <PuzzleControls
              onShuffle={shuffle}
              onReset={reset}
              disabled={isSolving}
            />
          </div>

          <div className="space-y-6">
            <ImageUploader onDrop={handleImageDrop} disabled={isSolving} />
            <SolverControls
              algorithm={algorithm}
              onAlgorithmChange={setAlgorithm}
              onSolve={solve}
              isSolving={isSolving}
            />
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Metrics
              </h2>
              <PuzzleMetrics result={lastResult} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
