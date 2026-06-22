import { RotateCcw } from "lucide-react";
import { Layout } from "@/shared/Layout";
import { BoardGrid } from "@/pages/tictactoe/components/BoardGrid";
import { AiVsAiSettings, HumanVsAiSettings } from "@/pages/tictactoe/components/GameSettings";
import { GameOutcomeBanner } from "@/pages/tictactoe/components/GameOutcomeBanner";
import { HistoryBrowseBanner } from "@/pages/tictactoe/components/HistoryBrowseBanner";
import { TurnStatusBanner } from "@/pages/tictactoe/components/TurnStatusBanner";
import { MetricsPanel } from "@/pages/tictactoe/components/MetricsPanel";
import { ModeTabs } from "@/pages/tictactoe/components/ModeTabs";
import { MoveLogPanel } from "@/pages/tictactoe/components/MoveLogPanel";
import { useTicTacToeGame } from "@/pages/tictactoe/useTicTacToeGame";

// ── TicTacToe (main page) ─────────────────────────────────────────────────────
/**
 * TicTacToe component
 * @description The main component for the Tic Tac Toe game.
 * @returns The TicTacToe component.
 */
export default function TicTacToe() {
  const game = useTicTacToeGame();

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <section className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Tic-Tac-Toe AI</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Compare Minimax and Alpha-Beta pruning on adversarial search.
          </p>
        </section>

        {/* Mode tabs */}
        <ModeTabs
          mode={game.mode}
          onModeChange={(m) => game.doReset({ newMode: m })}
        />

        {/* Two-column layout */}
        <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
          {/* ── Left: board ────────────────────────────────────────────── */}
          <div className="w-full max-w-xs shrink-0 space-y-4 lg:w-80">
            {/* History-browse banner */}
            {!game.isLiveView && game.mode === "human-ai" && (
              <HistoryBrowseBanner
                effectiveStep={game.effectiveStep}
                totalMoves={game.moveHistory.length}
                onBackToLive={game.jumpToLive}
              />
            )}

            {game.showTurnBanner ? (
              <TurnStatusBanner
                isPlayerTurn={game.boardClickable}
                humanPlayer={game.humanPlayer}
                isAiThinking={game.isAiThinking}
              />
            ) : null}

            <BoardGrid
              board={game.displayBoard}
              winningLine={game.displayWinningLine}
              lastMoveCellIndex={game.displayLastMove}
              disabled={!game.boardClickable}
              onCellClick={game.boardClickable ? game.handleHumanMove : undefined}
            />

            {game.boardClickable ? (
              <p className="text-xs text-neutral-500">
                Tap an empty highlighted square to make your move.
              </p>
            ) : null}

            {/* Status + New Game row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                className={[
                  "text-sm font-medium",
                  game.isAiThinking
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-neutral-600 dark:text-neutral-400",
                ].join(" ")}
              >
                {game.statusLabel}
              </p>
              <button
                type="button"
                onClick={() => game.doReset()}
                disabled={game.isAiThinking}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                <RotateCcw className="size-4" />
                New Game
              </button>
            </div>

            {/* Game outcome banner */}
            <GameOutcomeBanner outcomeText={game.outcomeText} />
          </div>

          {/* ── Right: settings + metrics + log ────────────────────────── */}
          <div className="space-y-6">
            {/* ─ Human vs AI settings ─ */}
            {game.mode === "human-ai" && (
              <HumanVsAiSettings
                humanPlayer={game.humanPlayer}
                aiAlgorithm={game.aiAlgorithm}
                isAiThinking={game.isAiThinking}
                onHumanPlayerChange={(p) => game.doReset({ newHumanPlayer: p })}
                onAiAlgorithmChange={game.setAiAlgorithm}
              />
            )}

            {/* ─ AI vs AI settings + controls ─ */}
            {game.mode === "ai-ai" && (
              <AiVsAiSettings
                algorithmX={game.algorithmX}
                algorithmO={game.algorithmO}
                aiAiStarted={game.aiAiStarted}
                viewStep={game.viewStep}
                moveCount={game.moveHistory.length}
                isAutoPlaying={game.isAutoPlaying}
                onAlgorithmXChange={game.setAlgorithmX}
                onAlgorithmOChange={game.setAlgorithmO}
                onStartGame={game.startAiAiGame}
                onJumpToStart={game.jumpToStart}
                onStepBack={game.stepBack}
                onTogglePlay={game.toggleAutoPlay}
                onStepForward={game.stepForward}
                onJumpToEnd={game.jumpToEnd}
              />
            )}

            {/* ─ Metrics ─ */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Metrics
                {game.viewedRecord && (
                  <span className="ml-2 font-normal normal-case text-neutral-400 text-xs">
                    — Move {game.effectiveStep}
                    {game.viewedRecord.algorithm !== "human" && ` · ${game.viewedRecord.algorithm}`}
                  </span>
                )}
              </h2>
              <MetricsPanel result={game.displayMetricsResult} algorithm={game.displayMetricsAlgo} />
            </div>

            {/* ─ Move Log ─ */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                  Move Log
                </h2>
                {!game.isLiveView && game.mode === "human-ai" && (
                  <button
                    type="button"
                    onClick={game.jumpToLive}
                    className="cursor-pointer text-xs text-violet-600 hover:underline dark:text-violet-400"
                  >
                    ↩ Live
                  </button>
                )}
              </div>
              <MoveLogPanel
                history={game.moveHistory}
                viewStep={game.viewStep}
                isLive={game.isLiveView}
                onStepSelect={game.handleStepSelect}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
