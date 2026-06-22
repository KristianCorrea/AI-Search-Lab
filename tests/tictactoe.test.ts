import { describe, expect, it } from "vitest";
import { EMPTY_BOARD, X_WIN_BOARD, O_WIN_BOARD, DRAW_BOARD } from "@/shared/constants";
import type { Player } from "@/modules/tictactoe/types";
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
  GameManager,
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

describe("GameManager", () => {
  it("applies a valid move and switches turn", () => {
    const game = new GameManager();

    const afterX = game.makeMove({ index: 4, player: "X" });

    expect(afterX.board[4]).toBe("X");
    expect(afterX.currentPlayer).toBe("O");
    expect(afterX.status).toBe("playing");
    expect(afterX.winner).toBe(null);
  });

  it("rejects moves from the wrong player", () => {
    const game = new GameManager();

    expect(() => game.makeMove({ index: 0, player: "O" })).toThrow(/Expected X/);
  });

  it("rejects moves after the game is over", () => {
    const game = new GameManager();

    game.makeMove({ index: 0, player: "X" });
    game.makeMove({ index: 3, player: "O" });
    game.makeMove({ index: 1, player: "X" });
    game.makeMove({ index: 4, player: "O" });
    game.makeMove({ index: 2, player: "X" });

    expect(game.getState().status).toBe("won");
    expect(() => game.makeMove({ index: 8, player: "O" })).toThrow(/already over/);
  });

  it("detects a win", () => {
    const game = new GameManager();

    game.makeMove({ index: 0, player: "X" });
    game.makeMove({ index: 3, player: "O" });
    game.makeMove({ index: 1, player: "X" });
    game.makeMove({ index: 4, player: "O" });
    const final = game.makeMove({ index: 2, player: "X" });

    expect(final.status).toBe("won");
    expect(final.winner).toBe("X");
    expect(final.board).toEqual(["X", "X", "X", "O", "O", null, null, null, null]);
  });

  it("detects a draw", () => {
    const game = new GameManager();
    const moves: [number, Player][] = [
      [0, "X"], [1, "O"], [2, "X"],
      [4, "O"], [3, "X"], [5, "O"],
      [7, "X"], [6, "O"], [8, "X"],
    ];

    let state = game.getState();
    for (const [index, player] of moves) {
      state = game.makeMove({ index, player });
    }

    expect(state.status).toBe("draw");
    expect(state.winner).toBe(null);
  });

  it("reset restores the initial state", () => {
    const game = new GameManager();

    game.makeMove({ index: 4, player: "X" });
    const reset = game.reset();

    expect(reset).toEqual(createInitialGameState());
  });
});
