import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import { useGameResults } from "../hooks/useGameResults";
import "../styles/ResultsPage.css";


export default function ResultsPage({ onRestart }) {
  const navigate = useNavigate();
  const { userId } = useParams(); 

  const { results, getLevelStats } = useGameResults(userId); 
  const levelStats = getLevelStats();


  const formatTime = (seconds) => {
    if (seconds === null) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const getLevelName = (level) => {
    switch (level) {
      case "easy": return "Легкий (5x5)";
      case "medium": return "Середній (6x6)";
      case "hard": return "Складний (8x8)";
      default: return level;
    }
  };
  
  const handleRestart = () => {
    onRestart(); 
    navigate("/"); 
  };


  return (
    <div className="page results-page">
      <h1>📊 Результати гри ({userId === "player_1" ? "Player 1" : "Гість"})</h1> 
      
      {results.length === 0 ? (
        <div className="no-results">
          <p>Ще немає результатів. Зіграйте гру щоб побачити статистику!</p>
        </div>
      ) : (
        <>
          <div className="level-stats">
            <h2>Статистика по рівням</h2>
            <div className="stats-grid">
              {Object.entries(levelStats).map(([level, stats]) => (
                <div key={level} className="stat-card">
                  <h3>{getLevelName(level)}</h3>
                  <div className="stat-item">
                    <span>Зіграно ігор:</span>
                    <strong>{stats.totalGames}</strong>
                  </div>
                  <div className="stat-item">
                    <span>Пройдено:</span>
                    <strong>{stats.completed}</strong>
                  </div>
                  <div className="stat-item">
                    <span>Найкращий час:</span>
                    <strong>{formatTime(stats.bestTime)}</strong>
                  </div>
                  <div className="stat-item">
                    <span>Успішність:</span>
                    <strong>
                      {stats.totalGames > 0 
                        ? `${Math.round((stats.completed / stats.totalGames) * 100)}%`
                        : '0%'
                      }
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="games-history">
            <h2>Історія ігор ({results.length})</h2>
            <div className="games-list">
              {results.slice().reverse().map((result, index) => (
                <div key={result.id} className="game-result">
                  <div className="game-header">
                    <span className="game-number">Гра #{results.length - index}</span>
                    <span className="game-date">{result.date}</span>
                  </div>
                  <div className="game-details">
                    <span className={`level-badge ${result.difficulty}`}>
                      {getLevelName(result.difficulty)}
                    </span>
                    <span className={`status ${result.progress === 100 ? 'completed' : 'incomplete'}`}>
                      {result.progress === 100 ? '✅ Пройдено' : '❌ Не пройдено'}
                    </span>
                    <span className="time">⏱️ {formatTime(result.time)}</span>
                    <span className="words">
                      {result.foundWords}/{result.totalWords} слів
                    </span>
                    <span className="progress">
                      {result.progress}% завершено
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      <div className="navigation">
        <Button label="🔄 Грати знову" onClick={handleRestart} /> 
      </div>
    </div>
  );
}