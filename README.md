# AI Search Lab

Interactive lab for comparing uninformed search, informed search, and adversarial game-tree algorithms.

## Modules

- **Sliding Puzzle** — BFS, Dijkstra, and A* on an 8-puzzle with optional custom image tiles
- **Tic-Tac-Toe AI** — Minimax and Alpha-Beta pruning with performance metrics

> Algorithm implementations are stubbed. See [ROADMAP.md](ROADMAP.md) for implementation tasks.

## Quick Start

```bash
# Option 1: run script (installs deps + starts dev server)
chmod +x run.sh
./run.sh

# Option 2: manual
bun install   # or npm install
bun dev       # open http://localhost:5173
```

Production build:

```bash
bun run build
bun run preview   # serves dist/ at http://localhost:4173
```

## Scripts

| Command | Description |
| ------- | ----------- |
| `bun dev` | Start Vite dev server |
| `bun run build` | Production build → `dist/` |
| `bun run preview` | Preview production build |
| `bun test` | Vitest watch mode |
| `bun test:run` | Vitest single run |
| `bun run benchmark:puzzle` | Puzzle algorithm benchmark |
| `bun run benchmark:tictactoe` | Tic-tac-toe benchmark |

## Project Structure

```
src/
├── pages/              # Home, Puzzle, TicTacToe (UI + state)
├── shared/             # Layout, MetricCard, constants, metrics
└── modules/
    ├── puzzle/         # types, board, solvers, image
    └── tictactoe/      # types, game, ai, autoplay

tests/                  # Vitest (puzzle.test.ts, tictactoe.test.ts)
scripts/                # CLI benchmarks
docs/                   # Comparative analysis + screenshots
public/                 # Static assets
```

## Tech Stack

- React 19 + Vite 6
- TypeScript
- Tailwind CSS v4
- React Router
- Lucide React, Framer Motion, react-dropzone
- Vitest

## Documentation

- [Assignment.md](Assignment.md) — requirements checklist
- [ROADMAP.md](ROADMAP.md) — implementation tasks
- [docs/comparative-analysis.md](docs/comparative-analysis.md) — report template
