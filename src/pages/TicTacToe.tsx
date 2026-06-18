import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Clock, GitBranch, Layers, RotateCcw } from "lucide-react";
import { Layout } from "@/shared/Layout";
import { MetricCard } from "@/shared/MetricCard";
import { formatCount, formatMs } from "@/shared/metrics";
import { TICTACTOE_ALGORITHMS, type TicTacToeAlgorithmId } from "@/shared/constants";
import { createInitialGameState } from "@/modules/tictactoe/game";
import type { Board, CellValue, GameState, MoveResult } from "@/modules/tictactoe/types";

function Board({
  board,
  winningLine,
  disabled,
  onCellClick,
}: {
  board: Board;
  winningLine?: number[] | null;
  disabled?: boolean;
  onCellClick: (index: number) => void;
}) {
  const winningSet = new Set(winningLine ?? []);

  return (
    <div className="grid w-full max-w-xs grid-cols-3 gap-2">
      {board.map((value, index) => (
        <motion.button
          key={index}
          type="button"
          layout
          disabled={disabled || value !== null}
          onClick={() => onCellClick(index)}
          className={`flex aspect-square items-center justify-center rounded-xl border text-3xl font-bold transition-colors ${
            winningSet.has(index)
              ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          } disabled:cursor-default`}
          whileTap={{ scale: value ? 1 : 0.95 }}
        >
          {value as CellValue}
        </motion.button>
      ))}
    </div>
  );
}

export default function TicTacToe() {
  const [game, setGame] = useState<GameState>(createInitialGameState);
  const [algorithm, setAlgorithm] = useState<TicTacToeAlgorithmId>("minimax");
  const [isThinking, setIsThinking] = useState(false);
  const [lastMoveResult, setLastMoveResult] = useState<MoveResult | null>(null);

  const playMove = useCallback((_index: number) => {
    // TODO: wire up GameManager.makeMove
  }, []);

  const requestAiMove = useCallback(() => {
    setIsThinking(true);
    setLastMoveResult(null);
    // TODO: dispatch to minimax or alpha-beta
    setIsThinking(false);
  }, [algorithm, game]);

  const reset = useCallback(() => {
    setGame(createInitialGameState());
    setLastMoveResult(null);
    setIsThinking(false);
  }, []);

  const statusLabel =
    game.status === "won"
      ? `${game.winner} wins!`
      : game.status === "draw"
        ? "Draw"
        : `${game.currentPlayer}'s turn`;

  return (
    <Layout>
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Tic-Tac-Toe AI</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Compare Minimax and Alpha-Beta pruning on adversarial search.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Board
              board={game.board}
              disabled={game.status !== "playing" || isThinking}
              onCellClick={playMove}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{statusLabel}</p>
              <button
                type="button"
                onClick={reset}
                disabled={isThinking}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                <RotateCcw className="size-4" />
                New Game
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">AI Algorithm</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {TICTACTOE_ALGORITHMS.map((option) => (
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
              onClick={requestAiMove}
              disabled={isThinking}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Bot className="size-4" />
              {isThinking ? "Thinking…" : "AI Move"}
            </button>

            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Metrics</h2>
              {lastMoveResult ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  <MetricCard
                    label="Search Time"
                    value={formatMs(lastMoveResult.elapsedMs ?? 0)}
                    icon={Clock}
                  />
                  <MetricCard
                    label="Nodes Visited"
                    value={formatCount(lastMoveResult.nodesVisited)}
                    icon={GitBranch}
                  />
                  <MetricCard label="Depth" value={formatCount(lastMoveResult.depth)} icon={Layers} />
                </div>
              ) : (
                <p className="text-sm text-neutral-500">Request an AI move to see search metrics.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
