import type { NeighborResult, PuzzleMove, PuzzleState } from "@/modules/puzzle/types";

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
 * Applies a move to a puzzle state.
 * This will return a new puzzle state with the tile at the fromIndex swapped with the tile at the toIndex.
 * @param state - The puzzle state to apply the move to.
 * @param move - The move to apply.
 * @returns A new puzzle state with the move applied.
 */
export function applyMove(state: PuzzleState, move: PuzzleMove): PuzzleState {

  // Create local copy to work with
  const tiles = [...state.tiles];

  // Swaps the positions
  [tiles[move.fromIndex], tiles[move.toIndex]] = [tiles[move.toIndex], tiles[move.fromIndex]];

  // Store and update blank index if involved in then swap
  let blankIndex = state.blankIndex;
  if (state.blankIndex === move.fromIndex) {
    blankIndex = move.toIndex;
  } else if (state.blankIndex === move.toIndex) {
    blankIndex = move.fromIndex;
  }

  // Return new state size, tile positions, and where blank index is
  return { size: state.size, tiles, blankIndex }
}

/*
 * Gets the neighbors of a puzzle state.
 * Returns each legal blank swap as a move and the resulting state (for search + UI replay).
 * @param state - The puzzle state to get the neighbors of.
 * @returns An array of move/state pairs reachable in one legal move.
 */
export function getNeighbors(state: PuzzleState): NeighborResult[] {
  const { size, blankIndex } = state;
  const row = Math.floor(blankIndex / size); // Get the row of the blank index
  const col = blankIndex % size; // Get the column of the blank index
  const neighbors: NeighborResult[] = []; // Initialize empty array for neighbors

  const addNeighbor = (tileIndex: number, direction: PuzzleMove["direction"]) => {
    const move: PuzzleMove = { fromIndex: tileIndex, toIndex: blankIndex, direction };
    neighbors.push({ move, state: applyMove(state, move) });
  };

  if (row > 0) addNeighbor(blankIndex - size, "down"); // Add neighbor if not on top row
  if (row < size - 1) addNeighbor(blankIndex + size, "up"); // Add neighbor if not on bottom row
  if (col > 0) addNeighbor(blankIndex - 1, "right"); // Add neighbor if not on left column
  if (col < size - 1) addNeighbor(blankIndex + 1, "left"); // Add neighbor if not on right column

  return neighbors;
}

/*
 * Shuffles a puzzle by applying random legal moves from the input state.
 * Starting from a solved state always produces a solvable configuration.
 * @param state - The puzzle state to shuffle from (typically solved).
 * @param moves - The number of random moves to apply.
 * @returns A new shuffled puzzle state.
 */
export function shufflePuzzle(state: PuzzleState, moves: number): PuzzleState {
  
  // Create local copy to work with
  let current = state;
  
  // Iterate for listed number of moves (skips if 0)
  for (let i = 0; i < moves; i++) {
    const neighbors = getNeighbors(current); // Gets list of neighbors

    // If no valid neighbors then quit
    if (neighbors.length === 0) {
      break;
    }

    // Get a neighbor using a random index selection
    const randomIndex = Math.floor(Math.random() * neighbors.length);
    current = neighbors[randomIndex].state;
  }

  return current;
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
