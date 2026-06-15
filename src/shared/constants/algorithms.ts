import type { AlgorithmOption } from "@/shared/types/algorithm";

export type PuzzleAlgorithmId = "bfs" | "dijkstra" | "astar";

export type TicTacToeAlgorithmId = "minimax" | "alpha-beta";

export const PUZZLE_ALGORITHMS: AlgorithmOption<PuzzleAlgorithmId>[] = [
  {
    id: "bfs",
    label: "Breadth-First Search",
    description: "Explores states level by level to find the shortest solution.",
  },
  {
    id: "dijkstra",
    label: "Dijkstra",
    description: "Uniform-cost search with move-weighted edge costs.",
  },
  {
    id: "astar",
    label: "A*",
    description: "Best-first search guided by a Manhattan distance heuristic.",
  },
];

export const TICTACTOE_ALGORITHMS: AlgorithmOption<TicTacToeAlgorithmId>[] = [
  {
    id: "minimax",
    label: "Minimax",
    description: "Exhaustive game-tree search for optimal play.",
  },
  {
    id: "alpha-beta",
    label: "Alpha-Beta Pruning",
    description: "Minimax with branch pruning for faster search.",
  },
];
