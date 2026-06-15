import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  description?: string;
}

export function MetricCard({ label, value, icon: Icon, description }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {label}
        </p>
        {Icon && <Icon className="size-4 text-violet-500" />}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {description && (
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
    </div>
  );
}
