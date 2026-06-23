import { EMPTY_BOARD } from "@/shared/constants";
import { findBestMoveMinimax, findBestMoveAlphaBeta } from "@/modules/tictactoe/ai";

// RUN WITH (had some issues but this worked for me):
//  npx tsx --tsconfig tsconfig.app.json scripts/BenchmarkTicTacToe.ts

console.log("Tic-Tac-Toe benchmark — empty board, X plays first\n");

const results: Record<string, any> = {}; // Store results for each Search Algorithm

const algorithms = {
  Minimax: findBestMoveMinimax,
  "Alpha-Beta": findBestMoveAlphaBeta
};

for (const [name, solver] of Object.entries(algorithms)) {
  try {
    const start = performance.now()             // Start performance metrics recording
    const result = solver(EMPTY_BOARD, "X");    // Get specific metrics of algorithm
    const elapsed = performance.now() - start;  // Get time since start

    // Store results of that algorithm
    results[name] = {
      nodes: result.nodesVisited,       // Num nodes visited
      depth: result.depth,              // Total depth explored (9 spots for move = 9 depth)
      score: result.score,              // Get the score for the game (0 means)
      time: elapsed,                    // Length of time from start to finish
      nodesPruned: result.nodesPruned,  // ONLY A-B; How many nodes were pruned
      pruningRate: result.pruningRate,  // ONLY A-B; Ratio of nodes compared to Minimax
    };

    let info = 
      `${name.padEnd(10)} | ` +
      `Nodes: ${result.nodesVisited} | ` + 
      `Depth: ${result.depth} | ` +
      `Score: ${result.score} | ` +
      `time: ${result.elapsedMs ? result.elapsedMs.toFixed(1) : 0} ms | `;

    if (name == "Alpha-Beta") {
      info += 
        `Nodes Pruned: ${result.nodesPruned} | ` +
        `Pruning Rate: ${result.pruningRate}`;
    }

    // Output each Algorithm's information
    console.log(info);

  } catch (e) {
    // If algorithm isn't fully implemented yet
    console.log(`${name.padEnd(10)} | not implemented`);
  }
}
