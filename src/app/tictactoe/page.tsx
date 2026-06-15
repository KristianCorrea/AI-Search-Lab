"use client";

import { Layout } from "@/shared/components/Layout";
import { AIControls } from "@/modules/tictactoe/components/AIControls";
import { Board } from "@/modules/tictactoe/components/Board";
import { GameControls } from "@/modules/tictactoe/components/GameControls";
import { GameMetrics } from "@/modules/tictactoe/components/GameMetrics";
import { useTicTacToe } from "@/modules/tictactoe/hooks/useTicTacToe";

export default function TicTacToePage() {
  const {
    game,
    algorithm,
    isThinking,
    lastMoveResult,
    setAlgorithm,
    playMove,
    requestAiMove,
    reset,
  } = useTicTacToe();

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
            <GameControls
              onReset={reset}
              statusLabel={statusLabel}
              disabled={isThinking}
            />
          </div>

          <div className="space-y-6">
            <AIControls
              algorithm={algorithm}
              onAlgorithmChange={setAlgorithm}
              onAiMove={requestAiMove}
              isThinking={isThinking}
            />
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Metrics
              </h2>
              <GameMetrics result={lastMoveResult} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
