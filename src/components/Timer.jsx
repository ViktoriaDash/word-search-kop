import React from "react";
import "../styles/Timer.css";

const Timer = ({ gameTime, isGameActive, hasStarted = false }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    if (!hasStarted) return 'Клікніть на літеру щоб почати гру';
    if (isGameActive) return 'Гра триває...';
    return 'Гра призупинена';
  };

  const getTimerClass = () => {
    if (!hasStarted) return 'waiting';
    return isGameActive ? 'active' : 'paused';
  };

  return (
    <div className="timer-container">
      <div className={`timer ${getTimerClass()}`}>
        <span className="timer-icon">⏱️</span>
        <span className="timer-text">{formatTime(gameTime)}</span>
      </div>
      <div className="timer-status">
        {getStatusText()}
      </div>
    </div>
  );
};

export default Timer;