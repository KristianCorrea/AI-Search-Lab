"use client";

import { Cell } from "@/modules/tictactoe/components/Cell";
import type { Board as BoardType } from "@/modules/tictactoe/types/tictactoe";

interface BoardProps {
  board: BoardType;
  winningLine?: number[] | null;
  disabled?: boolean;
  onCellClick: (index: number) => void;
}

export function Board({ board, winningLine, disabled, onCellClick }: BoardProps) {
  const winningSet = new Set(winningLine ?? []);

  return (
    <div className="grid w-full max-w-xs grid-cols-3 gap-2">
      {board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          index={index}
          isWinning={winningSet.has(index)}
          disabled={disabled}
          onClick={onCellClick}
        />
      ))}
    </div>
  );
}
