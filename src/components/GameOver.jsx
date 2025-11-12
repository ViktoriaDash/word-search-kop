import React from "react";
import { createPortal } from "react-dom";
import "../styles/GameOver.css";

const GameOver = ({ isOpen, onRestart, onClose, stats, onSaveResult }) => {
  if (!isOpen) return null;

  
  const handleClose = () => {
   
    if (onSaveResult && stats) {
      onSaveResult({
        difficulty: stats.difficulty,
        boardSize: stats.boardSize,
        foundWords: stats.foundWords,
        totalWords: stats.totalWords,
        time: stats.time,
        progress: stats.progress
      });
    }
    onClose();
  };

  const handleRestart = () => {
    
    if (onSaveResult && stats) {
      onSaveResult({
        difficulty: stats.difficulty,
        boardSize: stats.boardSize,
        foundWords: stats.foundWords,
        totalWords: stats.totalWords,
        time: stats.time,
        progress: stats.progress
      });
    }
    onRestart();
  };

  
  const getCompletionStatus = () => {
    if (stats.progress === 100) {
      return "🎉 Вітаємо! Рівень пройдено! 🎉";
    } else if (stats.progress >= 50) {
      return "👍 Добре зроблено!";
    } else {
      return "💪 Спробуйте ще раз!";
    }
  };

 
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  
  const getLevelName = () => {
    switch (stats.difficulty) {
      case "easy": return "Легкий (5×5)";
      case "medium": return "Середній (6×6)";
      case "hard": return "Складний (8×8)";
      default: return stats.difficulty;
    }
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content game-over-modal">
        <div className="game-over-header">
          <h2>Гру завершено!</h2>
          <div className="completion-status">
            {getCompletionStatus()}
          </div>
        </div>

        <div className="game-stats">
          <div className="stat-row">
            <span className="stat-label">Рівень:</span>
            <span className="stat-value">{getLevelName()}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Знайдено слів:</span>
            <span className="stat-value">{stats.foundWords}/{stats.totalWords}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Час:</span>
            <span className="stat-value">{formatTime(stats.time)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Прогрес:</span>
            <span className="stat-value">{stats.progress}%</span>
          </div>
        </div>

        {stats.progress === 100 && (
          <div className="level-completed-badge">
            🏆 Рівень успішно пройдено!
          </div>
        )}

        <div className="modal-buttons">
          <button className="btn-restart" onClick={handleRestart}>
            🔄 Грати ще раз
          </button>
          <button className="btn-close" onClick={handleClose}>
            📊 Перейти до результатів
          </button>
        </div>

        <div className="result-saved-note">
          ✅ Результат збережено в історії
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GameOver;