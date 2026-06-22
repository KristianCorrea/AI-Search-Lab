export interface HistoryBrowseBannerProps {
  effectiveStep: number;
  totalMoves: number;
  onBackToLive: () => void;
}

export function HistoryBrowseBanner({
  effectiveStep,
  totalMoves,
  onBackToLive,
}: HistoryBrowseBannerProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
      <span>
        Viewing move {effectiveStep} of {totalMoves}
      </span>
      <button type="button" onClick={onBackToLive} className="underline">
        Back to live
      </button>
    </div>
  );
}
