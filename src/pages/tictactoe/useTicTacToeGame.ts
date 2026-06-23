import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TicTacToeAlgorithmId } from "@/shared/constants";
import { computeAiVsAiGame } from "@/modules/tictactoe/autoplay";
import { GameManager, getWinningLine } from "@/modules/tictactoe/game";
import {
  analyzePosition,
  buildMoveRecord,
  INITIAL_BOARD,
  runAiSearch,
} from "@/modules/tictactoe/session";
import type { GameMode, GameState, MoveRecord, Player, PositionAnalysis } from "@/modules/tictactoe/types";

export interface ResetOptions {
  newMode?: GameMode;
  newHumanPlayer?: Player;
  newAiAlgo?: TicTacToeAlgorithmId;
}

/**
 * Get the next player after a move record.
 * @param record - The move record.
 * @returns The next player.
 */
function nextPlayerAfterRecord(record: MoveRecord): Player {
  return record.player === "X" ? "O" : "X";
}

export function useTicTacToeGame() {
  // ── Mode ──────────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<GameMode>("human-ai");

  // ── Human vs AI ───────────────────────────────────────────────────────────
  const [humanPlayer, setHumanPlayer] = useState<Player>("X");
  const [aiAlgorithm, setAiAlgorithm] = useState<TicTacToeAlgorithmId>("minimax");

  // ── AI vs AI ──────────────────────────────────────────────────────────────
  const [algorithmX, setAlgorithmX] = useState<TicTacToeAlgorithmId>("minimax");
  const [algorithmO, setAlgorithmO] = useState<TicTacToeAlgorithmId>("alpha-beta");
  const [aiAiStarted, setAiAiStarted] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // ── Live game (human-ai + human-human) ────────────────────────────────────
  const gameManagerRef = useRef(new GameManager());
  const [liveGame, setLiveGame] = useState<GameState>(() => gameManagerRef.current.getState());
  const isAiThinkingRef = useRef(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // ── Human vs Human advisory ───────────────────────────────────────────────
  const [advisory, setAdvisory] = useState<PositionAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ── Shared history + view ─────────────────────────────────────────────────
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  /**
   * null = live game view (human-ai / human-human)
   * 0    = initial empty board
   * k    = board state after move k (1-based)
   */
  const [viewStep, setViewStep] = useState<number | null>(null);

  const isLiveMode = mode === "human-ai" || mode === "human-human";
  const isLiveView = isLiveMode && viewStep === null;

  // The record for the currently viewed step (null if at live game or empty board).
  const effectiveStep = viewStep ?? moveHistory.length;
  const viewedRecord: MoveRecord | null =
    effectiveStep > 0 ? (moveHistory[effectiveStep - 1] ?? null) : null;

  // What to render on the board
  const displayBoard = isLiveView ? liveGame.board : (viewedRecord?.boardAfter ?? INITIAL_BOARD);
  const displayWinningLine = isLiveView
    ? getWinningLine(liveGame.board)
    : (viewedRecord?.winningLine ?? null);
  const displayLastMove = isLiveView
    ? (moveHistory.length > 0 ? moveHistory[moveHistory.length - 1].cellIndex : null)
    : (viewedRecord?.cellIndex ?? null);
  const displayMetricsResult = viewedRecord?.moveResult ?? null;
  const displayMetricsAlgo = viewedRecord?.algorithm ?? null;

  // For Human vs Human mode, the current player and board state for algorithm analysis.
  const advisoryContext = useMemo(() => {
    if (mode !== "human-human") return null;

    if (isLiveView) {
      if (liveGame.status !== "playing") {
        return { board: liveGame.board, player: null as Player | null };
      }
      return { board: liveGame.board, player: liveGame.currentPlayer };
    }

    if (viewStep === 0) {
      return { board: INITIAL_BOARD, player: "X" as Player };
    }

    if (viewedRecord?.gameStatus === "playing") {
      return {
        board: viewedRecord.boardAfter,
        player: nextPlayerAfterRecord(viewedRecord),
      };
    }

    return { board: viewedRecord?.boardAfter ?? INITIAL_BOARD, player: null as Player | null };
  }, [mode, isLiveView, liveGame.board, liveGame.status, liveGame.currentPlayer, viewStep, viewedRecord]);

  /**
   * AI vs AI playback timer.
   *
   * In ai-ai mode the full game is computed upfront; viewStep selects which
   * snapshot from moveHistory is shown (0 = empty board, k = after move k).
   * When isAutoPlaying is true, advance viewStep every 750 ms so the board
   * replays like a slideshow. Stop at the last move and clear isAutoPlaying.
   * No-op in other modes or when playback is paused.
   */
  useEffect(() => {
    if (!isAutoPlaying || mode !== "ai-ai") return;

    const interval = setInterval(() => {
      setViewStep((prev) => {
        const next = (prev ?? 0) + 1;
        if (next >= moveHistory.length) {
          setIsAutoPlaying(false);
          return moveHistory.length;
        }
        return next;
      });
    }, 750);

    return () => clearInterval(interval);
  }, [isAutoPlaying, mode, moveHistory.length]);

  // ── Human vs Human: dual-algorithm advisory ───────────────────────────────
  useEffect(() => {
    if (mode !== "human-human" || !advisoryContext?.player) {
      setAdvisory(null);
      setIsAnalyzing(false);
      return;
    }

    const { board, player } = advisoryContext;
    setIsAnalyzing(true);
    setAdvisory(null);

    const timerId = window.setTimeout(() => {
      setAdvisory(analyzePosition(board, player));
      setIsAnalyzing(false);
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [mode, advisoryContext]);

  // ── Execute one AI move in human-ai live game ─────────────────────────────
  const executeAiResponse = useCallback((algo: TicTacToeAlgorithmId) => {
    const state = gameManagerRef.current.getState();
    if (state.status !== "playing") return;

    const result = runAiSearch(state.board, state.currentPlayer, algo);
    const newState = gameManagerRef.current.makeMove(result.move);

    setLiveGame({ ...newState });
    setMoveHistory((prev) => [
      ...prev,
      buildMoveRecord(
        prev.length + 1,
        result.move.player,
        result.move.index,
        algo,
        newState.board,
        result,
        newState.status,
        newState.winner,
      ),
    ]);
  }, []);

  const recordHumanMove = useCallback(
    (cellIndex: number, player: Player, algorithm: TicTacToeAlgorithmId | "human") => {
      const newState = gameManagerRef.current.makeMove({ index: cellIndex, player });

      setLiveGame({ ...newState });
      setMoveHistory((prev) => [
        ...prev,
        buildMoveRecord(
          prev.length + 1,
          player,
          cellIndex,
          algorithm,
          newState.board,
          null,
          newState.status,
          newState.winner,
        ),
      ]);
      setViewStep(null);
    },
    [],
  );

  // ── Human clicks a board cell (human-ai) ──────────────────────────────────
  const handleHumanMove = useCallback(
    (cellIndex: number) => {
      if (mode !== "human-ai" || isAiThinkingRef.current) return;
      const state = gameManagerRef.current.getState();
      if (state.status !== "playing" || state.currentPlayer !== humanPlayer) return;

      recordHumanMove(cellIndex, humanPlayer, "human");

      const newState = gameManagerRef.current.getState();
      if (newState.status === "playing") {
        isAiThinkingRef.current = true;
        setIsAiThinking(true);
        setTimeout(() => {
          executeAiResponse(aiAlgorithm);
          isAiThinkingRef.current = false;
          setIsAiThinking(false);
        }, 350);
      }
    },
    [mode, humanPlayer, aiAlgorithm, executeAiResponse, recordHumanMove],
  );

  // ── Human clicks a board cell (human-human) ───────────────────────────────
  const handlePlayerMove = useCallback(
    (cellIndex: number) => {
      if (mode !== "human-human") return;
      const state = gameManagerRef.current.getState();
      if (state.status !== "playing") return;

      recordHumanMove(cellIndex, state.currentPlayer, "human");
    },
    [mode, recordHumanMove],
  );

  const handleCellClick = useCallback(
    (cellIndex: number) => {
      if (mode === "human-ai") handleHumanMove(cellIndex);
      else if (mode === "human-human") handlePlayerMove(cellIndex);
    },
    [mode, handleHumanMove, handlePlayerMove],
  );

  // ── Start AI vs AI game ───────────────────────────────────────────────────
  const startAiAiGame = useCallback(() => {
    const history = computeAiVsAiGame(algorithmX, algorithmO);
    setMoveHistory(history);
    setViewStep(0);
    setAiAiStarted(true);
    setIsAutoPlaying(true);
  }, [algorithmX, algorithmO]);

  // ── Reset everything ──────────────────────────────────────────────────────
  const doReset = useCallback(
    ({
      newMode = mode,
      newHumanPlayer = humanPlayer,
      newAiAlgo = aiAlgorithm,
    }: ResetOptions = {}) => {
      gameManagerRef.current = new GameManager();
      setLiveGame(gameManagerRef.current.getState());
      setMoveHistory([]);
      setViewStep(newMode === "ai-ai" ? 0 : null);
      setIsAutoPlaying(false);
      setAiAiStarted(false);
      isAiThinkingRef.current = false;
      setIsAiThinking(false);
      setAdvisory(null);
      setIsAnalyzing(false);
      if (newMode !== mode) setMode(newMode);
      if (newHumanPlayer !== humanPlayer) setHumanPlayer(newHumanPlayer);

      if (newMode === "human-ai" && newHumanPlayer === "O") {
        isAiThinkingRef.current = true;
        setIsAiThinking(true);
        setTimeout(() => {
          executeAiResponse(newAiAlgo);
          isAiThinkingRef.current = false;
          setIsAiThinking(false);
        }, 350);
      }
    },
    [mode, humanPlayer, aiAlgorithm, executeAiResponse],
  );

  // ── Move-log step selection ───────────────────────────────────────────────
  const handleStepSelect = useCallback(
    (step: number) => {
      if (isLiveMode) {
        setViewStep(step >= moveHistory.length ? null : step);
      } else {
        setIsAutoPlaying(false);
        setViewStep(step);
      }
    },
    [isLiveMode, moveHistory.length],
  );

  const jumpToLive = useCallback(() => setViewStep(null), []);

  const jumpToStart = useCallback(() => {
    setViewStep(0);
    setIsAutoPlaying(false);
  }, []);

  const stepBack = useCallback(() => {
    setIsAutoPlaying(false);
    setViewStep((p) => Math.max(0, (p ?? 0) - 1));
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((p) => !p);
  }, []);

  const stepForward = useCallback(() => {
    setIsAutoPlaying(false);
    setViewStep((p) => Math.min(moveHistory.length, (p ?? 0) + 1));
  }, [moveHistory.length]);

  const jumpToEnd = useCallback(() => {
    setViewStep(moveHistory.length);
    setIsAutoPlaying(false);
  }, [moveHistory.length]);

  const statusLabel = (() => {
    if (mode === "human-ai" && isAiThinking) return "AI is thinking…";
    if (viewedRecord) {
      if (viewedRecord.gameStatus === "won") return `${viewedRecord.winner} wins!`;
      if (viewedRecord.gameStatus === "draw") return "Draw!";
      return `${nextPlayerAfterRecord(viewedRecord)}'s turn`;
    }
    if (mode === "ai-ai" && !aiAiStarted) return "Configure algorithms and start";
    if (mode === "ai-ai" && viewStep === 0) return "X goes first — press Play or Step";
    if (liveGame.status === "won") return `${liveGame.winner} wins!`;
    if (liveGame.status === "draw") return "Draw!";
    if (mode === "human-ai") {
      return liveGame.currentPlayer === humanPlayer
        ? `Your turn (${humanPlayer})`
        : `AI's turn (${liveGame.currentPlayer})`;
    }
    return `${liveGame.currentPlayer}'s turn`;
  })();

  const shownStatus = viewedRecord?.gameStatus ?? (isLiveView ? liveGame.status : null);
  const shownWinner = viewedRecord?.winner ?? (isLiveView ? liveGame.winner : null);
  const outcomeText =
    shownStatus === "won"
      ? `${shownWinner} wins!`
      : shownStatus === "draw"
      ? "Draw! (Optimal play always draws.)"
      : null;

  const boardClickable =
    isLiveView &&
    liveGame.status === "playing" &&
    (mode === "human-human" ||
      (mode === "human-ai" &&
        !isAiThinking &&
        liveGame.currentPlayer === humanPlayer));

  const showTurnBanner =
    isLiveView && liveGame.status === "playing" && (mode === "human-ai" || mode === "human-human");

  const turnBannerCurrentPlayer = isLiveView ? liveGame.currentPlayer : null;

  return {
    mode,
    humanPlayer,
    aiAlgorithm,
    algorithmX,
    algorithmO,
    aiAiStarted,
    isAutoPlaying,
    isAiThinking,
    isAnalyzing,
    advisory,
    advisoryPlayer: advisoryContext?.player ?? null,
    moveHistory,
    viewStep,
    isLiveView,
    effectiveStep,
    viewedRecord,
    displayBoard,
    displayWinningLine,
    displayLastMove,
    displayMetricsResult,
    displayMetricsAlgo,
    statusLabel,
    outcomeText,
    boardClickable,
    showTurnBanner,
    turnBannerCurrentPlayer,
    setAiAlgorithm,
    setAlgorithmX,
    setAlgorithmO,
    handleHumanMove,
    handlePlayerMove,
    handleCellClick,
    startAiAiGame,
    doReset,
    handleStepSelect,
    jumpToLive,
    jumpToStart,
    stepBack,
    toggleAutoPlay,
    stepForward,
    jumpToEnd,
  };
}
