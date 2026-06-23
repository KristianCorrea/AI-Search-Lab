import { Bot, User, Users } from "lucide-react";
import type { GameMode } from "@/modules/tictactoe/types";

const MODES: { id: GameMode; label: string; icon: typeof User }[] = [
  { id: "human-ai", label: "Human vs AI", icon: User },
  { id: "human-human", label: "Human vs Human", icon: Users },
  { id: "ai-ai", label: "AI vs AI", icon: Bot },
];

export interface ModeTabsProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export function ModeTabs({ mode, onModeChange }: ModeTabsProps) {
  return (
    <div className="flex w-fit flex-wrap gap-1 rounded-xl border border-neutral-200 p-1 dark:border-neutral-800">
      {MODES.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onModeChange(id)}
          className={[
            "flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            mode === id
              ? "bg-violet-600 text-white"
              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800",
          ].join(" ")}
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
