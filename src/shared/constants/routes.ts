export const ROUTES = {
  home: "/",
  puzzle: "/puzzle",
  tictactoe: "/tictactoe",
} as const;

export type RouteKey = keyof typeof ROUTES;
