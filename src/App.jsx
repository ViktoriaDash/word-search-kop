import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import StartPage from "./pages/StartPage";
import GamePage from "./pages/GamePage";
import ResultsPage from "./pages/ResultsPage";
import "./styles/view.css";
import { useGameSettings } from "./hooks/useGameSettings"; 
import CookieConsent from "react-cookie-consent";

const PERSISTENT_PLAYER_ID = "player_1"; 

export default function App() {
  const [gameSession, setGameSession] = useState(0); 
  const [currentUserId, setCurrentUserId] = useState(PERSISTENT_PLAYER_ID); 
  
  const { resetProgress } = useGameSettings(PERSISTENT_PLAYER_ID); 
  
  const handleStartGame = (userId) => {
    setCurrentUserId(userId);

    if (userId === PERSISTENT_PLAYER_ID) {
        console.log(`🔄 Початок НОВОЇ гри для ${userId}. Скидаємо рівні.`);
        resetProgress(); 
    } else {
       
        console.log(`👻 Початок нової гри для Гостя (${userId}).`);
    }
    
    setGameSession(prev => prev + 1);
  };

  const handleRestartGame = () => {
    setGameSession(prev => prev + 1); 
  };

  useEffect(() => {
    console.log("🎮 Додаток завантажено");
  }, []);

  const GameWrapper = () => (
    <GamePage 
      key={`game-${gameSession}`} 
      onFinish={() => { console.log(`Сесія завершена.`); }} 
    />
  );
  
  return (
    <Router>
      <div className="app-container">
        <Routes>

          <Route path="/" element={<StartPage onStart={handleStartGame} />} />
          
          <Route path="/game" element={<Navigate to="/" replace />} />
          
          <Route 
            path="/game/:userId" 
            element={<GameWrapper />} 
          />
    
          <Route path="/results/:userId" element={<ResultsPage onRestart={handleRestartGame} />} />
          
          <Route path="/results" element={<Navigate to={`/results/${currentUserId}`} replace />} /> 
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

              <CookieConsent
        location="bottom"
        buttonText="Прийняти всі"
        declineButtonText="Тільки необхідні"
        enableDeclineButton
        cookieName="wordSearchUserConsent"
        style={{ background: "#2c3e50", color: "#ecf0f1", textAlign: "left" }}
        buttonStyle={{ 
          background: "#27ae60", 
          color: "white", 
          fontSize: "14px", 
          borderRadius: "4px",
          padding: "10px 20px" 
        }}
        declineButtonStyle={{ 
          background: "#e74c3c", 
          color: "white", 
          fontSize: "14px", 
          borderRadius: "4px",
          padding: "10px 20px" 
        }}
        onDecline={() => {
          localStorage.clear();
          console.warn("Користувач відмовився. Дані не зберігатимуться.");
        }}
        expires={150}
      >
        {" "}
        <a 
          href="/PRIVACY.txt" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: "#3498db", textDecoration: "underline" }}
        >
          Політиці конфіденційності
        </a>.
</CookieConsent>

      </div>
    </Router>
  );
}