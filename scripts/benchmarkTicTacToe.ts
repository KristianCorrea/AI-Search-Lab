import { EMPTY_BOARD } from "@/shared/constants";
import { findBestMoveMinimax, findBestMoveAlphaBeta } from "@/modules/tictactoe/ai";

console.log("Tic-Tac-Toe benchmark — empty board, X plays first\n");

try {
  const minimax = findBestMoveMinimax(EMPTY_BOARD, "X");
  console.log(`Minimax    | nodes: ${minimax.nodesVisited} | move: ${minimax.move.index}`);
} catch {
  console.log("Minimax    | not implemented");
}

try {
  const alphaBeta = findBestMoveAlphaBeta(EMPTY_BOARD, "X");
  console.log(`Alpha-Beta | nodes: ${alphaBeta.nodesVisited} | move: ${alphaBeta.move.index}`);
  if (alphaBeta.pruningRate !== undefined) {
    console.log(`Pruning rate: ${(alphaBeta.pruningRate * 100).toFixed(1)}%`);
  }
} catch {
  console.log("Alpha-Beta | not implemented");
}
