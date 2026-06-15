"use client";

import { useCallback, useState } from "react";
import type { PuzzleAlgorithmId } from "@/shared/constants/algorithms";
import type { PuzzleState } from "@/modules/puzzle/types/puzzle";
import type { SolverResult } from "@/modules/puzzle/types/solver";
import { createSolvedState } from "@/modules/puzzle/utils/boardHelpers";

export interface UsePuzzleReturn {
  state: PuzzleState;
  algorithm: PuzzleAlgorithmId;
  isSolving: boolean;
  lastResult: SolverResult | null;
  tileImages: Record<number, string>;
  setAlgorithm: (algorithm: PuzzleAlgorithmId) => void;
  shuffle: () => void;
  solve: () => void;
  reset: () => void;
  handleImageDrop: (files: File[]) => void;
}

export function usePuzzle(size = 3): UsePuzzleReturn {
  const [state, setState] = useState<PuzzleState>(() => createSolvedState(size));
  const [algorithm, setAlgorithm] = useState<PuzzleAlgorithmId>("bfs");
  const [isSolving, setIsSolving] = useState(false);
  const [lastResult, setLastResult] = useState<SolverResult | null>(null);
  const [tileImages, setTileImages] = useState<Record<number, string>>({});

  const shuffle = useCallback(() => {
    setLastResult(null);
    // TODO: wire up puzzleGenerator.shufflePuzzle
  }, []);

  const solve = useCallback(() => {
    setIsSolving(true);
    setLastResult(null);
    // TODO: dispatch to selected solver
    setIsSolving(false);
  }, [algorithm, state]);

  const reset = useCallback(() => {
    setState(createSolvedState(size));
    setLastResult(null);
    setIsSolving(false);
  }, [size]);

  const handleImageDrop = useCallback((_files: File[]) => {
    // TODO: wire up imageSlicer.sliceImage
  }, []);

  return {
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
  };
}
