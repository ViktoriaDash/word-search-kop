import { useState, useEffect } from "react";
import Header from "../components/Header";
import GameBoard from "../components/GameBoard";
import WordList from "../components/WordList";
import Button from "../components/Button";
import Timer from "../components/Timer";
import SettingsForm from "../components/SettingsForm";
import GameOver from "../components/GameOver";
import { useGameSettings } from "../hooks/useGameSettings";
import { useGame } from "../hooks/useGame";
import { useGameResults } from "../hooks/useGameResults";
import "../styles/GamePage.css";

export default function GamePage({ onFinish }) {
  const { settings, updateSettings, completedLevels, completeLevel } = useGameSettings();
  const game = useGame(settings);
  const { addResult } = useGameResults();

  const [isModalOpen, setModalOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const handleFinish = () => {
    game.finishGame();
    setModalOpen(true);
  };

  const handleSaveSettings = (data) => {
    let boardSize;

    switch (data.difficulty) {
      case "easy":
        boardSize = 5;
        break;
      case "medium":
        boardSize = 6;
        break;
      case "hard":
        boardSize = 8;
        break;
      default:
        boardSize = 5;
    }

    const newSettings = { difficulty: data.difficulty, boardSize };
    updateSettings(newSettings);
    game.updateGameSettings(newSettings);
    setShowSettings(false);
    setGameCompleted(false);
    setGameStarted(false);
  };

  const handleOpenSettingsAfterCompletion = () => {
    setShowSettings(true);
  };

  const isLastLevel = settings.difficulty === "hard";

  useEffect(() => {
    if (game.foundWords.length === game.words.length && 
        game.words.length > 0 && 
        !gameCompleted) {
      console.log("🎯 РІВЕНЬ ЗАВЕРШЕНО! Додаємо до пройдених:", settings.difficulty);
      setGameCompleted(true);
      completeLevel(settings.difficulty);
      game.finishGame();
 
      addResult({
        difficulty: settings.difficulty,
        boardSize: settings.boardSize,
        foundWords: game.foundWords.length,
        totalWords: game.words.length,
        time: game.gameTime,
        progress: game.gameStats.progress
      });
    }
  }, [game.foundWords.length, game.words.length, settings.difficulty, completeLevel, gameCompleted, addResult, game.gameStats.progress, game.gameTime]);

  useEffect(() => {
    if (game.isGameActive && !gameStarted) {
      setGameStarted(true);
    }
  }, [game.isGameActive, gameStarted]);

  return (
    <div className="game-page-container">
      <Header
        title={`Гра: Пошук слова — ${
          settings?.difficulty === "easy"
            ? "Легкий"
            : settings?.difficulty === "medium"
            ? "Середній"
            : "Складний"
        } (${settings?.boardSize}×${settings?.boardSize})`}
      />

      <div className="game-controls">
        <Button
          label="Налаштування гри"
          onClick={() => setShowSettings((prev) => !prev)}
        />
         
        {/* Нова кнопка "Скасувати" */}
        {game.selectedCells.length > 0 && (
          <Button
            label="↶ Скасувати"
            onClick={game.undoLastSelection}
            className="undo-btn"
            title="Скасувати останній клік"
          />
        )}
      </div>

      {showSettings && (
        <SettingsForm 
          onSave={handleSaveSettings} 
          initialSettings={settings}
          completedLevels={completedLevels}
        />
      )}

      <div className="game-page-layout">
        <GameBoard
          board={game.board}
          selectedCells={game.selectedCells}
          foundWords={game.foundWords}
          onSelect={game.handleCellSelect}
          onClear={game.clearSelection}
        />
        <div className="game-page-side-panel">
          <WordList
            words={game.words}
            foundWords={game.foundWords}
            gameStats={game.gameStats}
          />
          
          <Timer 
            gameTime={game.gameTime} 
            isGameActive={game.isGameActive}
            hasStarted={gameStarted}
          />
          
          {gameCompleted && (
            <div className="level-completed">
              <p>🎉 Рівень пройдено! 🎉</p>
              <p>Всі слова знайдено!</p>
              {!isLastLevel && (
                <div className="completion-actions">
                  <p>Оберіть наступний рівень в налаштуваннях!</p>
                  <Button 
                    label="Відкрити налаштування" 
                    onClick={handleOpenSettingsAfterCompletion}
                    className="settings-btn"
                  />
                </div>
              )}
              {isLastLevel && (
                <div className="final-completion">
                  <p>🏆 Вітаємо! Ви пройшли всі рівні! 🏆</p>
                </div>
              )}
            </div>
          )}
          
          <Button label="Завершити гру" onClick={handleFinish} />
        </div>
      </div>

      <GameOver
        isOpen={isModalOpen}
        stats={{
          difficulty: settings.difficulty,
          boardSize: settings.boardSize,
          foundWords: game.foundWords.length,
          totalWords: game.words.length,
          time: game.gameTime,
          progress: game.gameStats.progress
        }}
        onSaveResult={addResult}
        onRestart={() => {
          setModalOpen(false);
          game.startGame();
          setGameCompleted(false);
          setGameStarted(false);
        }}
        onClose={() => {
          setModalOpen(false);
          onFinish();
        }}
      />
    </div>
  );
}