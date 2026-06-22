import { createTimer } from "@/shared/metrics";
import {
  applyMove,
  findWinner,
  getAvailableMoves,
  getGameStatus,
  switchPlayer,
} from "@/modules/tictactoe/game";
import type { Board, Move, MoveResult, Player } from "@/modules/tictactoe/types";

/** Terminal score when the AI (the `player` passed into search) wins. */
const WIN_SCORE = 10;

/** Terminal score when the opponent wins. */
const LOSS_SCORE = -10;

/** Terminal score for a draw, and for non-terminal (still playing) positions. */
const DRAW_SCORE = 0;

/**
 * Mutable counters shared across a single search so the recursive helpers
 * can report dashboard metrics without threading many return values.
 */
interface SearchStats {
  /** How many board positions the search actually visited (expanded). */
  nodesVisited: number;
  /** Deepest ply reached from the root (0 = root only). */
  maxDepth: number;
  /**
   * Alpha-beta only: branches skipped because a cutoff proved they cannot
   * improve the current best score. Filled when we compare against minimax.
   */
  nodesPruned: number;
}

/**
 * Evaluate a board from the AI's perspective.
 *
 * Assignment minimum:
 *   +10  → AI (`player`) has won
 *   -10  → opponent has won
 *     0  → draw or game still in progress
 *
 * We only call this at terminal nodes (win/draw) or when `maxDepth` is hit
 * mid-game; in-progress boards always score 0.
 */
export function evaluateBoard(board: Board, player: Player): number {
  const winner = findWinner(board);

  if (winner === player) {
    return WIN_SCORE;
  }

  if (winner !== null) {
    return LOSS_SCORE;
  }

  if (getGameStatus(board) === "draw") {
    return DRAW_SCORE;
  }

  return DRAW_SCORE;
}

/**
 * True when search should stop: someone won, board is full, or depth limit hit.
 */
function isTerminal(board: Board, depth: number, maxDepth?: number): boolean {
  if (getGameStatus(board) !== "playing") {
    return true;
  }

  return maxDepth !== undefined && depth >= maxDepth;
}

/**
 * Classic Minimax recursion.
 *
 * @param board         Current board (immutable — we copy on each move).
 * @param depth         Ply depth from the root move being considered.
 * @param maximizing    True when it is the AI's turn, false for the opponent.
 * @param player        The AI we are optimizing for (maximizing player).
 * @param stats         Shared visit/depth counters for the dashboard.
 * @param maxDepth      Optional ply cap; non-terminal leaves score 0.
 */
function minimax(
  board: Board,
  depth: number,
  maximizing: boolean,
  player: Player,
  stats: SearchStats,
  maxDepth?: number,
): number {
  stats.nodesVisited += 1;
  stats.maxDepth = Math.max(stats.maxDepth, depth);

  if (isTerminal(board, depth, maxDepth)) {
    return evaluateBoard(board, player);
  }

  const mover = maximizing ? player : switchPlayer(player);
  const moves = getAvailableMoves(board);

  if (maximizing) {
    let best = Number.NEGATIVE_INFINITY; // The best score for the maximizing player.

    for (const index of moves) {
      const child = applyMove(board, { index, player: mover });
      const score = minimax(child, depth + 1, false, player, stats, maxDepth);
      best = Math.max(best, score);
    }

    return best;
  }

  let best = Number.POSITIVE_INFINITY; // The best score for the minimizing player.

  for (const index of moves) {
    const child = applyMove(board, { index, player: mover });
    const score = minimax(child, depth + 1, true, player, stats, maxDepth);
    best = Math.min(best, score);
  }

  return best;
}

/**
 * Minimax with Alpha-Beta pruning — same optimal move as plain minimax,
 * but skips subtrees when `beta <= alpha`.
 *
 * When a cutoff happens, we estimate pruned work as the remaining sibling
 * moves at that node (each would have opened at least one child).
 */
function alphaBeta(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  player: Player,
  stats: SearchStats,
  maxDepth?: number,
): number {
  stats.nodesVisited += 1;
  stats.maxDepth = Math.max(stats.maxDepth, depth);

  if (isTerminal(board, depth, maxDepth)) {
    return evaluateBoard(board, player);
  }

  const mover = maximizing ? player : switchPlayer(player); // If the player is maximizing, the mover is the player. Otherwise, the mover is the opponent.
  const moves = getAvailableMoves(board);

  if (maximizing) {
    let value = Number.NEGATIVE_INFINITY; // The best score for the maximizing player.

    for (let i = 0; i < moves.length; i++) { // Try each legal move.
      const index = moves[i];
      const child = applyMove(board, { index, player: mover }); // Apply the move to the board.
      value = Math.max(value, alphaBeta(child, depth + 1, alpha, beta, false, player, stats, maxDepth)); // Recursively search the child board.
      alpha = Math.max(alpha, value); // Update the alpha value, if the value is greater than the alpha value.

      if (alpha >= beta) {
        // Prune remaining moves at this maximizer node.
        stats.nodesPruned += moves.length - i - 1; // Increment the number of nodes pruned.
        break;
      }
    }

    return value;
  }

  let value = Number.POSITIVE_INFINITY; // The best score for the minimizing player.

  for (let i = 0; i < moves.length; i++) { // Try each legal move.
    const index = moves[i];
    const child = applyMove(board, { index, player: mover }); // Apply the move to the board.
    value = Math.min(value, alphaBeta(child, depth + 1, alpha, beta, true, player, stats, maxDepth)); // Recursively search the child board.
    beta = Math.min(beta, value); // Update the beta value, if the value is less than the beta value.

    if (alpha >= beta) {
      stats.nodesPruned += moves.length - i - 1; // Increment the number of nodes pruned.
      break;
    }
  }

  return value;
}

/**
 * Count minimax node visits using the same root structure as `findBestMoveMinimax`
 * (try each legal move, then search the child). Keeps pruning-rate math apples-to-apples.
 */
function countMinimaxNodes(board: Board, player: Player, maxDepth?: number): number {
  const stats: SearchStats = { nodesVisited: 0, maxDepth: 0, nodesPruned: 0 };

  for (const index of getAvailableMoves(board)) {
    const child = applyMove(board, { index, player });
    minimax(child, 1, false, player, stats, maxDepth);
  }

  return stats.nodesVisited;
}

/**
 * Pick the best move for `player` by trying every legal square and running
 * minimax on the resulting child board.
 */
function selectBestMove(
  board: Board,
  player: Player,
  search: (
    child: Board,
    depth: number,
    maximizing: boolean,
    stats: SearchStats,
  ) => number,
): { move: Move; score: number; stats: SearchStats } {
  const moves = getAvailableMoves(board);

  if (moves.length === 0) {
    throw new Error("No legal moves available");
  }

  const stats: SearchStats = { nodesVisited: 0, maxDepth: 0, nodesPruned: 0 };

  let bestIndex = moves[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const index of moves) {
    const child = applyMove(board, { index, player });
    // Root: AI just moved, so the reply is the opponent (minimizing ply).
    const score = search(child, 1, false, stats); 

    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }

  return {
    move: { index: bestIndex, player },
    score: bestScore,
    stats,
  };
}

/**
 * Minimax move selector — exhaustively searches the game tree for optimal play.
 * Populates `MoveResult` fields used by the performance dashboard.
 */
export function findBestMoveMinimax(
  board: Board,
  player: Player,
  options?: { maxDepth?: number },
): MoveResult {
  const timer = createTimer();
  timer.start();

  const { move, score, stats } = selectBestMove(
    board,
    player,
    (child, depth, maximizing, searchStats) =>
      minimax(child, depth, maximizing, player, searchStats, options?.maxDepth),
  );

  const { elapsedMs } = timer.stop();
  // Move Result
  return {
    move,
    score,
    nodesVisited: stats.nodesVisited,
    depth: stats.maxDepth,
    elapsedMs,
  };
}

/**
 * Alpha-Beta move selector — same optimal move as minimax with fewer visits.
 *
 * `nodesPruned` and `pruningRate` compare this search against a full minimax
 * run on the same position (assignment formula).
 */
export function findBestMoveAlphaBeta(
  board: Board,
  player: Player,
  options?: { maxDepth?: number },
): MoveResult {
  const timer = createTimer();
  timer.start();

  const { move, score, stats } = selectBestMove(
    board,
    player,
    (child, depth, maximizing, searchStats) =>
      alphaBeta(
        child,
        depth,
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        maximizing,
        player,
        searchStats,
        options?.maxDepth,
      ),
  );
  const { elapsedMs } = timer.stop();

  const minimaxNodes = countMinimaxNodes(board, player, options?.maxDepth);
  const nodesPruned = Math.max(0, minimaxNodes - stats.nodesVisited);
  const pruningRate = minimaxNodes > 0 ? nodesPruned / minimaxNodes : 0;

  

  return {
    move,
    score,
    nodesVisited: stats.nodesVisited,
    depth: stats.maxDepth,
    nodesPruned,
    pruningRate,
    elapsedMs,
  };
}
