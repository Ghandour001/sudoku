import { useCallback, useMemo, useReducer } from "react";
import { generatePuzzle } from "../logic/generator.js";
import { isBoardComplete, boardsEqual } from "../logic/validator.js";

const SCORE_PER_MOVE = {
  easy: 10,
  medium: 15,
  hard: 20,
  expert: 25,
};

const MISTAKE_PENALTY = 20;
const HINT_PENALTY = 30;
const WIN_BONUS = 100;

function createEmptyNotes() {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => []),
  );
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

function cloneNotes(notes) {
  return notes.map((row) => row.map((cell) => [...cell]));
}

function countNumber(board, number) {
  let count = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === number) count++;
    }
  }
  return count;
}

function getMoveScore(difficulty) {
  return SCORE_PER_MOVE[difficulty] ?? SCORE_PER_MOVE.medium;
}

function removeNumberFromRelatedNotes(currentNotes, row, col, number) {
  const nextNotes = cloneNotes(currentNotes);

  // Row & Column
  for (let i = 0; i < 9; i++) {
    nextNotes[row][i] = nextNotes[row][i].filter((v) => v !== number);
    nextNotes[i][col] = nextNotes[i][col].filter((v) => v !== number);
  }

  // 3x3 Box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      nextNotes[r][c] = nextNotes[r][c].filter((v) => v !== number);
    }
  }

  return nextNotes;
}

function createGameInitialState(initialDifficulty = "medium", savedGame = null) {
  if (savedGame) {
    return {
      puzzle: cloneBoard(savedGame.puzzle),
      solution: cloneBoard(savedGame.solution),
      board: cloneBoard(savedGame.board),
      notes: cloneNotes(savedGame.notes),
      difficulty: savedGame.difficulty ?? "medium",
      difficultyScore: Number(savedGame.difficultyScore) || 0,
      clues: Number(savedGame.clues) || 0,
      score: Math.max(0, Number(savedGame.score) || 0),
      mistakes: Math.max(0, Number(savedGame.mistakes) || 0),
      maxMistakes: Math.max(1, Number(savedGame.maxMistakes) || 3),
      hints: savedGame.hints !== undefined ? Math.max(0, Number(savedGame.hints)) : 3,
      isPaused: Boolean(savedGame.isPaused),
      isNotesMode: Boolean(savedGame.isNotesMode),
      selectedCell: savedGame.selectedCell ?? null,
      mistakeCell: null,
      checkFeedback: null,
      gameStatus: savedGame.gameStatus === "won" || savedGame.gameStatus === "lost" ? savedGame.gameStatus : "playing",
      history: Array.isArray(savedGame.history) ? savedGame.history : [],
      future: Array.isArray(savedGame.future) ? savedGame.future : [],
    };
  }

  const generated = generatePuzzle(initialDifficulty);

  return {
    puzzle: cloneBoard(generated.puzzle),
    solution: cloneBoard(generated.solution),
    board: cloneBoard(generated.puzzle),
    notes: createEmptyNotes(),
    difficulty: generated.difficulty,
    difficultyScore: generated.score,
    clues: generated.clues,
    score: 0,
    mistakes: 0,
    maxMistakes: 3,
    hints: 3,
    isPaused: false,
    isNotesMode: false,
    selectedCell: null,
    mistakeCell: null,
    checkFeedback: null,
    gameStatus: "playing",
    history: [],
    future: [],
  };
}

function gameReducer(state, action) {
  switch (action.type) {
    case "SELECT_CELL": {
      if (state.gameStatus !== "playing" || state.isPaused) return state;
      const { row, col } = action.payload;
      if (row < 0 || row > 8 || col < 0 || col > 8) return state;

      return {
        ...state,
        selectedCell: { row, col },
        mistakeCell: null,
        checkFeedback: null,
      };
    }

    case "MOVE_SELECTION": {
      if (state.gameStatus !== "playing" || state.isPaused) return state;
      const current = state.selectedCell ?? { row: 4, col: 4 };
      const nextRow = Math.max(0, Math.min(8, current.row + action.payload.dRow));
      const nextCol = Math.max(0, Math.min(8, current.col + action.payload.dCol));

      return {
        ...state,
        selectedCell: { row: nextRow, col: nextCol },
        mistakeCell: null,
        checkFeedback: null,
      };
    }

    case "ENTER_NUMBER": {
      if (!state.selectedCell || state.gameStatus !== "playing" || state.isPaused) {
        return state;
      }

      const { row, col } = state.selectedCell;
      const { number } = action.payload;

      // Cannot modify given clue
      if (state.puzzle[row][col] !== 0) {
        return state;
      }

      // Notes mode: toggle note
      if (state.isNotesMode) {
        const currentNotes = state.notes[row][col];
        const nextNotes = cloneNotes(state.notes);

        if (currentNotes.includes(number)) {
          nextNotes[row][col] = currentNotes.filter((v) => v !== number);
        } else {
          nextNotes[row][col] = [...currentNotes, number].sort((a, b) => a - b);
        }

        const snapshot = {
          board: cloneBoard(state.board),
          notes: cloneNotes(state.notes),
          score: state.score,
        };

        return {
          ...state,
          notes: nextNotes,
          history: [...state.history, snapshot],
          future: [],
          checkFeedback: null,
        };
      }

      // Already has this exact number placed
      if (state.board[row][col] === number) {
        return state;
      }

      // Check against solution
      const isCorrect = state.solution[row][col] === number;

      if (!isCorrect) {
        const nextMistakes = state.mistakes + 1;
        const nextScore = Math.max(0, state.score - MISTAKE_PENALTY);
        const isGameOver = nextMistakes >= state.maxMistakes;

        return {
          ...state,
          mistakes: nextMistakes,
          score: nextScore,
          mistakeCell: { row, col },
          gameStatus: isGameOver ? "lost" : "playing",
          checkFeedback: null,
        };
      }

      // Correct move
      const nextBoard = cloneBoard(state.board);
      nextBoard[row][col] = number;

      const nextNotes = removeNumberFromRelatedNotes(state.notes, row, col, number);
      nextNotes[row][col] = []; // Clear notes for this cell

      const moveScore = getMoveScore(state.difficulty);
      let nextScore = state.score + moveScore;

      const complete = isBoardComplete(nextBoard);
      const isWon = complete && boardsEqual(nextBoard, state.solution);

      if (isWon) {
        nextScore += WIN_BONUS;
      }

      const snapshot = {
        board: cloneBoard(state.board),
        notes: cloneNotes(state.notes),
        score: state.score,
      };

      return {
        ...state,
        board: nextBoard,
        notes: nextNotes,
        score: nextScore,
        gameStatus: isWon ? "won" : "playing",
        mistakeCell: null,
        checkFeedback: null,
        history: [...state.history, snapshot],
        future: [],
      };
    }

    case "ERASE_CELL": {
      if (!state.selectedCell || state.gameStatus !== "playing" || state.isPaused) {
        return state;
      }

      const { row, col } = state.selectedCell;
      if (state.puzzle[row][col] !== 0) return state;

      const hasValue = state.board[row][col] !== 0;
      const hasNotes = state.notes[row][col].length > 0;

      if (!hasValue && !hasNotes) return state;

      const snapshot = {
        board: cloneBoard(state.board),
        notes: cloneNotes(state.notes),
        score: state.score,
      };

      const nextBoard = cloneBoard(state.board);
      nextBoard[row][col] = 0;

      const nextNotes = cloneNotes(state.notes);
      nextNotes[row][col] = [];

      return {
        ...state,
        board: nextBoard,
        notes: nextNotes,
        mistakeCell: null,
        checkFeedback: null,
        history: [...state.history, snapshot],
        future: [],
      };
    }

    case "UNDO": {
      if (state.history.length === 0 || state.gameStatus !== "playing" || state.isPaused) {
        return state;
      }

      const previous = state.history[state.history.length - 1];
      const snapshot = {
        board: cloneBoard(state.board),
        notes: cloneNotes(state.notes),
        score: state.score,
      };

      return {
        ...state,
        board: cloneBoard(previous.board),
        notes: cloneNotes(previous.notes),
        score: previous.score,
        history: state.history.slice(0, -1),
        future: [...state.future, snapshot],
        mistakeCell: null,
        checkFeedback: null,
      };
    }

    case "REDO": {
      if (state.future.length === 0 || state.gameStatus !== "playing" || state.isPaused) {
        return state;
      }

      const next = state.future[state.future.length - 1];
      const snapshot = {
        board: cloneBoard(state.board),
        notes: cloneNotes(state.notes),
        score: state.score,
      };

      return {
        ...state,
        board: cloneBoard(next.board),
        notes: cloneNotes(next.notes),
        score: next.score,
        history: [...state.history, snapshot],
        future: state.future.slice(0, -1),
        mistakeCell: null,
        checkFeedback: null,
      };
    }

    case "USE_HINT": {
      if (state.hints <= 0 || state.gameStatus !== "playing" || state.isPaused) {
        return state;
      }

      let targetRow = -1;
      let targetCol = -1;

      // If a cell is currently selected and needs solving
      if (
        state.selectedCell &&
        state.puzzle[state.selectedCell.row][state.selectedCell.col] === 0 &&
        state.board[state.selectedCell.row][state.selectedCell.col] !== state.solution[state.selectedCell.row][state.selectedCell.col]
      ) {
        targetRow = state.selectedCell.row;
        targetCol = state.selectedCell.col;
      } else {
        // Find first unsolved cell
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (state.board[r][c] !== state.solution[r][c]) {
              targetRow = r;
              targetCol = c;
              break;
            }
          }
          if (targetRow !== -1) break;
        }
      }

      if (targetRow === -1) return state;

      const correctNum = state.solution[targetRow][targetCol];
      const nextBoard = cloneBoard(state.board);
      nextBoard[targetRow][targetCol] = correctNum;

      const nextNotes = removeNumberFromRelatedNotes(state.notes, targetRow, targetCol, correctNum);
      nextNotes[targetRow][targetCol] = [];

      const nextScore = Math.max(0, state.score - HINT_PENALTY);
      const isWon = isBoardComplete(nextBoard) && boardsEqual(nextBoard, state.solution);

      const snapshot = {
        board: cloneBoard(state.board),
        notes: cloneNotes(state.notes),
        score: state.score,
      };

      return {
        ...state,
        board: nextBoard,
        notes: nextNotes,
        hints: state.hints - 1,
        score: isWon ? nextScore + WIN_BONUS : nextScore,
        gameStatus: isWon ? "won" : "playing",
        selectedCell: { row: targetRow, col: targetCol },
        mistakeCell: null,
        checkFeedback: null,
        history: [...state.history, snapshot],
        future: [],
      };
    }

    case "CHECK_BOARD": {
      if (state.gameStatus !== "playing" || state.isPaused) return state;

      let mistakesFound = 0;
      let firstMistake = null;

      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const val = state.board[r][c];
          if (val !== 0 && state.puzzle[r][c] === 0 && val !== state.solution[r][c]) {
            mistakesFound++;
            if (!firstMistake) {
              firstMistake = { row: r, col: c };
            }
          }
        }
      }

      if (mistakesFound > 0) {
        return {
          ...state,
          mistakeCell: firstMistake,
          checkFeedback: {
            type: "warning",
            text: `Found ${mistakesFound} incorrect ${mistakesFound === 1 ? "cell" : "cells"}.`,
          },
        };
      }

      const complete = isBoardComplete(state.board);
      if (complete) {
        return {
          ...state,
          gameStatus: "won",
          score: state.score + WIN_BONUS,
          checkFeedback: {
            type: "success",
            text: "Puzzle solved successfully!",
          },
        };
      }

      return {
        ...state,
        checkFeedback: {
          type: "success",
          text: "Looking great! No mistakes on the board so far.",
        },
      };
    }

    case "TOGGLE_PAUSE": {
      if (state.gameStatus !== "playing") return state;
      return {
        ...state,
        isPaused: !state.isPaused,
        checkFeedback: null,
      };
    }

    case "TOGGLE_NOTES_MODE": {
      if (state.gameStatus !== "playing" || state.isPaused) return state;
      return {
        ...state,
        isNotesMode: !state.isNotesMode,
      };
    }

    case "CLEAR_MISTAKE": {
      return {
        ...state,
        mistakeCell: null,
      };
    }

    case "CLEAR_CHECK_FEEDBACK": {
      return {
        ...state,
        checkFeedback: null,
      };
    }

    case "RESTART_GAME": {
      return {
        ...state,
        board: cloneBoard(state.puzzle),
        notes: createEmptyNotes(),
        score: 0,
        mistakes: 0,
        hints: 3,
        isPaused: false,
        isNotesMode: false,
        selectedCell: null,
        mistakeCell: null,
        checkFeedback: null,
        gameStatus: "playing",
        history: [],
        future: [],
      };
    }

    case "NEW_GAME": {
      return createGameInitialState(action.payload.difficulty ?? state.difficulty);
    }

    default:
      return state;
  }
}

function useSudoku(initialDifficulty = "medium", savedGame = null) {
  const [state, dispatch] = useReducer(
    gameReducer,
    null,
    () => createGameInitialState(initialDifficulty, savedGame),
  );

  const selectCell = useCallback((row, col) => {
    dispatch({ type: "SELECT_CELL", payload: { row, col } });
  }, []);

  const moveSelection = useCallback((dRow, dCol) => {
    dispatch({ type: "MOVE_SELECTION", payload: { dRow, dCol } });
  }, []);

  const enterNumber = useCallback((number) => {
    dispatch({ type: "ENTER_NUMBER", payload: { number } });
  }, []);

  const eraseCell = useCallback(() => {
    dispatch({ type: "ERASE_CELL" });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  const applyHint = useCallback(() => {
    dispatch({ type: "USE_HINT" });
  }, []);

  const checkBoard = useCallback(() => {
    dispatch({ type: "CHECK_BOARD" });
  }, []);

  const togglePause = useCallback(() => {
    dispatch({ type: "TOGGLE_PAUSE" });
  }, []);

  const toggleNotesMode = useCallback(() => {
    dispatch({ type: "TOGGLE_NOTES_MODE" });
  }, []);

  const clearMistake = useCallback(() => {
    dispatch({ type: "CLEAR_MISTAKE" });
  }, []);

  const clearCheckFeedback = useCallback(() => {
    dispatch({ type: "CLEAR_CHECK_FEEDBACK" });
  }, []);

  const restartGame = useCallback(() => {
    dispatch({ type: "RESTART_GAME" });
  }, []);

  const newGame = useCallback((difficulty) => {
    dispatch({ type: "NEW_GAME", payload: { difficulty } });
  }, []);

  const numberStats = useMemo(() => {
    return Array.from({ length: 9 }, (_, index) => {
      const number = index + 1;
      const used = countNumber(state.board, number);
      const remaining = Math.max(0, 9 - used);

      return {
        number,
        used,
        remaining,
        // In Notes mode, never disable so player can write candidate notes
        disabled:
          state.gameStatus !== "playing" ||
          state.isPaused ||
          (!state.isNotesMode && remaining === 0),
      };
    });
  }, [state.board, state.gameStatus, state.isPaused, state.isNotesMode]);

  const selectedInfo = useMemo(() => {
    if (!state.selectedCell) return null;
    const { row, col } = state.selectedCell;
    return {
      row,
      col,
      value: state.board[row][col],
      notes: state.notes[row][col],
      isGiven: state.puzzle[row][col] !== 0,
    };
  }, [state.selectedCell, state.board, state.notes, state.puzzle]);

  return {
    ...state,
    canUndo: state.history.length > 0,
    canRedo: state.future.length > 0,
    numberStats,
    selectedInfo,

    selectCell,
    moveSelection,
    enterNumber,
    eraseCell,
    undo,
    redo,
    applyHint,
    checkBoard,
    togglePause,
    toggleNotesMode,
    clearMistake,
    clearCheckFeedback,
    restartGame,
    newGame,
  };
}

export default useSudoku;