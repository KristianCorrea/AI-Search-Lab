import type { TicTacToeAlgorithmId } from "@/shared/constants";
import { GameManager } from "@/modules/tictactoe/game";
import { buildMoveRecord, runAiSearch } from "@/modules/tictactoe/session";
import type { GameState, MoveRecord } from "@/modules/tictactoe/types";

export interface AutoplayOptions {
  algorithmX: TicTacToeAlgorithmId;
  algorithmO: TicTacToeAlgorithmId;
  games: number;
}

export interface AutoplayResult {
  games: GameState[];
  metrics: {
    algorithmId: TicTacToeAlgorithmId;
    nodesVisited: number;
    elapsedMs: number;
  }[];
}

/**
 * Synchronously plays out a full AI vs AI game and returns the move history.
 * Called once on "Start Game"; at most 9 moves so it runs in milliseconds.
 * @param algX - The algorithm for player X.
 * @param algO - The algorithm for player O.
 * @returns The move history. An array of MoveRecord objects.
 */
export function computeAiVsAiGame(
  algX: TicTacToeAlgorithmId,
  algO: TicTacToeAlgorithmId,
): MoveRecord[] {
  const gm = new GameManager();
  const history: MoveRecord[] = [];

  while (gm.getState().status === "playing") {
    const { board, currentPlayer } = gm.getState();
    const algorithm = currentPlayer === "X" ? algX : algO;
    const result = runAiSearch(board, currentPlayer, algorithm);
    const newState = gm.makeMove(result.move);

    history.push(
      buildMoveRecord(
        history.length + 1,
        result.move.player,
        result.move.index,
        algorithm,
        newState.board,
        result,
        newState.status,
        newState.winner,
      ),
    );
  }

  return history;
}

export function runAutoplay(options: AutoplayOptions): AutoplayResult {
  const games: GameState[] = [];
  const metricsByAlgo = new Map<TicTacToeAlgorithmId, { nodesVisited: number; elapsedMs: number }>();

  for (let i = 0; i < options.games; i++) {
    const history = computeAiVsAiGame(options.algorithmX, options.algorithmO);
    const last = history[history.length - 1];
    if (last) {
      games.push({
        board: last.boardAfter,
        currentPlayer: last.player,
        status: last.gameStatus,
        winner: last.winner,
      });
    }

    for (const record of history) {
      if (!record.moveResult || record.algorithm === "human") continue;
      const existing = metricsByAlgo.get(record.algorithm) ?? { nodesVisited: 0, elapsedMs: 0 };
      metricsByAlgo.set(record.algorithm, {
        nodesVisited: existing.nodesVisited + record.moveResult.nodesVisited,
        elapsedMs: existing.elapsedMs + (record.moveResult.elapsedMs ?? 0),
      });
    }
  }

  return {
    games,
    metrics: [...metricsByAlgo.entries()].map(([algorithmId, totals]) => ({
      algorithmId,
      ...totals,
    })),
  };
}
