export interface TimingResult {
  elapsedMs: number;
  startedAt: number;
  endedAt: number;
}

export interface Timer {
  start: () => void;
  stop: () => TimingResult;
}

export function createTimer(): Timer {
  let startedAt = 0;
  return {
    start() {
      startedAt = performance.now();
    },
    stop() {
      const endedAt = performance.now();
      return { startedAt, endedAt, elapsedMs: endedAt - startedAt };
    },
  };
}

export function measure<T>(fn: () => T): { result: T; timing: TimingResult } {
  const timer = createTimer();
  timer.start();
  const result = fn();
  return { result, timing: timer.stop() };
}

export function formatMs(ms: number): string {
  if(ms == 0) return `< 1 µs`;
  if (ms < 1) return `${(ms * 1000).toFixed(0)} µs`;
  if (ms < 1000) return `${ms.toFixed(1)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

export function formatCount(value: number): string {
  return value.toLocaleString();
}
