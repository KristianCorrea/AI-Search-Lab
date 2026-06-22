import { Bot, User } from "lucide-react";
import type { GameMode } from "@/modules/tictactoe/types";

export interface ModeTabsProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export function ModeTabs({ mode, onModeChange }: ModeTabsProps) {
  return (
    <div className="flex w-fit gap-1 rounded-xl border border-neutral-200 p-1 dark:border-neutral-800">
      {(["human-ai", "ai-ai"] as GameMode[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onModeChange(m)}
          className={[
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            mode === m
              ? "bg-violet-600 text-white"
              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800",
          ].join(" ")}
        >
          {m === "human-ai" ? <User className="size-4" /> : <Bot className="size-4" />}
          {m === "human-ai" ? "Human vs AI" : "AI vs AI"}
        </button>
      ))}
    </div>
  );
}
