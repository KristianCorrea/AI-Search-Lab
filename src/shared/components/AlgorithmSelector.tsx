"use client";

import type { AlgorithmOption } from "@/shared/types/algorithm";

interface AlgorithmSelectorProps<T extends string> {
  options: AlgorithmOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
}

export function AlgorithmSelector<T extends string>({
  options,
  value,
  onChange,
  label = "Algorithm",
}: AlgorithmSelectorProps<T>) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const isSelected = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`rounded-xl border p-3 text-left transition-colors ${
                isSelected
                  ? "border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-950/50"
                  : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              }`}
            >
              <p className="text-sm font-semibold">{option.label}</p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
