"use client";

import { useCallback, useState } from "react";
import type { TicTacToeAlgorithmId } from "@/shared/constants/algorithms";
import type { GameState } from "@/modules/tictactoe/types/tictactoe";
import type { MoveResult } from "@/modules/tictactoe/types/move";
import { createInitialGameState } from "@/modules/tictactoe/utils/boardHelpers";

export interface UseTicTacToeReturn {
  game: GameState;
  algorithm: TicTacToeAlgorithmId;
  isThinking: boolean;
  lastMoveResult: MoveResult | null;
  setAlgorithm: (algorithm: TicTacToeAlgorithmId) => void;
  playMove: (index: number) => void;
  requestAiMove: () => void;
  reset: () => void;
}

export function useTicTacToe(): UseTicTacToeReturn {
  const [game, setGame] = useState<GameState>(createInitialGameState);
  const [algorithm, setAlgorithm] = useState<TicTacToeAlgorithmId>("minimax");
  const [isThinking, setIsThinking] = useState(false);
  const [lastMoveResult, setLastMoveResult] = useState<MoveResult | null>(null);

  const playMove = useCallback((_index: number) => {
    // TODO: wire up gameManager.makeMove
  }, []);

  const requestAiMove = useCallback(() => {
    setIsThinking(true);
    setLastMoveResult(null);
    // TODO: dispatch to selected AI algorithm
    setIsThinking(false);
  }, [algorithm, game]);

  const reset = useCallback(() => {
    setGame(createInitialGameState());
    setLastMoveResult(null);
    setIsThinking(false);
  }, []);

  return {
    game,
    algorithm,
    isThinking,
    lastMoveResult,
    setAlgorithm,
    playMove,
    requestAiMove,
    reset,
  };
}
