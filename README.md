# AI Search Lab

Interactive web application for comparing uninformed search, informed search, and adversarial game-tree algorithms. Built for FIU Summer 2026 Artificial Intelligence (Prof. Xian Su).

**Kristian Correa & Broudy Negron**

---

## For Graders — Start Here

**Recommended:** Open the live deployment — no install or build required.

**[https://ai-search-lab-five.vercel.app/](https://ai-search-lab-five.vercel.app/)**

From the dashboard, use the navbar to open **Puzzle** or **Tic-Tac-Toe**. All algorithms, metrics, and game modes are available in the browser.

### Quick feature walkthrough


| Module             | Route        | What to try                                                                                                                                                                                                                         |
| ------------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sliding Puzzle** | `/puzzle`    | Click **Load benchmark puzzle** → pick BFS / Dijkstra / A* → **Solve Puzzle**. Metrics show time, nodes expanded, and solution length. Also: shuffle, manual play, image upload, step-by-step replay.                               |
| **Tic-Tac-Toe**    | `/tictactoe` | **Human vs AI** — play as X or O; AI responds with chosen algorithm. **Human vs Human** — two players + live Minimax/Alpha-Beta advisory panel. **AI vs AI** — pick algorithms per side, start game, play/pause/step through moves. |


### Standardized benchmark inputs

Used in the Comparative Analysis Report and CLI benchmarks:

- **Module A:** start `[8,1,3,4,0,2,7,6,5]` — load via **Load benchmark puzzle** on the Puzzle page (optimal depth 14).
- **Module B:** empty board, X plays first — default in Human vs Human advisory, or Human vs AI with you playing as O.

### Comparative Analysis Report

 Five reflection prompts, heuristic justification, empirical numbers, and screenshots.

**[docs/comparative-analysis-report.pdf](docs/comparative-analysis-report.pdf)**

Supporting screenshots:

- `docs/screenshots/puzzle.jpg` — Module A dashboard metrics
- `docs/screenshots/tictactoe.jpeg` — Module B dashboard metrics
- `docs/screenshots/puzzle-cli.png` — CLI puzzle benchmark
- `docs/screenshots/tictactoe-cli.png` — CLI tic-tac-toe benchmark

---

## Overview

Two lab modules share a unified metrics dashboard (`MetricCard` components):

1. **Sliding Puzzle (Module A)** — 8-puzzle with BFS, Dijkstra, and A* (Manhattan heuristic).
2. **Tic-Tac-Toe AI (Module B)** — Minimax and Alpha-Beta pruning with Human vs AI, Human vs Human (extra credit), and AI vs AI modes.

---

## Algorithms Implemented

### Module A — Sliding Puzzle (`src/modules/puzzle/solvers.ts`)


| Algorithm    | Type         | Notes                                   |
| ------------ | ------------ | --------------------------------------- |
| **BFS**      | Uninformed   | Shortest path; expands level by level   |
| **Dijkstra** | Uniform-cost | Unit edge costs; equivalent to BFS here |
| **A***       | Informed     | Manhattan distance heuristic (default)  |


### Module B — Tic-Tac-Toe (`src/modules/tictactoe/ai.ts`)


| Algorithm      | Notes                                                                 |
| -------------- | --------------------------------------------------------------------- |
| **Minimax**    | Full game-tree search; optimal play                                   |
| **Alpha-Beta** | Minimax with branch pruning; reports pruning rate vs minimax baseline |


### Heuristic for A*

We use **Manhattan distance.** See the full report for additional discussion.

---

## Running Locally (optional)

Requires **Node.js 18+** (or Bun). Use this if you prefer to run from source instead of the live site.

```bash
# One-command launch (installs deps + dev server)
chmod +x run.sh
./run.sh
# → http://localhost:5173
```

Manual:

```bash
npm install    # or: bun install
npm run dev    # development
npm run build  # production build → dist/
npm run preview  # serve dist/ at http://localhost:4173
```

### Unit Tests & benchmarks

```bash
npm run test:run           # Vitest — puzzle + tic-tac-toe unit tests
npm run benchmark:puzzle   # standardized Module A puzzle (CLI)
npm run benchmark:tictactoe  # standardized Module B first move (CLI)
```

---

## Project Structure

```
ai-search-lab/
├── run.sh                          # One-command local launch
├── package.json                    # Dependencies & scripts
├── index.html                      # Vite entry
│
├── src/
│   ├── main.tsx                    # React bootstrap
│   ├── App.tsx                     # Router (/, /puzzle, /tictactoe)
│   ├── pages/
│   │   ├── Home.tsx                # Landing dashboard
│   │   ├── Puzzle.tsx              # Module A UI
│   │   └── tictactoe/
│   │       ├── TicTacToe.tsx        # Module B page shell
│   │       ├── useTicTacToeGame.ts  # Game state & mode logic
│   │       └── components/        # Board, metrics, mode tabs, advisory panel, …
│   ├── modules/
│   │   ├── puzzle/
│   │   │   ├── board.ts            # State, neighbors, shuffle, stateFromTiles
│   │   │   ├── solvers.ts          # BFS, Dijkstra, A*, heuristics
│   │   │   ├── image.ts            # Custom tile image slicing
│   │   │   ├── PriorityQueue.ts    # Frontier for search
│   │   │   └── types.ts
│   │   └── tictactoe/
│   │       ├── game.ts             # GameManager, win detection
│   │       ├── ai.ts               # Minimax, Alpha-Beta, evaluateBoard
│   │       ├── session.ts          # runAiSearch, analyzePosition
│   │       ├── autoplay.ts         # AI vs AI precomputation
│   │       └── types.ts
│   └── shared/
│       ├── Layout.tsx              # Navbar + page shell
│       ├── MetricCard.tsx          # Shared metrics UI (both modules)
│       ├── constants.ts            # Routes, algorithms, TEST_PUZZLE, EMPTY_BOARD
│       └── metrics.ts              # formatMs, formatCount helpers
│
├── tests/
│   ├── puzzle.test.ts              # Solvers, heuristics, board ops
│   └── tictactoe.test.ts           # Minimax, Alpha-Beta, game logic
│
├── scripts/
│   ├── benchmarkPuzzle.ts          # CLI — standardized Module A runs
│   └── benchmarkTicTacToe.ts         # CLI — standardized Module B runs
│
└── docs/
    ├── comparative-analysis-report.pdf
    └── screenshots/                # Dashboard & CLI evidence
```

---

## Tech Stack

- React 19 + TypeScript + Vite 6
- Tailwind CSS v4
- React Router, Framer Motion, Lucide React, react-dropzone
- Vitest (unit tests)
- Deployed on [Vercel](https://ai-search-lab-five.vercel.app/)

---

## Credits

**Kristian Correa & Broudy Negron**  
FIU Summer 2026 Artificial Intelligence w/ Professor Xian Su