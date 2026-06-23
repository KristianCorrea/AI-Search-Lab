import type { GameMode, Player } from "@/modules/tictactoe/types";

export interface TurnStatusBannerProps {
  mode: GameMode;
  /** Human vs AI: true when the human should click the board. */
  isPlayerTurn?: boolean;
  humanPlayer?: Player;
  isAiThinking?: boolean;
  /** Human vs Human: whose turn it is to play. */
  currentPlayer?: Player;
}

function playerBannerClass(player: Player, pulse = false): string {
  const isX = player === "X";
  return [
    "rounded-lg border px-3 py-2 text-sm font-semibold",
    pulse ? "animate-pulse" : "",
    isX
      ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
      : "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
  ].join(" ");
}

export function TurnStatusBanner({
  mode,
  isPlayerTurn,
  humanPlayer = "X",
  isAiThinking,
  currentPlayer = "X",
}: TurnStatusBannerProps) {
  if (mode === "human-human") {
    return (
      <div className={playerBannerClass(currentPlayer, true)}>
        Player {currentPlayer}&apos;s turn — pick a square
      </div>
    );
  }

  if (isPlayerTurn) {
    return (
      <div className={playerBannerClass(humanPlayer, true)}>
        Your turn — pick a square ({humanPlayer})
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300">
      {isAiThinking ? "AI is thinking…" : "AI's turn…"}
    </div>
  );
}
