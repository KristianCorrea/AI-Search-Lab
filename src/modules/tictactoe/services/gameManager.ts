import type { GameState } from "@/modules/tictactoe/types/tictactoe";
import type { Move } from "@/modules/tictactoe/types/move";
import { createInitialGameState } from "@/modules/tictactoe/utils/boardHelpers";

export class GameManager {
  private state: GameState;

  constructor() {
    this.state = createInitialGameState();
  }

  getState(): GameState {
    return this.state;
  }

  makeMove(_move: Move): GameState {
    throw new Error("Not implemented");
  }

  reset(): GameState {
    this.state = createInitialGameState();
    return this.state;
  }
}
