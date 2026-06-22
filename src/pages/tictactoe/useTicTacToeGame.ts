import { useCallback, useEffect, useRef, useState } from "react";
import type { TicTacToeAlgorithmId } from "@/shared/constants";
import { computeAiVsAiGame } from "@/modules/tictactoe/autoplay";
import { GameManager, getWinningLine } from "@/modules/tictactoe/game";
import { buildMoveRecord, INITIAL_BOARD, runAiSearch } from "@/modules/tictactoe/session";
import type { GameMode, GameState, MoveRecord, Player } from "@/modules/tictactoe/types";

export interface ResetOptions {
  newMode?: GameMode;
  newHumanPlayer?: Player;
  newAiAlgo?: TicTacToeAlgorithmId;
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

  // ── Live game (human-ai) ──────────────────────────────────────────────────
  const gameManagerRef = useRef(new GameManager());
  const [liveGame, setLiveGame] = useState<GameState>(() => gameManagerRef.current.getState());
  const isAiThinkingRef = useRef(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // ── Shared history + view ─────────────────────────────────────────────────
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  /**
   * null = live game view (human-ai only)
   * 0    = initial empty board
   * k    = board state after move k (1-based)
   */
  const [viewStep, setViewStep] = useState<number | null>(null);

  // Derived: are we showing the live game (human-ai mode, not browsing history)?
  const isLiveView = mode === "human-ai" && viewStep === null;

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

  // ── AI vs AI: auto-play timer ─────────────────────────────────────────────
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

  // ── Human clicks a board cell ─────────────────────────────────────────────
  const handleHumanMove = useCallback(
    (cellIndex: number) => {
      if (mode !== "human-ai" || isAiThinkingRef.current) return;
      const state = gameManagerRef.current.getState();
      if (state.status !== "playing" || state.currentPlayer !== humanPlayer) return;

      const newState = gameManagerRef.current.makeMove({ index: cellIndex, player: humanPlayer });

      setLiveGame({ ...newState });
      setMoveHistory((prev) => [
        ...prev,
        buildMoveRecord(
          prev.length + 1,
          humanPlayer,
          cellIndex,
          "human",
          newState.board,
          null,
          newState.status,
          newState.winner,
        ),
      ]);
      setViewStep(null); // snap back to live view

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
    [mode, humanPlayer, aiAlgorithm, executeAiResponse],
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
      if (newMode !== mode) setMode(newMode);
      if (newHumanPlayer !== humanPlayer) setHumanPlayer(newHumanPlayer);

      // AI goes first when human plays as O
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
      if (mode === "human-ai") {
        // Clicking the latest move while live → stay live; otherwise browse
        setViewStep(step >= moveHistory.length ? null : step);
      } else {
        setIsAutoPlaying(false);
        setViewStep(step);
      }
    },
    [mode, moveHistory.length],
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

  // ── Status text ───────────────────────────────────────────────────────────
  const statusLabel = (() => {
    if (mode === "human-ai" && isAiThinking) return "AI is thinking…";
    if (viewedRecord) {
      if (viewedRecord.gameStatus === "won") return `${viewedRecord.winner} wins!`;
      if (viewedRecord.gameStatus === "draw") return "Draw!";
      const next: Player = viewedRecord.player === "X" ? "O" : "X";
      return `${next}'s turn`;
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

  // Game outcome to show in the result banner
  const shownStatus = viewedRecord?.gameStatus ?? (isLiveView ? liveGame.status : null);
  const shownWinner = viewedRecord?.winner ?? (isLiveView ? liveGame.winner : null);
  const outcomeText =
    shownStatus === "won"
      ? `${shownWinner} wins!`
      : shownStatus === "draw"
      ? "Draw! (Optimal play always draws.)"
      : null;

  // Board is interactive only during your turn in human-ai live view
  const boardClickable =
    mode === "human-ai" &&
    isLiveView &&
    !isAiThinking &&
    liveGame.status === "playing" &&
    liveGame.currentPlayer === humanPlayer;

  return {
    mode,
    humanPlayer,
    aiAlgorithm,
    algorithmX,
    algorithmO,
    aiAiStarted,
    isAutoPlaying,
    isAiThinking,
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
    setAiAlgorithm,
    setAlgorithmX,
    setAlgorithmO,
    handleHumanMove,
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
