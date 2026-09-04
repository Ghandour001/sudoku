import {
  useCallback,
  useMemo,
  useState,
} from "react";

import { generatePuzzle } from "../logic/generator.js";
import { isValidMove } from "../logic/validator.js";

function createEmptyNotes() {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => []),
  );
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

function cloneNotes(notes) {
  return notes.map((row) =>
    row.map((cell) => [...cell]),
  );
}

function countNumber(board, number) {
  let count = 0;

  for (const row of board) {
    for (const value of row) {
      if (value === number) {
        count += 1;
      }
    }
  }

  return count;
}

function isBoardComplete(board) {
  return board.every((row) =>
    row.every((value) => value !== 0),
  );
}

function boardsEqual(boardA, boardB) {
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (boardA[row][col] !== boardB[row][col]) {
        return false;
      }
    }
  }

  return true;
}

const SCORE_PER_MOVE = {
  easy: 10,
  medium: 15,
  hard: 20,
  expert: 25,
};

const MISTAKE_PENALTY = 20;
const HINT_PENALTY = 30;
const WIN_BONUS = 100;

function getMoveScore(difficulty) {
  return (
    SCORE_PER_MOVE[difficulty] ??
    SCORE_PER_MOVE.medium
  );
}

function createSnapshot(
  board,
  notes,
  score,
) {
  return {
    board: cloneBoard(board),
    notes: cloneNotes(notes),
    score,
  };
}

function generateGame(difficulty) {
  const generated = generatePuzzle(difficulty);

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
    hints: 3,

    isPaused: false,
    isNotesMode: false,
    selectedCell: null,
    gameStatus: "playing",

    history: [],
    future: [],
  };
}

function normalizeSavedGame(savedGame) {
  return {
    puzzle: cloneBoard(savedGame.puzzle),
    solution: cloneBoard(savedGame.solution),
    board: cloneBoard(savedGame.board),
    notes: cloneNotes(savedGame.notes),

    difficulty:
      savedGame.difficulty ?? "medium",

    difficultyScore:
      Number(savedGame.difficultyScore) || 0,

    clues:
      Number(savedGame.clues) || 0,

    score: Math.max(
      0,
      Number(savedGame.score) || 0,
    ),

    mistakes: Math.max(
      0,
      Number(savedGame.mistakes) || 0,
    ),

    hints:
      savedGame.hints === undefined
        ? 3
        : Math.max(
            0,
            Number(savedGame.hints) || 0,
          ),

    isPaused: Boolean(
      savedGame.isPaused,
    ),

    isNotesMode: Boolean(
      savedGame.isNotesMode,
    ),

    selectedCell:
      savedGame.selectedCell ?? null,

    gameStatus:
      savedGame.gameStatus === "won" ||
      savedGame.gameStatus === "lost"
        ? savedGame.gameStatus
        : "playing",

    history: Array.isArray(savedGame.history)
      ? savedGame.history
      : [],

    future: Array.isArray(savedGame.future)
      ? savedGame.future
      : [],
  };
}

function useSudoku(
  initialDifficulty = "medium",
  savedGame = null,
) {
  const initialGame = useMemo(
    () =>
      savedGame
        ? normalizeSavedGame(savedGame)
        : generateGame(initialDifficulty),
    [initialDifficulty, savedGame],
  );

  const [puzzle, setPuzzle] =
    useState(initialGame.puzzle);

  const [solution, setSolution] =
    useState(initialGame.solution);

  const [board, setBoard] =
    useState(initialGame.board);

  const [notes, setNotes] =
    useState(initialGame.notes);

  const [difficulty, setDifficulty] =
    useState(initialGame.difficulty);

  const [difficultyScore, setDifficultyScore] =
    useState(initialGame.difficultyScore);

  const [clues, setClues] =
    useState(initialGame.clues);

  const [score, setScore] =
    useState(initialGame.score);

  const [mistakes, setMistakes] =
    useState(initialGame.mistakes);

  const maxMistakes = 3;

  const [hints, setHints] =
    useState(initialGame.hints);

  const [isPaused, setIsPaused] =
    useState(initialGame.isPaused);

  const [isNotesMode, setIsNotesMode] =
    useState(initialGame.isNotesMode);

  const [selectedCell, setSelectedCell] =
    useState(initialGame.selectedCell);

  const [mistakeCell, setMistakeCell] =
    useState(null);

  const [gameStatus, setGameStatus] =
    useState(initialGame.gameStatus);

  const [history, setHistory] =
    useState(initialGame.history);

  const [future, setFuture] =
    useState(initialGame.future);

  const clearMistake = useCallback(() => {
    setMistakeCell(null);
  }, []);

  const saveHistory = useCallback(() => {
    setHistory((currentHistory) => [
      ...currentHistory,
      createSnapshot(
        board,
        notes,
        score,
      ),
    ]);

    setFuture([]);
  }, [board, notes, score]);

  const newGame = useCallback(
    (newDifficulty = difficulty) => {
      const generated =
        generateGame(newDifficulty);

      setPuzzle(generated.puzzle);
      setSolution(generated.solution);
      setBoard(generated.board);
      setNotes(generated.notes);

      setDifficulty(generated.difficulty);
      setDifficultyScore(
        generated.difficultyScore,
      );
      setClues(generated.clues);

      setScore(0);
      setMistakes(0);
      setHints(3);

      setIsPaused(false);
      setIsNotesMode(false);

      setSelectedCell(null);
      setMistakeCell(null);

      setGameStatus("playing");

      setHistory([]);
      setFuture([]);
    },
    [difficulty],
  );

  const restartGame = useCallback(() => {
    setBoard(cloneBoard(puzzle));
    setNotes(createEmptyNotes());

    setScore(0);
    setMistakes(0);
    setHints(3);

    setIsPaused(false);
    setIsNotesMode(false);

    setSelectedCell(null);
    setMistakeCell(null);

    setGameStatus("playing");

    setHistory([]);
    setFuture([]);
  }, [puzzle]);

  const selectCell = useCallback(
    (row, col) => {
      if (
        gameStatus !== "playing" ||
        isPaused
      ) {
        return;
      }

      setSelectedCell({
        row,
        col,
      });

      setMistakeCell(null);
    },
    [gameStatus, isPaused],
  );

  const removeNumberFromAllRelatedNotes = (
    currentNotes,
    row,
    col,
    number,
  ) => {
    const nextNotes =
      cloneNotes(currentNotes);

    for (let currentCol = 0; currentCol < 9; currentCol += 1) {
      nextNotes[row][currentCol] =
        nextNotes[row][currentCol].filter(
          (value) => value !== number,
        );
    }

    for (let currentRow = 0; currentRow < 9; currentRow += 1) {
      nextNotes[currentRow][col] =
        nextNotes[currentRow][col].filter(
          (value) => value !== number,
        );
    }

    const boxRow =
      Math.floor(row / 3) * 3;

    const boxCol =
      Math.floor(col / 3) * 3;

    for (
      let currentRow = boxRow;
      currentRow < boxRow + 3;
      currentRow += 1
    ) {
      for (
        let currentCol = boxCol;
        currentCol < boxCol + 3;
        currentCol += 1
      ) {
        nextNotes[currentRow][currentCol] =
          nextNotes[currentRow][currentCol].filter(
            (value) => value !== number,
          );
      }
    }

    return nextNotes;
  };

  const enterNumber = useCallback(
    (number) => {
      if (
        !selectedCell ||
        gameStatus !== "playing" ||
        isPaused
      ) {
        return;
      }

      const { row, col } =
        selectedCell;

      if (puzzle[row][col] !== 0) {
        return;
      }

      if (isNotesMode) {
        saveHistory();

        setNotes((currentNotes) => {
          const nextNotes =
            cloneNotes(currentNotes);

          const current =
            nextNotes[row][col];

          if (current.includes(number)) {
            nextNotes[row][col] =
              current.filter(
                (value) => value !== number,
              );
          } else {
            nextNotes[row][col] = [
              ...current,
              number,
            ].sort(
              (a, b) => a - b,
            );
          }

          return nextNotes;
        });

        return;
      }

      const valid = isValidMove(
        board,
        row,
        col,
        number,
      );

      if (!valid) {
        setMistakeCell({
          row,
          col,
        });

        setScore((currentScore) =>
          Math.max(
            0,
            currentScore -
              MISTAKE_PENALTY,
          ),
        );

        setMistakes(
          (currentMistakes) => {
            const next =
              currentMistakes + 1;

            if (next >= maxMistakes) {
              setGameStatus("lost");
            }

            return next;
          },
        );

        return;
      }

      saveHistory();

      const nextBoard =
        cloneBoard(board);

      nextBoard[row][col] =
        number;

      setBoard(nextBoard);
      setMistakeCell(null);

      setScore((currentScore) =>
        currentScore +
        getMoveScore(difficulty),
      );

      setNotes((currentNotes) =>
        removeNumberFromAllRelatedNotes(
          currentNotes,
          row,
          col,
          number,
        ),
      );

      if (
        isBoardComplete(nextBoard) &&
        boardsEqual(
          nextBoard,
          solution,
        )
      ) {
        setScore((currentScore) =>
          currentScore + WIN_BONUS,
        );

        setGameStatus("won");
      }
    },
    [
      selectedCell,
      gameStatus,
      isPaused,
      puzzle,
      isNotesMode,
      board,
      saveHistory,
      solution,
      difficulty,
    ],
  );

  const eraseCell = useCallback(() => {
    if (
      !selectedCell ||
      gameStatus !== "playing" ||
      isPaused
    ) {
      return;
    }

    const { row, col } =
      selectedCell;

    if (puzzle[row][col] !== 0) {
      return;
    }

    if (
      board[row][col] === 0 &&
      notes[row][col].length === 0
    ) {
      return;
    }

    saveHistory();

    setBoard((currentBoard) => {
      const next =
        cloneBoard(currentBoard);

      next[row][col] = 0;

      return next;
    });

    setNotes((currentNotes) => {
      const next =
        cloneNotes(currentNotes);

      next[row][col] = [];

      return next;
    });

    setMistakeCell(null);
  }, [
    selectedCell,
    gameStatus,
    isPaused,
    puzzle,
    board,
    notes,
    saveHistory,
  ]);

  const undo = useCallback(() => {
    if (
      history.length === 0 ||
      gameStatus !== "playing" ||
      isPaused
    ) {
      return;
    }

    const previous =
      history[history.length - 1];

    setFuture((currentFuture) => [
      ...currentFuture,
      createSnapshot(
        board,
        notes,
        score,
      ),
    ]);

    setBoard(
      cloneBoard(previous.board),
    );

    setNotes(
      cloneNotes(previous.notes),
    );

    setScore(previous.score);

    setHistory((currentHistory) =>
      currentHistory.slice(0, -1),
    );

    setMistakeCell(null);
  }, [
    history,
    gameStatus,
    isPaused,
    board,
    notes,
    score,
  ]);

  const redo = useCallback(() => {
    if (
      future.length === 0 ||
      gameStatus !== "playing" ||
      isPaused
    ) {
      return;
    }

    const next =
      future[future.length - 1];

    setHistory((currentHistory) => [
      ...currentHistory,
      createSnapshot(
        board,
        notes,
        score,
      ),
    ]);

    setBoard(
      cloneBoard(next.board),
    );

    setNotes(
      cloneNotes(next.notes),
    );

    setScore(next.score);

    setFuture((currentFuture) =>
      currentFuture.slice(0, -1),
    );

    setMistakeCell(null);
  }, [
    future,
    gameStatus,
    isPaused,
    board,
    notes,
    score,
  ]);

  const useHint = useCallback(() => {
    if (
      hints <= 0 ||
      gameStatus !== "playing" ||
      isPaused
    ) {
      return;
    }

    let target = selectedCell;

    if (
      !target ||
      puzzle[target.row][target.col] !== 0 ||
      board[target.row][target.col] !== 0
    ) {
      target = null;
    }

    if (!target) {
      for (
        let row = 0;
        row < 9 && !target;
        row += 1
      ) {
        for (
          let col = 0;
          col < 9;
          col += 1
        ) {
          if (
            puzzle[row][col] === 0 &&
            board[row][col] === 0
          ) {
            target = {
              row,
              col,
            };

            break;
          }
        }
      }
    }

    if (!target) {
      return;
    }

    saveHistory();

    const { row, col } =
      target;

    const correctNumber =
      solution[row][col];

    setBoard((currentBoard) => {
      const next =
        cloneBoard(currentBoard);

      next[row][col] =
        correctNumber;

      return next;
    });

    setNotes((currentNotes) =>
      removeNumberFromAllRelatedNotes(
        currentNotes,
        row,
        col,
        correctNumber,
      ),
    );

    setSelectedCell(target);
    setMistakeCell(null);

    setHints(
      (currentHints) =>
        currentHints - 1,
    );

    setScore((currentScore) =>
      Math.max(
        0,
        currentScore -
          HINT_PENALTY,
      ),
    );

    const nextBoard =
      cloneBoard(board);

    nextBoard[row][col] =
      correctNumber;

    if (
      isBoardComplete(nextBoard) &&
      boardsEqual(
        nextBoard,
        solution,
      )
    ) {
      setScore((currentScore) =>
        currentScore + WIN_BONUS,
      );

      setGameStatus("won");
    }
  }, [
    hints,
    gameStatus,
    isPaused,
    selectedCell,
    puzzle,
    board,
    solution,
    saveHistory,
  ]);

  const checkBoard = useCallback(() => {
    if (
      gameStatus !== "playing" ||
      isPaused
    ) {
      return {
        complete: false,
        correct: true,
      };
    }

    if (!isBoardComplete(board)) {
      return {
        complete: false,
        correct: true,
      };
    }

    if (
      boardsEqual(
        board,
        solution,
      )
    ) {
      setScore((currentScore) =>
        currentScore + WIN_BONUS,
      );

      setGameStatus("won");

      return {
        complete: true,
        correct: true,
      };
    }

    setMistakeCell(
      selectedCell,
    );

    setScore((currentScore) =>
      Math.max(
        0,
        currentScore -
          MISTAKE_PENALTY,
      ),
    );

    setMistakes(
      (currentMistakes) => {
        const next =
          currentMistakes + 1;

        if (next >= maxMistakes) {
          setGameStatus("lost");
        }

        return next;
      },
    );

    return {
      complete: true,
      correct: false,
    };
  }, [
    board,
    solution,
    gameStatus,
    isPaused,
    selectedCell,
  ]);

  const togglePause = useCallback(() => {
    if (gameStatus !== "playing") {
      return;
    }

    setIsPaused(
      (current) => !current,
    );
  }, [gameStatus]);

  const toggleNotesMode =
    useCallback(() => {
      if (
        gameStatus !== "playing" ||
        isPaused
      ) {
        return;
      }

      setIsNotesMode(
        (current) => !current,
      );
    }, [
      gameStatus,
      isPaused,
    ]);

  const numberStats = useMemo(() => {
    return Array.from(
      { length: 9 },
      (_, index) => {
        const number =
          index + 1;

        const used =
          countNumber(
            board,
            number,
          );

        const remaining =
          Math.max(
            0,
            9 - used,
          );

        let hasLegalPlacement =
          false;

        for (
          let row = 0;
          row < 9 &&
          !hasLegalPlacement;
          row += 1
        ) {
          for (
            let col = 0;
            col < 9;
            col += 1
          ) {
            if (
              board[row][col] === 0 &&
              isValidMove(
                board,
                row,
                col,
                number,
              )
            ) {
              hasLegalPlacement = true;
              break;
            }
          }
        }

        return {
          number,
          used,
          remaining,
          hasLegalPlacement,

          disabled:
            remaining === 0 ||
            !hasLegalPlacement ||
            gameStatus !== "playing" ||
            isPaused,
        };
      },
    );
  }, [
    board,
    gameStatus,
    isPaused,
  ]);

  const selectedInfo = useMemo(() => {
    if (!selectedCell) {
      return null;
    }

    const { row, col } =
      selectedCell;

    return {
      row,
      col,
      value: board[row][col],
      notes: notes[row][col],
      isGiven:
        puzzle[row][col] !== 0,
    };
  }, [
    selectedCell,
    board,
    notes,
    puzzle,
  ]);

  return {
    puzzle,
    solution,
    board,
    notes,

    difficulty,
    difficultyScore,
    clues,

    score,
    mistakes,
    maxMistakes,
    hints,

    isNotesMode,
    isPaused,
    gameStatus,

    selectedCell,
    selectedInfo,
    mistakeCell,

    numberStats,

    newGame,
    restartGame,

    selectCell,
    enterNumber,
    eraseCell,

    undo,
    redo,

    useHint,
    checkBoard,

    togglePause,
    toggleNotesMode,

    clearMistake,

    canUndo:
      history.length > 0,

    canRedo:
      future.length > 0,
  };
}

export default useSudoku;