# Assignment: AI Search Lab — 8-Puzzle Solver & Tic-Tac-Toe with AI

> One-stop reference for what this project is, what it must do, and exactly what
> I still need to build. Read this top-to-bottom and you'll know the whole job.

---

## 1. The Goal (Why this exists)

Build a single web app with **two AI modules** behind **one entry point**:

- **Module A — 8-Puzzle Solver:** single-agent search (planning toward a goal alone)
- **Module B — Tic-Tac-Toe AI:** adversarial search (planning against an opponent)

By the end I should be able to:

1. Implement 5 classical algorithms from scratch: **BFS/DFS, Dijkstra, A\*, Minimax, Alpha-Beta**.
2. Compare uninformed vs informed vs adversarial search using **measured metrics**.
3. Justify an **admissible heuristic** for A\*.
4. Integrate two modules under one UI.
5. Reflect on how single-agent search differs from adversarial search.

**Hard rule:** I must understand every line submitted. Graders may ask me to explain any part.

---

## 2. Quick Facts

| Item | Detail |
| --- | --- |
| Time budget | ~10–25 hrs/student over 3 weeks (Module A takes longer) |
| Group size | 1–3 students, one submission, list teammates in Canvas comment |
| Deliverable | Runnable app + README/report + zip |
| Grading | 100 pts + up to 10 bonus (capped at 110) |
| Submission name | `Group{N}_HW1.zip` or `LastName_HW1.zip` |
| Stack (ours) | Next.js 16, React 19, TypeScript, Tailwind v4, Bun |

---

## 3. How to Run (for the grader)

> Our stack is a Node/Bun app, NOT a double-click `index.html`. The grader's
> default is `index.html` or `run.sh`, so we MUST provide a one-command launch
> and keep setup under 5 minutes or risk a Code Quality deduction.

```bash
# Install + start (development)
bun install
bun dev          # open http://localhost:3000

# Or production
bun install && bun run build && bun run start
```

TODO: add a `run.sh` wrapper and document expected startup time in README.

---

## 4. What Must Be Built (Requirements Checklist)

### Module A — 8-Puzzle (25 + 10 pts)

**State:** 3×3 grid, blank as `0`. We store tiles as a flat array of 9.

Algorithms (all three, independent solvers, each with a nodes-expanded counter):

- [ ] **Blind search** — BFS *or* DFS (pick one) → `src/modules/puzzle/algorithms/bfs.ts`
- [ ] **Dijkstra** — separate solver even though it equals BFS on unit costs → `dijkstra.ts`
- [ ] **A\*** — required; admissible heuristic (Manhattan recommended) → `astar.ts` + `heuristics.ts`
- [ ] Supporting: `priorityQueue.ts`, `utils/boardHelpers.ts`, `utils/solvability.ts`

Interactive features:

- [ ] **Image upload** (.jpg + .png), auto resize/crop to square, slice into 3×3 → `services/imageSlicer.ts`
- [ ] **Default numbered puzzle** (1–8 + blank), playable without an image → already in `boardHelpers.createSolvedState`
- [ ] **Shuffle** into a *solvable* state → `services/puzzleGenerator.ts`
- [ ] **Manual play** — click/drag tiles → `hooks/usePuzzle.ts` + `components/PuzzleBoard.tsx`
- [ ] **Step-by-step solve** — watch the optimal solution unfold one move at a time → `services/puzzleAnimator.ts`

### Module B — Tic-Tac-Toe (25 + 10 pts)

Algorithms (both):

- [ ] **Minimax** — eval returns +10 (AI win) / -10 (loss) / 0 (draw) → `algorithms/minimax.ts` + `evaluation.ts`
- [ ] **Alpha-Beta** — correct pruning on top of Minimax, fewer nodes → `algorithms/alphaBeta.ts`
- [ ] Supporting: `utils/winnerDetection.ts`, `utils/boardHelpers.ts`, `services/gameManager.ts`

Game modes:

- [ ] **Human vs AI** — pick algorithm (Minimax/Alpha-Beta), choose to play first or second
- [ ] **AI vs AI (autoplay)** — step-by-step move visualization, pick algorithm for each AI, show outcome → `services/autoplay.ts`
- [ ] (Optional bonus) Human vs Human

> Note: optimal vs optimal always draws — that's correct, not a bug.

### Shared — Performance Dashboard (10 pts)

Display for both modules:

- [ ] **Decision Time** (ms)
- [ ] **Nodes Explored / Expanded**
- [ ] **Solution Length** (Module A)
- [ ] **Pruning Efficiency** (Module B, Alpha-Beta only) = `(minimaxNodes - alphaBetaNodes) / minimaxNodes`
- [ ] Prefer **live updates**; a final summary is acceptable but scores lower
- [ ] Bonus: a truly shared dashboard component across both modules → `shared/components/MetricCard.tsx`

### Interface Design (counts toward Code Quality)

- [ ] Single landing page reaching both modules (have: `/` dashboard + navbar)
- [ ] Intuitive without reading README
- [ ] Visual feedback: highlight clickable tiles/cells, distinguish X vs O
- [ ] Always show: current state (turn / move count), selected algorithm, performance data
- [ ] Controls: restart, switch module, switch algorithm; pause/resume/speed for autoplay (optional)

---

## 5. Comparative Analysis Report (15 pts)

~500–800 words in README or PDF. Must address **all 5 prompts** + heuristic justification.
**Screenshots of the dashboard with real numbers are required** — no screenshot = no credit for that checkpoint.

### Standardized test inputs (use these exactly)

**Module A puzzle**
- Start: `[[8,1,3],[4,0,2],[7,6,5]]` → flat `[8,1,3,4,0,2,7,6,5]`
- Goal: `[[1,2,3],[4,5,6],[7,8,0]]`
- Optimal depth: **14 moves**
- Sanity check: BFS/Dijkstra expand ~**thousands** of nodes; A\* (Manhattan) ~**tens to low hundreds**

**Module B position**
- Empty board, AI plays first as X
- Report metrics for the **first move only**
- Pruning rate varies with move ordering — report honestly

### Reflection prompts (answer each)

1. **Structural comparison** — 8-puzzle search space vs Tic-Tac-Toe game tree. Who controls the next state? What does "solving" mean in each?
2. **Algorithm fit** — Why is A\* right for the puzzle but not Tic-Tac-Toe? Why doesn't Minimax fit the puzzle?
3. **Empirical — Module A** — Report nodes expanded for blind / Dijkstra / A\* on the test puzzle. What does it say about heuristic value?
4. **Empirical — Module B** — Minimax vs Alpha-Beta nodes on the test position; compute pruning rate.
5. **Trade-offs** — One sentence each on completeness, optimality, time, space for every algorithm.

### Heuristic justification (2–3 sentences)

Explain in plain English why the chosen A\* heuristic never overestimates. Example for Manhattan:
> "Manhattan distance counts the minimum moves each tile needs to reach its goal. Since one move
> reduces only one tile's distance by at most 1, the true cost can never be less than the sum of
> Manhattan distances — so it never overestimates."

### What scores well vs poorly

- Good: real numbers from our runs, insight beyond textbook, at least one surprising observation, screenshots.
- Bad: generic claims ("A\* is faster because heuristics"), no numbers, no screenshots → 2–4 / 15.

---

## 6. Submission Requirements

- [ ] **README.md** with sections: Overview / How to Run / Architecture / Algorithms Implemented / Credits (+ heuristic justification + Comparative Analysis, or in a PDF)
- [ ] **Complete source code**, clean folder structure, all assets included
- [ ] **One-command launch** (`run.sh` for our Node stack) with setup notes
- [ ] **Dependency file** (`package.json` — already present)
- [ ] Zip as `Group{N}_HW1.zip`, upload to Canvas, comment teammates

---

## 7. Grading Rubric (100 + 10)

| Component | Points |
| --- | --- |
| Module A — three solvers (BFS/DFS, Dijkstra, A\*) correct | 25 |
| Module A — image upload, shuffle, manual play, step-by-step solve | 10 |
| Module B — Minimax + Alpha-Beta correct | 25 |
| Module B — Human vs AI + AI vs AI with step-by-step visualization | 10 |
| Performance dashboard (time, nodes, pruning rate) | 10 |
| Comparative Analysis Report | 15 |
| Code quality, README, deployability | 5 |
| Extra credit | up to 10 |

---

## 8. Extra Credit Ideas (cap +10)

- Human vs Human Tic-Tac-Toe
- More algorithms (Greedy Best-First, IDA\*)
- N-puzzle / larger Tic-Tac-Toe (4×4, k-in-a-row)
- Polished animations, sound, dark mode
- Replay / undo / save-load
- Truly shared dashboard component
- **Unit tests — ≥3 per algorithm** (we have Vitest stubs ready in `tests/`)

---

## 9. Implementation Roadmap

The full task-by-task roadmap lives in **[ROADMAP.md](ROADMAP.md)**. Open that file to see what to implement, in which file, and how to verify each step is done.

**Quick overview of phases:**

| Phase | Focus |
| --- | --- |
| 0 | Shared setup + benchmark constants |
| 1–2 | Puzzle foundation + solvers (BFS, Dijkstra, A\*) |
| 3–4 | Tic-Tac-Toe algorithms + metrics contracts |
| 5 | Benchmark scripts (report evidence) |
| 6–7 | Module A & B UI wiring + game modes |
| 8 | Unified performance dashboard |
| 9 | Unit tests (extra credit) |
| 10 | Report, screenshots, README, `run.sh` |

Each task in `ROADMAP.md` includes the exact file path, implementation steps, and a **Done when** check. Work phases in order — later tasks depend on earlier ones.

---

## 10. GenAI & Integrity

GenAI is allowed as a "junior developer." I'm the system designer and must be able to
explain every line. Unexplained code may be re-graded as zero. Verify all AI-generated
analysis before submitting.
