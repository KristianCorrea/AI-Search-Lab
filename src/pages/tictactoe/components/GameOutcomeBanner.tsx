export interface GameOutcomeBannerProps {
  outcomeText: string | null;
}

export function GameOutcomeBanner({ outcomeText }: GameOutcomeBannerProps) {
  if (!outcomeText) return null;

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
      {outcomeText}
    </div>
  );
}
