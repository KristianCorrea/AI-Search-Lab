"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Grid3x3, LayoutGrid } from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";

const navItems = [
  { href: ROUTES.home, label: "Dashboard", icon: LayoutGrid },
  { href: ROUTES.puzzle, label: "Puzzle", icon: Grid3x3 },
  { href: ROUTES.tictactoe, label: "Tic-Tac-Toe", icon: Brain },
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={ROUTES.home}
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <Brain className="size-5 text-violet-600" />
          <span>AI Search Lab</span>
        </Link>

        <ul className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
                  }`}
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
