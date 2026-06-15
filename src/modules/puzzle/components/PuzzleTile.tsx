"use client";

import { motion } from "framer-motion";

interface PuzzleTileProps {
  value: number;
  imageUrl?: string;
  isBlank?: boolean;
  onClick?: () => void;
}

export function PuzzleTile({ value, imageUrl, isBlank, onClick }: PuzzleTileProps) {
  if (isBlank || value === 0) {
    return <div className="aspect-square rounded-lg bg-neutral-100 dark:bg-neutral-800" />;
  }

  return (
    <motion.button
      type="button"
      layout
      onClick={onClick}
      className="aspect-square overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 text-lg font-semibold shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={`Tile ${value}`} className="size-full object-cover" />
      ) : (
        <span className="flex size-full items-center justify-center">{value}</span>
      )}
    </motion.button>
  );
}
