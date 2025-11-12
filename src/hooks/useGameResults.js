import { useState, useEffect } from "react";

const GAME_RESULTS_KEY = "gameResults";

export const useGameResults = () => {
  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem(GAME_RESULTS_KEY);
    if (!saved) {
      return [];
    }
    
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Помилка завантаження результатів:", e);
      return [];
    }
  });

  const addResult = (result) => {
    setResults(prev => {
      const newResults = [...prev, {
        ...result,
        id: Date.now(),
        date: new Date().toLocaleString()
      }];
      localStorage.setItem(GAME_RESULTS_KEY, JSON.stringify(newResults));
      console.log("💾 Збережено результат гри:", result);
      return newResults;
    });
  };

  const getLevelStats = () => {
    const levelStats = {
      easy: { completed: 0, bestTime: null, totalGames: 0 },
      medium: { completed: 0, bestTime: null, totalGames: 0 },
      hard: { completed: 0, bestTime: null, totalGames: 0 }
    };

    results.forEach(result => {
      const level = result.difficulty;
      levelStats[level].totalGames++;
      
      if (result.progress === 100) {
        levelStats[level].completed++;
        if (!levelStats[level].bestTime || result.time < levelStats[level].bestTime) {
          levelStats[level].bestTime = result.time;
        }
      }
    });

    return levelStats;
  };

  useEffect(() => {
    console.log("📈 Завантажено результатів:", results.length);
  }, [results]);

  return {
    results,
    addResult,
    getLevelStats
  };
};