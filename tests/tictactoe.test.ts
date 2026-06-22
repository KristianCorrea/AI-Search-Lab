import { describe, expect, it } from "vitest";
import { EMPTY_BOARD, X_WIN_BOARD, O_WIN_BOARD, DRAW_BOARD } from "@/shared/constants";
import {
  createEmptyBoard,
  createInitialGameState,
  getAvailableMoves,
  applyMove,
  switchPlayer,
  findWinner,
  getGameStatus,
  getWinningLine,
  getWinner,
} from "@/modules/tictactoe/game";

describe("minimax", () => {
  it.todo("blocks opponent winning threat");
  it.todo("chooses winning move when available");
});

describe("alpha-beta", () => {
  it.todo("returns same move as minimax on equivalent positions");
  it.todo("visits fewer nodes than minimax");
});

describe("winner detection", () => {
  it("findWinner detects row, column, and diagonal wins", () => {
    expect(findWinner(X_WIN_BOARD)).toBe("X");
    expect(findWinner(O_WIN_BOARD)).toBe("O");
    expect(findWinner(DRAW_BOARD)).toBe(null);
    expect(findWinner(EMPTY_BOARD)).toBe(null);
  });

  it("getGameStatus returns won when board has a winner", () => {
    expect(getGameStatus(X_WIN_BOARD)).toBe("won");
    expect(getGameStatus(O_WIN_BOARD)).toBe("won");
  });

  it("getWinningLine returns the correct line that won", () => {
    expect(getWinningLine(X_WIN_BOARD)).toEqual([0,1,2]);
    expect(getWinningLine(O_WIN_BOARD)).toEqual([0,4,8]);
    expect(getWinningLine(DRAW_BOARD)).toEqual(null);
    expect(getWinningLine(EMPTY_BOARD)).toEqual(null);
  });

  it("getWinner returns the correct person who won", () => {
    expect(getWinner(X_WIN_BOARD)).toBe("X");
    expect(getWinner(O_WIN_BOARD)).toBe("O");
    expect(getWinner(DRAW_BOARD)).toBe(null);
    expect(getWinner(EMPTY_BOARD)).toBe(null);
  });

  it("getGameStatus returns draw when board is full", () => {
    expect(getGameStatus(DRAW_BOARD)).toBe("draw");
  });
  
  it("getGameStatus returns playing when board isn't full with no winner", () => {
    expect(getGameStatus(EMPTY_BOARD)).toBe("playing");
  });
});
