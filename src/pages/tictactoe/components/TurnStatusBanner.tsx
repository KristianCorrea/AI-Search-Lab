import type { Player } from "@/modules/tictactoe/types";

export interface TurnStatusBannerProps {
  /** True when the human should click the board. */
  isPlayerTurn: boolean;
  humanPlayer: Player;
  isAiThinking: boolean;
}

export function TurnStatusBanner({
  isPlayerTurn,
  humanPlayer,
  isAiThinking,
}: TurnStatusBannerProps) {
  if (isPlayerTurn) {
    const isX = humanPlayer === "X";

    return (
      <div
        className={[
          "rounded-lg border px-3 py-2 text-sm font-semibold animate-pulse",
          isX
            ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
            : "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
        ].join(" ")}
      >
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
