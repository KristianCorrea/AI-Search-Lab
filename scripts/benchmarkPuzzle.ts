import { TEST_PUZZLE, GOAL_PUZZLE } from "@/shared/constants";
import { stateFromTiles } from "@/modules/puzzle/board";
import { PUZZLE_SOLVERS } from "@/modules/puzzle/solvers";

// RUN WITH (had some issues but this worked for me):
//  npx tsx --tsconfig tsconfig.app.json scripts/BenchmarkPuzzle.ts

console.log("Puzzle benchmark — standardized test puzzle\n");
console.log(`Start: [${TEST_PUZZLE.join(", ")}]`);
console.log(`Goal:  [${GOAL_PUZZLE.join(", ")}]\n`);

const state = stateFromTiles(3, [...TEST_PUZZLE]); // Get the test puzzle

const results: Record<string, any> = {}; // Store results for each Search Algorithm

for (const [name, solver] of Object.entries(PUZZLE_SOLVERS)) {
  try {
    const start = performance.now()             // Start performance metrics recording
    const result = solver(state);               // Get specific metrics of algorithm
    const elapsed = performance.now() - start;  // Get time since start

    // Store results of that algorithm
    results[name] = {
      nodes: result.nodesExpanded,  // Num nodes explored
      moves: result.moves.length,   // Num moves to reach goal
      time: elapsed                 // Length of time from start to finish
    };

    // Output each Algorithm's information
    console.log(
      `${name.padEnd(10)} | nodes: ${result.nodesExpanded} | moves: ${result.moves.length} | time: ${result.elapsedMs.toFixed(1)}ms`,
    );
  } catch (e) {

    // If algorithm isn't fully implemented yet
    console.log(`${name.padEnd(10)} | not implemented`);
  }
}