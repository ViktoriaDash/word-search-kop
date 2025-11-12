import { useReducer, useCallback, useEffect, useMemo } from "react";

const WORDS_BY_SIZE = {
  5: ["РИБА", "КОМАР", "ЛІЙКА"],
  6: ["РИБА", "МИША", "ВІЗОК", "КОМАР"],
  8: ["РИБА", "МИША", "ЛІЙКА", "ВІЗОК", "КОМАР", "СОНЦЕ"]
};

const LETTERS = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЮЯ";

const generateBoard = (size, words) => {
  console.log(`Генерація поля ${size}x${size} з словами:`, words);
  
  const board = Array.from({ length: size }, () => Array(size).fill(""));

  const directions = [
    [0, 1],   // →
    [1, 0],   // ↓
    [1, 1],   // ↘
    [1, -1]   // ↙
  ];

  const canPlace = (word, row, col, dr, dc) => {
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= size || c < 0 || c >= size) return false;
      if (board[r][c] && board[r][c] !== word[i]) return false;
    }
    return true;
  };

  const placeWord = (word) => {
    let placed = false;
    const maxTries = 500; 

    for (let tries = 0; tries < maxTries && !placed; tries++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

      if (canPlace(word, row, col, dir[0], dir[1])) {
        console.log(`Розміщуємо слово "${word}" на позиції (${row},${col}) з напрямком [${dir}]`);
        for (let i = 0; i < word.length; i++) {
          const r = row + dir[0] * i;
          const c = col + dir[1] * i;
          board[r][c] = word[i];
        }
        placed = true;
      }
    }
    
    if (!placed) {
      console.warn(`Не вдалося розмістити слово "${word}" звичайним способом, пробуємо примусово...`);
      
      for (const dir of directions) {
        for (let row = 0; row < size && !placed; row++) {
          for (let col = 0; col < size && !placed; col++) {
            if (canPlace(word, row, col, dir[0], dir[1])) {
              console.log(`Примусово розміщуємо слово "${word}" на позиції (${row},${col})`);
              for (let i = 0; i < word.length; i++) {
                const r = row + dir[0] * i;
                const c = col + dir[1] * i;
                board[r][c] = word[i];
              }
              placed = true;
              break;
            }
          }
          if (placed) break;
        }
        if (placed) break;
      }
    }
    
    if (!placed) {
      console.error(`❌ НЕ ВДАЛОСЯ РОЗМІСТИТИ СЛОВО: "${word}"`);
    }
    
    return placed;
  };


  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  
  console.log("Слова для розміщення (відсортовані):", sortedWords);

  const placedWords = [];
  const failedWords = [];
  
  for (const word of sortedWords) {
    const placed = placeWord(word);
    if (placed) {
      placedWords.push(word);
    } else {
      failedWords.push(word);
    }
  }

  if (failedWords.length > 0) {
    console.warn("Слова, які не вдалося розмістити:", failedWords);
    console.log("Пробуємо перегенерувати поле...");
  }

  console.log("Успішно розміщені слова:", placedWords);
  console.log("Не розміщені слова:", failedWords);

  let emptyCells = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!board[r][c]) {
        board[r][c] = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        emptyCells++;
      }
    }
  }
  
  console.log(`Заповнено ${emptyCells} порожніх клітинок`);

  
  console.log("Фінальне поле:");
  for (let r = 0; r < size; r++) {
    console.log(board[r].join(' '));
  }

  return board;
};

const ACTIONS = {
  START_GAME: "START_GAME",
  FINISH_GAME: "FINISH_GAME",
  ADD_FOUND_WORD: "ADD_FOUND_WORD",
  SET_SELECTED_CELLS: "SET_SELECTED_CELLS",
  CLEAR_SELECTION: "CLEAR_SELECTION",
  INCREMENT_TIME: "INCREMENT_TIME",
  UPDATE_SETTINGS: "UPDATE_SETTINGS",
  RESET_TIME: "RESET_TIME",
  START_TIMER: "START_TIMER",
  UNDO_LAST_SELECTION: "UNDO_LAST_SELECTION" 
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.START_GAME:
      return {
        ...state,
        board: generateBoard(state.boardSize, state.words),
        foundWords: [],
        selectedCells: [],
        gameTime: 0,
        isGameActive: false
      };
    case ACTIONS.FINISH_GAME:
      return { ...state, isGameActive: false };
    case ACTIONS.ADD_FOUND_WORD:
      return {
        ...state,
        foundWords: [...state.foundWords, action.payload],
        selectedCells: []
      };
    case ACTIONS.SET_SELECTED_CELLS:
      return { ...state, selectedCells: action.payload };
    case ACTIONS.CLEAR_SELECTION:
      return { ...state, selectedCells: [] };
    case ACTIONS.INCREMENT_TIME:
      return { ...state, gameTime: state.gameTime + 1 };
    case ACTIONS.UPDATE_SETTINGS:
      const { boardSize, words } = action.payload;
      return {
        ...state,
        boardSize,
        words,
        board: generateBoard(boardSize, words),
        foundWords: [],
        selectedCells: [],
        gameTime: 0,
        isGameActive: false
      };
    case ACTIONS.RESET_TIME:
      return { ...state, gameTime: 0 };
    case ACTIONS.START_TIMER:
      return { ...state, isGameActive: true };
    case ACTIONS.UNDO_LAST_SELECTION:
      if (state.selectedCells.length > 0) {
        const newSelectedCells = state.selectedCells.slice(0, -1);
        return {
          ...state,
          selectedCells: newSelectedCells
        };
      }
      return state;
    default:
      return state;
  }
}

export const useGame = (settings = {}) => {
  const boardSize = settings?.boardSize || 5;
  const words = WORDS_BY_SIZE[boardSize] || WORDS_BY_SIZE[5];

  const [state, dispatch] = useReducer(reducer, {
    boardSize,
    board: generateBoard(boardSize, words),
    words,
    foundWords: [],
    selectedCells: [],
    gameTime: 0,
    isGameActive: false
  });

  // Таймер
  useEffect(() => {
    let interval;
    if (state.isGameActive) {
      interval = setInterval(() => {
        dispatch({ type: ACTIONS.INCREMENT_TIME });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isGameActive]);

  const startGame = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_TIME });
    dispatch({ type: ACTIONS.START_GAME });
  }, []);

  const finishGame = useCallback(() => {
    dispatch({ type: ACTIONS.FINISH_GAME });
  }, []);

  const startTimer = useCallback(() => {
    if (!state.isGameActive) {
      dispatch({ type: ACTIONS.START_TIMER });
    }
  }, [state.isGameActive]);

  const resetTime = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_TIME });
  }, []);

  const updateGameSettings = useCallback((newSettings) => {
    const boardSize = newSettings.boardSize;
    const words = WORDS_BY_SIZE[boardSize] || WORDS_BY_SIZE[5];
    
    dispatch({
      type: ACTIONS.UPDATE_SETTINGS,
      payload: { boardSize, words }
    });
  }, []);

  const checkWord = useCallback(
    (cells) => {
      const word = cells.map(({ row, col }) => state.board[row][col]).join("");
      if (state.words.includes(word) && !state.foundWords.includes(word)) {
        dispatch({ type: ACTIONS.ADD_FOUND_WORD, payload: word });
      }
    },
    [state.words, state.foundWords, state.board]
  );

  const handleCellSelect = useCallback(
    (row, col) => {
      if (!state.isGameActive && state.selectedCells.length === 0) {
        dispatch({ type: ACTIONS.START_TIMER });
      }

      const newSel = [...state.selectedCells, { row, col }];
      dispatch({ type: ACTIONS.SET_SELECTED_CELLS, payload: newSel });

      if (newSel.length > 1) checkWord(newSel);
    },
    [state.selectedCells, state.isGameActive, checkWord]
  );

  const clearSelection = useCallback(
    () => dispatch({ type: ACTIONS.CLEAR_SELECTION }),
    []
  );

 
  const undoLastSelection = useCallback(() => {
    dispatch({ type: ACTIONS.UNDO_LAST_SELECTION });
  }, []);

  const gameStats = useMemo(
    () => ({
      progress: Math.round(
        (state.foundWords.length / state.words.length) * 100
      ),
      wordsLeft: state.words.length - state.foundWords.length
    }),
    [state.foundWords.length, state.words.length]
  );

  return {
    board: state.board,
    words: state.words,
    foundWords: state.foundWords,
    selectedCells: state.selectedCells,
    gameTime: state.gameTime,
    isGameActive: state.isGameActive,
    boardSize: state.boardSize,
    gameStats,
    startGame,
    finishGame,
    startTimer,
    resetTime,
    updateGameSettings,
    handleCellSelect,
    clearSelection,
    undoLastSelection 
  };
};