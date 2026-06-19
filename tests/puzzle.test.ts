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

describe("puzzle solvers", () => {
  it.todo("BFS finds optimal solution for the standardized 14-move puzzle");
  it.todo("Dijkstra returns minimum-cost path with uniform move weights");
  it.todo("A* finds optimal solution using Manhattan heuristic");
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
