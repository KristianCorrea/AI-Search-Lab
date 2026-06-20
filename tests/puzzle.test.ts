import { describe, expect, it } from "vitest";
import { TEST_PUZZLE } from "@/shared/constants";
import {
  applyMove,
  createSolvedState,
  deserializeState,
  getNeighbors,
  serializeState,
  shufflePuzzle,
  stateFromTiles,
  statesEqual,
} from "@/modules/puzzle/board";

import { PriorityQueue } from "@/modules/puzzle/PriorityQueue";
import { manhattanDistance, misplacedTiles, solveAstar, solveDijkstra } from "@/modules/puzzle/solvers";

describe("manhattanDistance", () => {
  it("returns 0 for a solved board", () => {
    expect(manhattanDistance(createSolvedState(3))).toBe(0);
  });

  it("returns the known distance for the standardized test puzzle", () => {
    expect(manhattanDistance(stateFromTiles(3, [...TEST_PUZZLE]))).toBe(10);
  });

  it("counts distance for a single misplaced tile", () => {
    // One slide from solved: only tile 8 is one step from goal.
    const state = stateFromTiles(3, [1, 2, 3, 4, 5, 6, 7, 0, 8]);
    expect(manhattanDistance(state)).toBe(1);
  });

  it("does not add distance for the blank tile", () => {
    const state = stateFromTiles(3, [1, 2, 3, 4, 0, 6, 7, 8, 5]);
    // Only tile 5 is misplaced (distance 2); blank at center is skipped.
    expect(manhattanDistance(state)).toBe(2);
  });
});

describe("misplacedTiles", () => {
  it("returns 0 for a solved board", () => {
    expect(misplacedTiles(createSolvedState(3))).toBe(0);
  });

  it("returns the known count for the standardized test puzzle", () => {
    expect(misplacedTiles(stateFromTiles(3, [...TEST_PUZZLE]))).toBe(5);
  });

  it("counts a single misplaced tile", () => {
    const state = stateFromTiles(3, [1, 2, 3, 4, 5, 6, 7, 0, 8]);
    expect(misplacedTiles(state)).toBe(1);
  });

  it("does not count the blank tile", () => {
    const state = stateFromTiles(3, [1, 2, 3, 4, 0, 6, 7, 8, 5]);
    expect(misplacedTiles(state)).toBe(1);
  });
});

describe("PriorityQueue", () => {
  it("starts empty", () => {
    const queue = new PriorityQueue<string>();
    expect(queue.isEmpty()).toBe(true);
    expect(queue.size).toBe(0);
    expect(queue.peek()).toBeUndefined();
    expect(queue.dequeue()).toBeUndefined();
  });

  it("dequeues items in ascending priority order", () => {
    const queue = new PriorityQueue<string>();
    queue.enqueue("low", 3);
    queue.enqueue("high", 1);
    queue.enqueue("mid", 2);

    expect(queue.dequeue()).toBe("high");
    expect(queue.dequeue()).toBe("mid");
    expect(queue.dequeue()).toBe("low");
    expect(queue.dequeue()).toBeUndefined();
  });

  it("peek returns the next item without removing it", () => {
    const queue = new PriorityQueue<number>();
    queue.enqueue(10, 5);
    queue.enqueue(20, 1);

    expect(queue.peek()).toBe(20);
    expect(queue.size).toBe(2);
    expect(queue.dequeue()).toBe(20);
    expect(queue.peek()).toBe(10);
  });

  it("tracks size as items are enqueued and dequeued", () => {
    const queue = new PriorityQueue<string>();
    queue.enqueue("a", 1);
    queue.enqueue("b", 2);
    expect(queue.size).toBe(2);

    queue.dequeue();
    expect(queue.size).toBe(1);
    expect(queue.isEmpty()).toBe(false);

    queue.dequeue();
    expect(queue.size).toBe(0);
    expect(queue.isEmpty()).toBe(true);
  });
});

describe("puzzle solvers", () => {
  it.todo("BFS finds optimal solution for the standardized 14-move puzzle");

  it("Dijkstra returns minimum-cost path with uniform move weights", () => {
    const initial = stateFromTiles(3, [...TEST_PUZZLE]);
    const result = solveDijkstra(initial);

    expect(result.algorithm).toBe("dijkstra");
    expect(result.solved).toBe(true);
    expect(result.moves).toHaveLength(14);
    expect(result.nodesExpanded).toBeGreaterThan(1000);
  });

  it("Dijkstra returns zero moves for an already solved board", () => {
    const result = solveDijkstra(createSolvedState(3));

    expect(result.solved).toBe(true);
    expect(result.moves).toHaveLength(0);
    expect(result.nodesExpanded).toBe(1);
  });

  it("A* finds optimal solution using Manhattan heuristic", () => {
    const initial = stateFromTiles(3, [...TEST_PUZZLE]);
    const result = solveAstar(initial);

    expect(result.algorithm).toBe("astar");
    expect(result.solved).toBe(true);
    expect(result.moves).toHaveLength(14);
    expect(result.nodesExpanded).toBeLessThan(500);
  });

  it("A* accepts a custom heuristic via options", () => {
    const initial = stateFromTiles(3, [...TEST_PUZZLE]);
    const result = solveAstar(initial, { heuristic: misplacedTiles });

    expect(result.solved).toBe(true);
    expect(result.moves).toHaveLength(14);
    expect(result.nodesExpanded).toBeGreaterThan(result.moves.length);
  });

  it("A* returns zero moves for an already solved board", () => {
    const result = solveAstar(createSolvedState(3));

    expect(result.solved).toBe(true);
    expect(result.moves).toHaveLength(0);
    expect(result.nodesExpanded).toBe(1);
  });
});

describe("createSolvedState", () => {
  it("creates a 3x3 solved board with blank in bottom-right", () => {
    const state = createSolvedState(3);
    expect(state.size).toBe(3);
    expect(state.tiles).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 0]);
    expect(state.blankIndex).toBe(8);
  });
});

describe("stateFromTiles", () => {
  it("builds state from tile array and finds blank", () => {
    const state = stateFromTiles(3, [...TEST_PUZZLE]);
    expect(state.tiles).toEqual([...TEST_PUZZLE]);
    expect(state.blankIndex).toBe(4);
  });

  it("does not mutate the input array", () => {
    const tiles = [...TEST_PUZZLE];
    stateFromTiles(3, tiles);
    expect(tiles).toEqual([...TEST_PUZZLE]);
  });
});

describe("statesEqual", () => {
  it("returns true for identical tile layouts", () => {
    const a = stateFromTiles(3, [...TEST_PUZZLE]);
    const b = stateFromTiles(3, [...TEST_PUZZLE]);
    expect(statesEqual(a, b)).toBe(true);
  });

  it("returns false when tiles differ", () => {
    const a = createSolvedState(3);
    const b = stateFromTiles(3, [...TEST_PUZZLE]);
    expect(statesEqual(a, b)).toBe(false);
  });
});

describe("serializeState / deserializeState", () => {
  it("round-trips a puzzle state", () => {
    const original = stateFromTiles(3, [...TEST_PUZZLE]);
    const restored = deserializeState(serializeState(original));
    expect(restored).toEqual(original);
  });

  it("produces stable keys for visited-set lookup", () => {
    const a = stateFromTiles(3, [...TEST_PUZZLE]);
    const b = stateFromTiles(3, [...TEST_PUZZLE]);
    expect(serializeState(a)).toBe(serializeState(b));
  });
});

describe("applyMove", () => {
  it("swaps blank with adjacent tile without mutating input", () => {
    const before = createSolvedState(3);
    const move = { fromIndex: 7, toIndex: 8, direction: "right" as const };
    const after = applyMove(before, move);

    expect(before.tiles).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 0]);
    expect(after.tiles).toEqual([1, 2, 3, 4, 5, 6, 7, 0, 8]);
    expect(after.blankIndex).toBe(7);
  });
});

describe("getNeighbors", () => {
  it("returns 2 neighbors for solved 3x3 (corner blank)", () => {
    const solved = createSolvedState(3);
    const neighbors = getNeighbors(solved);
    expect(neighbors).toHaveLength(2);
  });

  it("returns 4 neighbors when blank is in the center", () => {
    const state = stateFromTiles(3, [1, 2, 3, 4, 0, 6, 7, 8, 5]);
    expect(getNeighbors(state)).toHaveLength(4);
  });

  it("does not mutate the input state", () => {
    const state = createSolvedState(3);
    const before = [...state.tiles];
    getNeighbors(state);
    expect(state.tiles).toEqual(before);
  });

  it("returns moves that produce the neighbor state via applyMove", () => {
    const solved = createSolvedState(3);
    for (const { state, move } of getNeighbors(solved)) {
      expect(applyMove(solved, move)).toEqual(state);
      expect(move.toIndex).toBe(solved.blankIndex);
    }
  });
});

describe("shufflePuzzle", () => {
  it("returns same state when moves is 0", () => {
    const solved = createSolvedState(3);
    const shuffled = shufflePuzzle(solved, 0);
    expect(statesEqual(shuffled, solved)).toBe(true);
  });

  it("does not mutate the input state", () => {
    const solved = createSolvedState(3);
    const before = [...solved.tiles];
    shufflePuzzle(solved, 10);
    expect(solved.tiles).toEqual(before);
  });

  it("scrambles the board after enough moves", () => {
    const solved = createSolvedState(3);
    const shuffled = shufflePuzzle(solved, 20);
    expect(statesEqual(shuffled, solved)).toBe(false);
  });
});
