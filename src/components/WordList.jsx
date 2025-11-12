import React from "react";
import "../styles/WordList.css";

const WordList = ({ words = [], foundWords = [], gameStats = { progress: 0, wordsLeft: 0 } }) => {
  return (
    <div className="word-list-container">
      <h3 className="word-list-title">Слова для пошуку:</h3>
      <div className="word-list-grid">
        {words.map((word, index) => {
          const isFound = foundWords.includes(word);
          return (
            <div 
              key={index} 
              className={`word-list-item ${isFound ? 'found' : ''}`}
            >
              <span>{word}</span>
              {isFound && <span className="word-list-checkmark">✓</span>}
            </div>
          );
        })}
      </div>
      
      <div className="word-list-stats">
        <div className="word-list-stat-row">
          <span className="word-list-stat-label">Прогрес:</span>
          <span className="word-list-stat-value">{gameStats.progress}%</span>
        </div>
        <div className="word-list-stat-row">
          <span className="word-list-stat-label">Залишилось:</span>
          <span className="word-list-stat-value">{gameStats.wordsLeft}</span>
        </div>
      </div>
    </div>
  );
};

export default WordList;