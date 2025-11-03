import React, { useState } from "react";
import StartPage from "./pages/StartPage";
import GamePage from "./pages/GamePage";
import ResultsPage from "./pages/ResultsPage";
import "./styles/view.css";

export default function App() {
  const [page, setPage] = useState("start"); // "start" | "game" | "results"

  return (
    <div className="app-container">
      {page === "start" && <StartPage onStart={() => setPage("game")} />}
      {page === "game" && <GamePage onFinish={() => setPage("results")} />}
      {page === "results" && <ResultsPage onRestart={() => setPage("start")} />}
    </div>
  );
}