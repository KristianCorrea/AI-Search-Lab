# Implementation Roadmap

> Glance here, pick a task, follow the steps, check it off.
> Dev server: `bun dev` → http://localhost:5173

## How to read this

- **File:** exact path to edit.
- **Steps:** what to write, in order.
- **Done when:** the objective test that proves the task is complete.
- A task is only done when its tests pass (`bun test:run`) AND TypeScript builds (`bun run build`).

## Project layout

```
src/
├── pages/          Home.tsx, Puzzle.tsx, TicTacToe.tsx
├── shared/         Layout.tsx, MetricCard.tsx, constants.ts, metrics.ts
└── modules/
    ├── puzzle/     types.ts, board.ts, PriorityQueue.ts, solvers.ts, image.ts
    └── tictactoe/  types.ts, game.ts, ai.ts, autoplay.ts
```

## The golden rule

Algorithms are pure functions. Build and test them with NO UI first. The UI only
ever reads the shared return types (`SolverResult`, `MoveResult`), so if your
function returns the right shape, the UI is guaranteed to accept it.

---

# Phase 0 — Shared Setup (do once, first)

### 0.1 Confirm the test + build loop works

- Run `bun test:run` — should report todo stubs, no errors.
- Run `bun run build` — should compile clean.
- **Done when:** both commands succeed.

### 0.2 Standardized test constants

- **File:** `src/shared/constants.ts`
- **Already done:** `TEST_PUZZLE`, `GOAL_PUZZLE`, `EMPTY_BOARD`.
- **Done when:** benchmark scripts import from this file.

---

# Phase 1 — Puzzle Foundation (Module A core)

### 1.1 Board helpers

- **File:** `src/modules/puzzle/board.ts`
- **Already done:** `createSolvedState`, `statesEqual`, `serializeState`, `deserializeState`, `stateFromTiles`.
- **Steps:**
  1. Implement `getNeighbors(state)`: find `blankIndex`, compute valid up/down/left/right swaps, return new `PuzzleState` for each legal swap.
  2. Implement `applyMove(state, move)`: swap tiles, return new state with updated `blankIndex`. Do NOT mutate the input.
  3. Implement `shufflePuzzle(state, moves)`: apply random legal moves from input state (typically solved).
- **Done when:** `getNeighbors` on solved board returns 2 neighbors (corner blank); shuffle from solved always scrambles the board.

### 1.2 Priority queue + heuristics

- **File:** `src/modules/puzzle/solvers.ts`
- **File:** `src/modules/puzzle/PriorityQueue.ts`
- **Steps:**
  1. Implement `PriorityQueue` min-heap: `enqueue`, `dequeue`, `peek`.
  2. `manhattanDistance(state)`: sum of tile distances to goal positions.
  3. `misplacedTiles(state)`: count tiles not in goal position (excluding blank).
- **Done when:** priority queue returns items in priority order; Manhattan is 0 on solved board.

---

# Phase 2 — Puzzle Solvers (Module A algorithms, 25 pts)

> All three return `SolverResult`. Track `nodesExpanded` on every pop/expand.
> `PUZZLE_SOLVERS` dispatch map already exists in `solvers.ts`.

### 2.1 BFS (blind search)

- **File:** `src/modules/puzzle/solvers.ts` — `solveBfs`
- **Steps:**
  1. Timer via `createTimer()` from `src/shared/metrics.ts`.
  2. Queue + visited `Set` keyed by `serializeState`.
  3. Parent pointers to reconstruct path; track `maxFrontierSize`.
- **Done when:** solved board → 0 moves; test puzzle → 14 moves, thousands of nodes expanded. `tests/puzzle.test.ts` passes.

### 2.2 Dijkstra

- **File:** `src/modules/puzzle/solvers.ts` — `solveDijkstra`
- **Steps:** Same as BFS but `PriorityQueue` with cumulative cost `g` as priority.
- **Done when:** test puzzle → 14 moves, node count comparable to BFS.

### 2.3 A*

- **File:** `src/modules/puzzle/solvers.ts` — `solveAstar`
- **Steps:** Priority = `g + manhattanDistance(state)`.
- **Done when:** test puzzle → 14 moves, nodes in tens-to-low-hundreds.

---

# Phase 3 — Tic-Tac-Toe Foundation + Algorithms (Module B core, 25 pts)

### 3.1 Game logic

- **File:** `src/modules/tictactoe/game.ts`
- **Already done:** `createEmptyBoard`, `createInitialGameState`, `getAvailableMoves`, `switchPlayer`, `WIN_LINES`, `GameManager` stub.
- **Steps:**
  1. `applyMove(board, move)` — return new board, no mutation.
  2. `findWinner`, `getGameStatus`, `getWinningLine` using `WIN_LINES`.
  3. `GameManager.makeMove` — validate, apply, update status/turn.
- **Done when:** wins and draws detected correctly. `tests/tictactoe.test.ts` passes winner tests.

### 3.2 Minimax + Alpha-Beta

- **File:** `src/modules/tictactoe/ai.ts`
- **Steps:**
  1. `evaluateBoard`: +10 win, -10 loss, 0 draw/non-terminal.
  2. `findBestMoveMinimax`: recursive search, depth-weighted scores, count `nodesVisited`.
  3. `findBestMoveAlphaBeta`: same move as minimax, fewer nodes, track pruning rate.
- **Done when:** blocks threats, takes wins; alpha-beta matches minimax move on empty board.

---

# Phase 4 — Metrics & Contract Extensions

### 4.1 MoveResult pruning fields

- **File:** `src/modules/tictactoe/types.ts`
- **Already done:** `nodesPruned`, `pruningRate`, `elapsedMs` optional fields.
- **Done when:** alpha-beta populates them.

### 4.2 Compute pruning rate

- **File:** `src/pages/TicTacToe.tsx` (or `ai.ts` helper)
- **Steps:** Run minimax baseline, then alpha-beta; `pruningRate = (minimaxNodes - alphaBetaNodes) / minimaxNodes`.
- **Done when:** real percentage on empty-board first move.

### 4.3 Wire timer into all algorithms

- **File:** solvers + ai functions
- **Steps:** wrap with `createTimer()`, set `elapsedMs` on results.
- **Done when:** dashboard shows real timing.

---

# Phase 5 — Benchmarks (report evidence)

### 5.1 Puzzle benchmark

- **File:** `scripts/benchmarkPuzzle.ts`
- **Steps:** Import `TEST_PUZZLE`, run all solvers via `PUZZLE_SOLVERS`, print table.
- **Done when:** `bun run benchmark:puzzle` prints real numbers (BFS/Dijkstra thousands, A* tens-to-hundreds, depth 14).

### 5.2 Tic-Tac-Toe benchmark

- **File:** `scripts/benchmarkTicTacToe.ts`
- **Steps:** `EMPTY_BOARD`, X first move only, minimax vs alpha-beta + pruning %.
- **Done when:** `bun run benchmark:tictactoe` prints comparable node counts.

---

# Phase 6 — Module A UI Wiring (10 pts)

### 6.1 Solve dispatch

- **File:** `src/pages/Puzzle.tsx`
- **Already wired:** `PUZZLE_SOLVERS[algorithm](state)` on Solve click.
- **Done when:** metrics cards show real numbers after solve.

### 6.2 Shuffle

- **File:** `src/modules/puzzle/board.ts` + `Puzzle.tsx`
- **Steps:** implement `shufflePuzzle`, wire `shuffle()` handler.
- **Done when:** always produces a solvable scrambled board.

### 6.3 Manual play

- **File:** `src/pages/Puzzle.tsx`
- **Steps:** `playTile(index)` — swap if adjacent to blank; pass to board `onTileClick`.
- **Done when:** clicking adjacent tiles slides them.

### 6.4 Image upload

- **File:** `src/modules/puzzle/image.ts` + `Puzzle.tsx`
- **Steps:** implement `sliceImage`, wire `handleImageDrop` to set tile images.
- **Done when:** .jpg/.png splits across tiles.

### 6.5 Step-by-step solve animation

- **File:** `src/pages/Puzzle.tsx`
- **Steps:** after solve, animate moves one at a time with Framer Motion `layout`.
- **Done when:** board plays back the solution path.

---

# Phase 7 — Module B UI Wiring + Game Modes (10 pts)

### 7.1 Human vs AI

- **File:** `src/pages/TicTacToe.tsx`
- **Steps:** `playMove` via `GameManager`; auto-trigger AI after human move; first/second choice.
- **Done when:** full game playable vs AI.

### 7.2 AI vs AI autoplay

- **File:** `src/modules/tictactoe/autoplay.ts` + `TicTacToe.tsx`
- **Steps:** step-driven loop, algorithm pick per side, delay between moves, show outcome.
- **Done when:** autoplay visualizes each move (draw on optimal vs optimal is expected).

### 7.3 Controls

- **File:** `src/pages/TicTacToe.tsx`
- **Steps:** restart, mode toggle, algorithm select; optional pause/speed for autoplay.
- **Done when:** all controls work without page reload.

---

# Phase 8 — Unified Dashboard (10 pts)

### 8.1 Puzzle metrics

- **File:** `src/pages/Puzzle.tsx` + `src/shared/MetricCard.tsx`
- **Done when:** time, nodes expanded, solution length update after solve.

### 8.2 Game metrics + pruning

- **File:** `src/pages/TicTacToe.tsx`
- **Done when:** time, nodes visited, pruning rate (alpha-beta) display real values.

---

# Phase 9 — Tests (extra credit, ≥3 per algorithm)

- **Files:** `tests/puzzle.test.ts`, `tests/tictactoe.test.ts`
- **Done when:** all `it.todo` replaced with passing assertions — ≥3 per algorithm.

---

# Phase 10 — Report, Screenshots, README (15 + 5 pts)

### 10.1 Screenshots

- **Files:** `docs/screenshots/*.png`
- **Done when:** dashboards show real benchmark numbers.

### 10.2 Comparative Analysis

- **File:** `docs/comparative-analysis.md`
- **Done when:** all 5 prompts + heuristic justification, ~500–800 words.

### 10.3 README

- **File:** `README.md`
- **Done when:** Overview / How to Run / Architecture / Algorithms / Credits complete.

### 10.4 Deployability

- **File:** `run.sh` (already present)
- **Done when:** `./run.sh` starts dev server; `bun run build && bun run preview` serves production build.

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
