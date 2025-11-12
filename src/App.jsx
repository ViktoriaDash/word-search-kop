import React, { useState, useEffect } from "react";
import StartPage from "./pages/StartPage";
import GamePage from "./pages/GamePage";
import ResultsPage from "./pages/ResultsPage";
import "./styles/view.css";

export default function App() {
  const [page, setPage] = useState("start");
  const [gameSession, setGameSession] = useState(0); // Ключ для перезавантаження компонентів

  // Функція для початку нової гри (очищає всі дані)
  const handleStartGame = () => {
    console.log("🔄 Початок нової гри - очищення даних");
    
    // Очищаємо всі дані з попередньої гри
    localStorage.removeItem("gameResults");
    localStorage.removeItem("completedLevels");
    localStorage.removeItem("gameSettings");
    
    // Збільшуємо ключ сесії для примусового перезавантаження компонентів
    setGameSession(prev => prev + 1);
    setPage("game");
  };

  // Функція для завершення гри (перехід до результатів)
  const handleFinishGame = () => {
    setPage("results");
  };

  // Функція для повернення до початку (нова гра)
  const handleRestartGame = () => {
    setPage("start");
  };

  // Очищаємо дані при першому завантаженні додатку
  useEffect(() => {
    console.log("🎮 Додаток завантажено - перевірка даних");
    
    // Можна також очистити дані при першому завантаженні, якщо потрібно
    // localStorage.removeItem("gameResults");
    // localStorage.removeItem("completedLevels");
    // localStorage.removeItem("gameSettings");
  }, []);

  return (
    <div className="app-container">
      {page === "start" && <StartPage onStart={handleStartGame} />}
      {page === "game" && (
        <GamePage 
          key={`game-${gameSession}`} // Ключ для примусового перезавантаження
          onFinish={handleFinishGame} 
        />
      )}
      {page === "results" && (
        <ResultsPage 
          key={`results-${gameSession}`} // Ключ для примусового перезавантаження
          onRestart={handleRestartGame} 
        />
      )}
    </div>
  );
}