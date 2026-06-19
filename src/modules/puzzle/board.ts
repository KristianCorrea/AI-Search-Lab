import type { PuzzleMove, PuzzleState } from "@/modules/puzzle/types";

/*
 * Creates a solved puzzle state. This is used to initialize the puzzle.
 * @param size - The size of the puzzle.
 * @returns A solved puzzle state. This is a puzzle state where the tiles are in the correct order, and the blank is in the bottom right corner.
 */
export function createSolvedState(size: number): PuzzleState {
  const total = size * size;
  const tiles = Array.from({ length: total - 1 }, (_, i) => i + 1);
  tiles.push(0);
  return { size, tiles, blankIndex: total - 1 };
}

/*
 * Checks if two puzzle states are equal. 
 * Used optionally for comparison without serializing/deserializing. This is not used in the search algorithm.
 * @param a - The first puzzle state.
 * @param b - The second puzzle state.
 * @returns True if the two puzzle states are equal, false otherwise.
 */
export function statesEqual(a: PuzzleState, b: PuzzleState): boolean {
  return a.size === b.size && a.tiles.every((tile, i) => tile === b.tiles[i]);
}

/*
 * Serializes a puzzle state to a string, to store in a set for visited states (granting O(1) lookup). 
 * This is used to avoid revisiting the same state in the search algorithm.
 * @param state - The puzzle state to serialize.
 * @returns A string representation of the puzzle state.
 */
export function serializeState(state: PuzzleState): string {
  return `${state.size}:${state.tiles.join(",")}`;
}

/*
 * Deserializes a puzzle state from a string.
 * @param serialized - The string representation of the puzzle state.
 * @returns The puzzle state.
 */
export function deserializeState(serialized: string): PuzzleState {
  const [sizeStr, tilesStr] = serialized.split(":");
  const size = Number(sizeStr);
  const tiles = tilesStr.split(",").map(Number);
  return { size, tiles, blankIndex: tiles.indexOf(0) };
}

/*
 * Gets the neighbors of a puzzle state. 
 * This will return all the possible states that can be reached from the input state by swapping a tile with the blank.
 * In other words, this is the successor function for state-space search, to explore the puzzle space.
 * @param state - The puzzle state to get the neighbors of.
 * @returns An array of puzzle states that are the neighbors of the input state.
 */
export function getNeighbors(state: PuzzleState): PuzzleState[] {
  const { size, tiles, blankIndex } = state;
  const row = Math.floor(blankIndex / size); // row of the blank
  const col = blankIndex % size; // column of the blank
  const neighbors: PuzzleState[] = [];

  // Helper function to add a neighbor to the list.
  const addNeighbor = (tileIndex: number) => {
    const nextTiles = [...tiles];
    nextTiles[blankIndex] = nextTiles[tileIndex];
    nextTiles[tileIndex] = 0;
    neighbors.push({ size, tiles: nextTiles, blankIndex: tileIndex });
  };

  if (row > 0) addNeighbor(blankIndex - size);           // swap with the tile above
  if (row < size - 1) addNeighbor(blankIndex + size);  // swap with the tile below
  if (col > 0) addNeighbor(blankIndex - 1);            // swap with the tile left
  if (col < size - 1) addNeighbor(blankIndex + 1);     // swap with the tile right

  return neighbors;
}

/*
 * Applies a move to a puzzle state.
 * This will return a new puzzle state with the tile at the fromIndex swapped with the tile at the toIndex.
 * @param state - The puzzle state to apply the move to.
 * @param move - The move to apply.
 * @returns A new puzzle state with the move applied.
 */
export function applyMove(_state: PuzzleState, _move: PuzzleMove): PuzzleState {
  // Note for Broudy: Remove the underscore for _state and _move for the actual implementation. 
  // _ is used to indicate that the parameter is not used. 
  // So that it doesn't throw a warning from the TypeScript compiler.

  // Once done you can test the implementation with the following command:
  // bun run test:run -- tests/puzzle.test.ts -t applyMove
  throw new Error("Not implemented");
}

/*
 * Shuffles a puzzle by applying random legal moves from the input state.
 * Starting from a solved state always produces a solvable configuration.
 * @param state - The puzzle state to shuffle from (typically solved).
 * @param moves - The number of random moves to apply.
 * @returns A new shuffled puzzle state.
 */
export function shufflePuzzle(_state: PuzzleState, _moves: number): PuzzleState {
  // Note for Broudy: Remove the underscore for _state and _moves for the actual implementation. 
  // _ is used to indicate that the parameter is not used. 
  // So that it doesn't throw a warning from the TypeScript compiler.

  // Once done you can test the implementation with the following command:
  // bun run test:run -- tests/puzzle.test.ts -t shufflePuzzle
  throw new Error("Not implemented");
}

/*
 * Creates a puzzle state from a list of tiles.
 * Used by benchmarks/tests
 * @param size - The size of the puzzle.
 * @param tiles - The list of tiles to create the puzzle state from.
 * @returns A puzzle state with the given tiles and blank index.
 */
export function stateFromTiles(size: number, tiles: number[]): PuzzleState {
  return { size, tiles: [...tiles], blankIndex: tiles.indexOf(0) };
}
