import { useMemo } from "react";
import "../styles/GameBoard.css";

export default function GameBoard({ board, selectedCells, onSelect, onClear, foundWords }) {
  const boardSize = board.length;

  const isPartOfFoundWord = useMemo(() => {
    const foundCells = new Set();
    
    foundWords.forEach(word => {
      for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
          const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
          
          for (const [dr, dc] of directions) {
            let found = true;
            const cellsInWord = [];
            
            for (let i = 0; i < word.length; i++) {
              const nr = r + dr * i;
              const nc = c + dc * i;
              
              if (nr >= boardSize || nc >= boardSize || nc < 0 || board[nr][nc] !== word[i]) {
                found = false;
                break;
              }
              cellsInWord.push(`${nr},${nc}`);
            }
            
            if (found) {
              cellsInWord.forEach(cell => foundCells.add(cell));
            }
          }
        }
      }
    });
    
    return foundCells;
  }, [foundWords, board, boardSize]);

  const handleCellClick = (row, col) => {
    onSelect(row, col);
  };

  return (
    <div className="game-board-container">
      <div className={`game-board-grid size-${boardSize}`}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected = selectedCells.some(
              (selected) => selected.row === rowIndex && selected.col === colIndex
            );
            const isFound = isPartOfFoundWord.has(`${rowIndex},${colIndex}`);
            
            let cellClass = "game-board-cell";
            if (isFound) {
              cellClass += " found";
            } else if (isSelected) {
              cellClass += " selected";
            }

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cellClass}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}