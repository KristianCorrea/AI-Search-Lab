import { Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Puzzle from "@/pages/Puzzle";
import TicTacToe from "@/pages/tictactoe/TicTacToe";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/puzzle" element={<Puzzle />} />
      <Route path="/tictactoe" element={<TicTacToe />} />
    </Routes>
  );
}
