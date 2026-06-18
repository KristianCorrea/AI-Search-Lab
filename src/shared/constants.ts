export const ROUTES = {
  home: "/",
  puzzle: "/puzzle",
  tictactoe: "/tictactoe",
} as const;

export type PuzzleAlgorithmId = "bfs" | "dijkstra" | "astar";
export type TicTacToeAlgorithmId = "minimax" | "alpha-beta";

export interface AlgorithmOption<T extends string = string> {
  id: T;
  label: string;
  description: string;
}

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

/** Standardized Module A test puzzle (optimal depth 14). */
export const TEST_PUZZLE = [8, 1, 3, 4, 0, 2, 7, 6, 5] as const;
export const GOAL_PUZZLE = [1, 2, 3, 4, 5, 6, 7, 8, 0] as const;

/** Standardized Module B test position (empty board). */
export const EMPTY_BOARD: (null | "X" | "O")[] = Array(9).fill(null);
