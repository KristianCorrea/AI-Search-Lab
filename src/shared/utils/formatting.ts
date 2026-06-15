/** Formats milliseconds for display in metric cards. */
export function formatMs(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)} µs`;
  if (ms < 1000) return `${ms.toFixed(1)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

/** Formats large counts with locale-aware separators. */
export function formatCount(value: number): string {
  return value.toLocaleString();
}
