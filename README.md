# AI Search Lab

Interactive lab for comparing uninformed search, informed search, and adversarial game-tree algorithms. Built with Next.js, TypeScript, and Tailwind CSS.

## Modules

- **Sliding Puzzle** — BFS, Dijkstra, and A* on an N-puzzle with optional custom image tiles
- **Tic-Tac-Toe AI** — Minimax and Alpha-Beta pruning with performance metrics

> **Note:** Algorithm implementations are currently stubbed. Types, UI shell, tests, and benchmark scripts are in place for incremental development.

## Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 20+

## Getting Started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| ------- | ----------- |
| `bun dev` | Start development server |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun test` | Run Vitest in watch mode |
| `bun test:run` | Run Vitest once |
| `bun run benchmark:puzzle` | Puzzle algorithm benchmark (stub) |
| `bun run benchmark:tictactoe` | Tic-tac-toe benchmark (stub) |
| `bun run lint` | ESLint |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── modules/
│   ├── puzzle/       # N-puzzle search algorithms & UI
│   └── tictactoe/    # Game-tree AI algorithms & UI
├── shared/           # Shared components, types, utils
└── styles/           # Global CSS (Tailwind v4)

tests/                # Vitest unit tests (todo stubs)
scripts/              # CLI benchmark scripts
docs/                 # Analysis templates & deliverables
public/               # Static assets
```

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide React
- Framer Motion
- react-dropzone
- Vitest

## Documentation

- [`docs/comparative-analysis.md`](docs/comparative-analysis.md) — analysis template
- [`docs/final-report.pdf`](docs/final-report.pdf) — replace with final report
- [`docs/screenshots/`](docs/screenshots/) — dashboard and results screenshots
