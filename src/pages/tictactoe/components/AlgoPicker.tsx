import { TICTACTOE_ALGORITHMS, type TicTacToeAlgorithmId } from "@/shared/constants";

export interface AlgoPickerProps {
  label: string;
  value: TicTacToeAlgorithmId;
  onChange: (id: TicTacToeAlgorithmId) => void;
  disabled?: boolean;
}

// ── AlgoPicker ────────────────────────────────────────────────────────────────
/**
 * Displays the algorithm picker and allows the user to select an algorithm.
 * @param label - The label for the algorithm picker.
 * @param value - The value of the algorithm picker.
 * @param onChange - The function to call when the algorithm is changed.
 * @param disabled - Whether the algorithm picker is disabled.
 * @returns The AlgoPicker component.
 */
export function AlgoPicker({ label, value, onChange, disabled }: AlgoPickerProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
      <div className="grid grid-cols-2 gap-1.5">
        {TICTACTOE_ALGORITHMS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.id)}
            className={[
              "rounded-lg border px-2 py-1.5 text-left text-xs font-medium transition-colors disabled:opacity-40",
              value === opt.id
                ? "border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-400 dark:bg-violet-950/50 dark:text-violet-300"
                : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
