import { Link } from "react-router-dom";
import { ArrowRight, Brain, Grid3x3 } from "lucide-react";
import { Layout } from "@/shared/Layout";
import { ROUTES } from "@/shared/constants";

const labs = [
  {
    href: ROUTES.puzzle,
    title: "Sliding Puzzle",
    description: "Compare BFS, Dijkstra, and A* on an N-puzzle with custom image tiles.",
    icon: Grid3x3,
  },
  {
    href: ROUTES.tictactoe,
    title: "Tic-Tac-Toe AI",
    description: "Pit Minimax against Alpha-Beta pruning and measure search performance.",
    icon: Brain,
  },
] as const;

export default function Home() {
  return (
    <Layout>
      <div className="space-y-8">
        <section className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">AI Search Algorithm Lab</h1>
          <p className="max-w-2xl text-neutral-600 dark:text-neutral-400">
            Interactive experiments for uninformed and informed search, plus adversarial
            game-tree algorithms. Metrics and benchmarks help compare efficiency across approaches.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          {labs.map(({ href, title, description, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:border-violet-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-violet-700"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-violet-100 p-3 dark:bg-violet-950">
                  <Icon className="size-6 text-violet-600 dark:text-violet-400" />
                </div>
                <ArrowRight className="size-5 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-violet-500" />
              </div>
              <h2 className="mt-4 text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
            </Link>
          ))}
        </section>

        <section className="border-t border-neutral-200 pt-8 dark:border-neutral-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Project Team
          </p>
          <p className="mt-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Kristian Correa &amp; Broudy Negron
          </p>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            FIU Summer 2026 Artificial Intelligence w/ Professor Xian Su
          </p>
        </section>
      </div>
    </Layout>
  );
}
