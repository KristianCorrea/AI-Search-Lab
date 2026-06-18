import { TEST_PUZZLE, GOAL_PUZZLE } from "@/shared/constants";
import { stateFromTiles } from "@/modules/puzzle/board";
import { PUZZLE_SOLVERS } from "@/modules/puzzle/solvers";

console.log("Puzzle benchmark — standardized test puzzle\n");
console.log(`Start: [${TEST_PUZZLE.join(", ")}]`);
console.log(`Goal:  [${GOAL_PUZZLE.join(", ")}]\n`);

const state = stateFromTiles(3, [...TEST_PUZZLE]);

for (const [name, solver] of Object.entries(PUZZLE_SOLVERS)) {
  try {
    const result = solver(state);
    console.log(
      `${name.padEnd(10)} | nodes: ${result.nodesExpanded} | moves: ${result.moves.length} | time: ${result.elapsedMs.toFixed(1)}ms`,
    );
  } catch (e) {
    console.log(`${name.padEnd(10)} | not implemented`);
  }
}
