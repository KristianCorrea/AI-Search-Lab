import { describe, it } from "vitest";

describe("minimax", () => {
  it.todo("blocks opponent winning threat");
  it.todo("chooses winning move when available");
});

describe("alpha-beta", () => {
  it.todo("returns same move as minimax on equivalent positions");
  it.todo("visits fewer nodes than minimax");
});

describe("winner detection", () => {
  it.todo("findWinner detects row, column, and diagonal wins");
  it.todo("getGameStatus returns draw when board is full");
});
