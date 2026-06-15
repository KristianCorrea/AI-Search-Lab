# Implementation Roadmap

> Glance here, pick an unchecked task, follow the steps, check it off.
> Tasks are ordered by dependency: do earlier phases before later ones.
> Try to do them in order. Each task lists the file(s), the steps,
> and a "Done when" check so you know it's actually finished.

## How to read this

- **File:** exact path to edit.
- **Steps:** what to write, in order.
- **Done when:** the objective test that proves the task is complete.
- A task is only done when its tests pass (`bun test:run`) AND TypeScript builds (`bun run build`).

## The golden rule

Algorithms are pure functions. Build and test them with NO UI first. The UI only
ever reads the shared return types (`SolverResult`, `MoveResult`), so if your
function returns the right shape, the UI is guaranteed to accept it.

---

# Phase 0 — Shared Setup (do once, first)

### 0.1 Confirm the test + build loop works

- Run `bun test:run` — should report todo stubs, no errors.
- Run `bun run build` — should compile clean.
- **Done when:** both commands succeed before you change anything.

### 0.2 Add standardized test constants

- **File:** create `src/shared/constants/benchmarks.ts`
- **Steps:**
  1. Export the Module A puzzle as a flat array:
     `export const TEST_PUZZLE = [8, 1, 3, 4, 0, 2, 7, 6, 5];` (optimal depth 14)
  2. Export the goal: `export const GOAL_PUZZLE = [1, 2, 3, 4, 5, 6, 7, 8, 0];`
  3. Export the Module B start: `export const EMPTY_BOARD = Array(9).fill(null);`
- **Done when:** both modules and the benchmark scripts import these instead of hardcoding.

---

# Phase 1 — Puzzle Foundation (Module A core)

> These are dependencies for the solvers. Build them first or the solvers can't work.

### 1.1 Board helpers

- **File:** `src/modules/puzzle/utils/boardHelpers.ts`
- **Already done:** `createSolvedState`, `statesEqual`.
- **Steps:**
  1. Implement `getNeighbors(state)`: find `blankIndex`, compute valid up/down/left/right swaps (respect 3-wide grid edges), return a new `PuzzleState` for each legal swap.
  2. Implement `applyMove(state, move)`: swap `tiles[move.fromIndex]` and `tiles[move.toIndex]`, return a new state with updated `blankIndex`. Do NOT mutate the input.
  3. Add a helper `isGoal(state)` comparing against the solved state (or reuse `statesEqual`).
- **Done when:** `getNeighbors` on `[1,2,3,4,5,6,7,8,0]` returns exactly 2 neighbors (blank in corner); on a center-blank board returns 4.

### 1.2 Solvability

- **File:** `src/modules/puzzle/utils/solvability.ts`
- **Steps:**
  1. Implement `isSolvable(state)`: count inversions (pairs out of order, ignoring the blank `0`).
  2. For a 3x3 (odd width): solvable iff inversion count is even.
- **Done when:** the standard test puzzle `[8,1,3,4,0,2,7,6,5]` returns `true`; a known-unsolvable board (swap two tiles of a solved board) returns `false`.

### 1.3 Priority queue

- **File:** `src/modules/puzzle/algorithms/priorityQueue.ts`
- **Steps:**
  1. Implement a binary min-heap backed by the existing `items` array.
  2. `enqueue(value, priority)`: push then sift-up.
  3. `dequeue()`: swap root with last, pop, sift-down, return old root's value.
  4. `peek()`: return `items[0]?.value`.
- **Done when:** enqueue 5,1,3 with those priorities, dequeue three times → values come out in priority order 1,3,5.

### 1.4 Heuristics

- **File:** `src/modules/puzzle/algorithms/heuristics.ts`
- **Steps:**
  1. `manhattanDistance(state)`: for each non-blank tile, sum `|row - goalRow| + |col - goalCol|`.
  2. `misplacedTiles(state)`: count non-blank tiles not in their goal position.
- **Done when:** `manhattanDistance` on the solved board returns `0`; on the test puzzle returns a positive number; tests pass in `tests/puzzle/heuristic.test.ts`.

### 1.5 Serialization (visited-set keys)

- **File:** `src/modules/puzzle/utils/serialization.ts`
- **Already done:** `serializeState`, `deserializeState`.
- **Steps:** confirm `serializeState` produces a stable string usable as a `Set`/`Map` key for visited states.
- **Done when:** two equal states serialize to the same string; the round-trip `deserialize(serialize(s))` equals `s`.

---

# Phase 2 — Puzzle Solvers (Module A algorithms, 25 pts)

> All three return the SAME `SolverResult` shape. Build a shared "reconstruct path"
> helper so each solver tracks parent pointers and rebuilds the move list at the end.
> Every solver MUST increment `nodesExpanded` each time it pops/expands a state.

### 2.1 BFS (blind search)

- **File:** `src/modules/puzzle/algorithms/bfs.ts`
- **Steps:**
  1. Start a timer (use `createTimer()` from `shared/utils/timer.ts`).
  2. Queue of states; visited `Set` keyed by `serializeState`.
  3. Track parent + move for each state to reconstruct the path.
  4. On pop, increment `nodesExpanded`; if goal, reconstruct `moves` and return.
  5. Track `maxFrontierSize` (largest queue size seen).
  6. Return a full `SolverResult` with `solved`, `moves`, `nodesExpanded`, `maxFrontierSize`, `elapsedMs`, `finalState`.
- **Done when:** solved board → `moves.length === 0`; test puzzle → `solved === true`, `moves.length === 14`, `nodesExpanded` in the thousands. `tests/puzzle/bfs.test.ts` passes.

### 2.2 Dijkstra

- **File:** `src/modules/puzzle/algorithms/dijkstra.ts`
- **Steps:**
  1. Same structure as BFS but use the `PriorityQueue` with cumulative path cost `g` as priority.
  2. Each move costs 1, so behavior mirrors BFS — that's expected and intentional.
  3. Track `nodesExpanded` and `maxFrontierSize`.
- **Done when:** test puzzle → `moves.length === 14`, `nodesExpanded` in the thousands (comparable to BFS). `tests/puzzle/dijkstra.test.ts` passes.

### 2.3 A*

- **File:** `src/modules/puzzle/algorithms/astar.ts`
- **Steps:**
  1. Same as Dijkstra but priority = `g + manhattanDistance(state)`.
  2. Track `nodesExpanded` and `maxFrontierSize`.
- **Done when:** test puzzle → `moves.length === 14` (still optimal), `nodesExpanded` in the tens-to-low-hundreds (much smaller than BFS/Dijkstra). `tests/puzzle/astar.test.ts` passes.

### 2.4 Solver dispatch map

- **File:** `src/modules/puzzle/algorithms/` (add an `index.ts` or map inside the hook)
- **Steps:** create `{ bfs: solveBfs, dijkstra: solveDijkstra, astar: solveAstar }` keyed by `PuzzleAlgorithmId`.
- **Done when:** given an algorithm id, you can call the right solver with one lookup.

---

# Phase 3 — Tic-Tac-Toe Foundation + Algorithms (Module B core, 25 pts)

### 3.1 Winner detection

- **File:** `src/modules/tictactoe/utils/winnerDetection.ts`
- **Steps:**
  1. `findWinner(board)`: check the 8 win lines (already listed in the file), return `"X"`, `"O"`, or `null`.
  2. `getGameStatus(board)`: `"won"` if a winner exists; `"draw"` if board full and no winner; else `"playing"`.
  3. `getWinningLine(board)`: return the indices of the winning triple, or `null`.
- **Done when:** all three pass `tests/tictactoe/winnerDetection.test.ts` (row, column, diagonal win + full-board draw).

### 3.2 Board helpers

- **File:** `src/modules/tictactoe/utils/boardHelpers.ts`
- **Already done:** `createEmptyBoard`, `createInitialGameState`, `getAvailableMoves`, `switchPlayer`.
- **Steps:** implement `applyMove(board, move)` — return a NEW board with `board[move.index] = move.player`. Do not mutate.
- **Done when:** applying a move to an empty board places the symbol and leaves the original board unchanged.

### 3.3 Evaluation

- **File:** `src/modules/tictactoe/algorithms/evaluation.ts`
- **Steps:** `evaluateBoard(board, player)`: `+10` if `player` won, `-10` if opponent won, `0` otherwise (draw or non-terminal).
- **Done when:** winning board for `player` → `+10`; opponent win → `-10`; passes `tests/tictactoe/evaluation.test.ts`.

### 3.4 Minimax

- **File:** `src/modules/tictactoe/algorithms/minimax.ts`
- **Steps:**
  1. Recursive minimax over `getAvailableMoves`, alternating maximizing (`player`) and minimizing (opponent).
  2. Use depth in the score (`score - depth` for wins, `score + depth` for losses) so it prefers faster wins / slower losses.
  3. Count every node visited into `nodesVisited`.
  4. Return a `MoveResult` (best `move`, `score`, `nodesVisited`, `depth`).
- **Done when:** on a board with an immediate win, it takes the win; on a board where the opponent threatens a win, it blocks. Empty board first move reports `nodesVisited` (expect a few hundred thousand for full minimax — note the exact number for the report). `tests/tictactoe/minimax.test.ts` passes.

### 3.5 Alpha-Beta

- **File:** `src/modules/tictactoe/algorithms/alphaBeta.ts`
- **Steps:**
  1. Copy minimax structure; add `alpha` and `beta` parameters.
  2. Prune when `beta <= alpha`.
  3. Count `nodesVisited` the same way so it's comparable to minimax.
- **Done when:** on the empty board it returns the SAME move as minimax but with strictly fewer `nodesVisited`. `tests/tictactoe/alphaBeta.test.ts` passes.

> NOTE: Phase 4 (pruning metric) depends on having both 3.4 and 3.5 done.

---

# Phase 4 — Metrics & Contract Extensions

> Do these as soon as the algorithms exist, BEFORE building the dashboards,
> so the UI has real fields to display.

### 4.1 Extend MoveResult for pruning

- **File:** `src/modules/tictactoe/types/move.ts`
- **Steps:** add optional fields: `nodesPruned?: number;`, `pruningRate?: number;`, `elapsedMs?: number;`.
- **Done when:** TypeScript still builds and alpha-beta can populate them.

### 4.2 Compute pruning rate

- **File:** wherever you dispatch the AI move (hook or a small service)
- **Steps:**
  1. Run minimax to get `minimaxNodes` (baseline).
  2. Run alpha-beta to get `alphaBetaNodes`.
  3. `pruningRate = (minimaxNodes - alphaBetaNodes) / minimaxNodes`.
- **Done when:** on the empty board you get a real percentage (report it honestly — it varies with move ordering).

### 4.3 Wire timer into all algorithms

- **File:** all solvers + AI move functions
- **Steps:** wrap each with `createTimer()` and set `elapsedMs` on the result.
- **Done when:** every `SolverResult` / `MoveResult` carries a real `elapsedMs`.

---

# Phase 5 — Benchmarks (report evidence)

### 5.1 Puzzle benchmark

- **File:** `scripts/benchmarkPuzzle.ts`
- **Steps:**
  1. Import `TEST_PUZZLE` from the benchmarks constants.
  2. Build the `PuzzleState`, run all three solvers.
  3. Print a table: algorithm | nodesExpanded | moves.length | elapsedMs.
- **Done when:** `bun run benchmark:puzzle` prints real numbers matching the sanity checks (BFS/Dijkstra thousands, A* tens-to-hundreds, all depth 14).

### 5.2 Tic-Tac-Toe benchmark

- **File:** `scripts/benchmarkTicTacToe.ts`
- **Steps:**
  1. Start from `EMPTY_BOARD`, AI as X.
  2. Run minimax and alpha-beta for the FIRST move only.
  3. Print nodesVisited for each + the computed pruning rate.
- **Done when:** `bun run benchmark:tictactoe` prints minimax vs alpha-beta node counts and pruning %.

---

# Phase 6 — Module A UI Wiring (10 pts)

### 6.1 Solve dispatch in the hook

- **File:** `src/modules/puzzle/hooks/usePuzzle.ts`
- **Steps:** replace the `// TODO: dispatch to selected solver` with a lookup into the Phase 2.4 map, store the returned `SolverResult` in `lastResult`.
- **Done when:** picking an algorithm and clicking Solve populates the metrics cards with real numbers.

### 6.2 Shuffle (solvable)

- **File:** `src/modules/puzzle/services/puzzleGenerator.ts` + hook
- **Steps:**
  1. Implement `shufflePuzzle(state, moves)`: apply N random legal moves from the solved state (guarantees solvability).
  2. Implement `generatePuzzle(config)` using it.
  3. Wire `shuffle()` in the hook to set the new state.
- **Done when:** Shuffle produces a scrambled but always-solvable board; manual + solve still work on it.

### 6.3 Manual play

- **File:** `src/modules/puzzle/hooks/usePuzzle.ts` (+ `PuzzleBoard` already passes `onTileClick`)
- **Steps:**
  1. Add a `playTile(index)` action: if the tile is adjacent to the blank, swap it; otherwise ignore.
  2. Expose `playTile` in the return and pass it to `PuzzleBoard`.
- **Done when:** clicking a tile next to the blank slides it; clicking a non-adjacent tile does nothing.

### 6.4 Image upload + slicing

- **File:** `src/modules/puzzle/services/imageSlicer.ts` + `handleImageDrop` in hook
- **Steps:**
  1. Implement `sliceImage(file, gridSize)`: load the file into an `Image`, draw to a canvas, center-crop to a square, slice into `gridSize x gridSize` tiles, return `dataUrl`s in `SliceResult`.
  2. In `handleImageDrop`, call it and store the tile images in `tileImages` (the blank tile shows nothing).
- **Done when:** dropping a .jpg/.png shows the photo split across the tiles; the default numbered puzzle still works without an upload.

### 6.5 Step-by-step solve animation

- **File:** `src/modules/puzzle/services/puzzleAnimator.ts` + hook
- **Steps:**
  1. Implement `buildAnimationSequence(initial, moves, stepDelayMs)` returning frames.
  2. Add hook state: `isAnimating`, current step; a `playSolution()` that advances frames on a timer (use the existing Framer Motion `layout` on tiles for smooth movement).
- **Done when:** after Solve, the board animates one move at a time to the goal.

---

# Phase 7 — Module B UI Wiring + Game Modes (10 pts)

### 7.1 Game manager

- **File:** `src/modules/tictactoe/services/gameManager.ts`
- **Steps:** implement `makeMove(move)`: validate the cell is empty, apply it, update winner/status/currentPlayer, return new `GameState`.
- **Done when:** a sequence of moves produces correct turn switching and detects a win/draw.

### 7.2 Extend the hook for modes

- **File:** `src/modules/tictactoe/hooks/useTicTacToe.ts`
- **Steps:** add state for `gameMode: "human-vs-ai" | "ai-vs-ai"`, `humanPlayer`, `humanGoesFirst`, and `algorithmX` / `algorithmO`.
- **Done when:** the page can toggle modes and the hook tracks who is human and which algorithm each side uses.

### 7.3 Human vs AI

- **File:** hook + `src/app/tictactoe/page.tsx`
- **Steps:**
  1. `playMove(index)` applies the human move via the game manager.
  2. After the human moves, trigger the AI move using the selected algorithm; store its `MoveResult`.
  3. Add a control to choose play first / second.
- **Done when:** a human can play a full game vs the AI; AI never loses (it should win or draw).

### 7.4 AI vs AI autoplay

- **File:** `src/modules/tictactoe/services/autoplay.ts` + page
- **Steps:**
  1. Implement `runAutoplay` OR a step-driven loop in the hook that alternates `algorithmX` / `algorithmO`.
  2. Visualize each move with a delay so the grader sees step-by-step progression.
  3. Show the final outcome (expected: draw on optimal vs optimal).
- **Done when:** AI vs AI plays automatically, shows each move, and reports the result.

### 7.5 Controls

- **File:** page + existing `GameControls`
- **Steps:** restart, switch algorithm, switch mode; optional pause/resume/speed for autoplay.
- **Done when:** all controls work without reloading the page.

---

# Phase 8 — Unified Dashboard (10 pts)

### 8.1 Puzzle metrics live

- **File:** `src/modules/puzzle/components/PuzzleMetrics.tsx` (already reads `SolverResult`)
- **Steps:** confirm it shows Decision Time, Nodes Expanded, Solution Length from the real result.
- **Done when:** numbers update after each solve.

### 8.2 Game metrics live + pruning

- **File:** `src/modules/tictactoe/components/GameMetrics.tsx`
- **Steps:** display Decision Time, Nodes Visited, and Pruning Rate (alpha-beta only) from the extended `MoveResult`.
- **Done when:** the pruning rate shows a real percentage for alpha-beta moves.

### 8.3 Shared component (bonus)

- **File:** `src/shared/components/MetricCard.tsx` (already shared)
- **Steps:** ensure both modules render their metrics through the same `MetricCard` for side-by-side comparability.
- **Done when:** both dashboards visibly use the same card component.

---

# Phase 9 — Tests (extra credit, ≥3 per algorithm)

- **Files:** `tests/puzzle/*.test.ts`, `tests/tictactoe/*.test.ts`
- **Steps:** replace each `it.todo` with real assertions (see the "Done when" checks above for inputs/outputs).
  - BFS/Dijkstra/A*: solved→0 moves, one-move puzzle→1 move, standard puzzle→14 moves + node-count range.
  - Heuristic: 0 on solved, positive on scrambled, admissibility spot-check.
  - Solvability: solvable true, unsolvable false, edge case.
  - Minimax: take win, block win, center/optimal on empty.
  - Alpha-Beta: same move as minimax, fewer nodes, pruning > 0.
  - Winner detection: row, column, diagonal, draw.
- **Done when:** `bun test:run` shows all tests passing (no todos) — ≥3 per algorithm.

---

# Phase 10 — Report, Screenshots, README (15 + 5 pts)

### 10.1 Capture dashboard screenshots

- **Files:** `docs/screenshots/puzzle-dashboard.png`, `tictactoe-dashboard.png`, `comparison-results.png`
- **Steps:** run the app, solve the standard puzzle, run the standard first move, screenshot the dashboards showing real numbers.
- **Done when:** screenshots clearly show the metrics used in the report.

### 10.2 Comparative Analysis

- **File:** `docs/comparative-analysis.md` (then fold into README or export PDF)
- **Steps:** answer all 5 prompts with YOUR numbers + the heuristic admissibility paragraph. Include at least one surprising observation.
- **Done when:** ~500-800 words, all prompts addressed, numbers match the screenshots.

### 10.3 README sections

- **File:** `README.md`
- **Steps:** ensure Overview / How to Run / Architecture / Algorithms Implemented / Credits all exist; remove the "stubbed" note once implemented.
- **Done when:** a grader can run and understand the project from the README alone.

### 10.4 Deployability

- **File:** create `run.sh` at the project root
- **Steps:** one command: `bun install && bun run build && bun run start` (document expected startup time).
- **Done when:** a fresh clone runs with one command in under 5 minutes.

---

# Final Submission Checklist

- [ ] All algorithms implemented and passing tests
- [ ] Both modules reachable from the landing page
- [ ] Image upload + default puzzle + shuffle + manual play + step-by-step solve
- [ ] Human vs AI + AI vs AI with step visualization
- [ ] Dashboard shows time, nodes, solution length, pruning rate
- [ ] Benchmarks produce the standardized numbers
- [ ] Comparative Analysis written with screenshots
- [ ] README complete + `run.sh` works
- [ ] Zip as `Group{N}_HW1.zip`, teammates listed in Canvas comment
