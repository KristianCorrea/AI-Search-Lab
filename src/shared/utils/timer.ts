import type { TimingResult } from "@/shared/types/metrics";

export interface Timer {
  start: () => void;
  stop: () => TimingResult;
}

/** Creates a high-resolution timer for algorithm benchmarks. */
export function createTimer(): Timer {
  let startedAt = 0;

  return {
    start() {
      startedAt = performance.now();
    },
    stop() {
      const endedAt = performance.now();
      return {
        startedAt,
        endedAt,
        elapsedMs: endedAt - startedAt,
      };
    },
  };
}

/** Measures synchronous function execution time. */
export function measure<T>(fn: () => T): { result: T; timing: TimingResult } {
  const timer = createTimer();
  timer.start();
  const result = fn();
  const timing = timer.stop();
  return { result, timing };
}
