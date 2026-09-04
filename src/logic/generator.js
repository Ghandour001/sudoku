import { countSolutions } from "./solver.js";
import { ratePuzzle } from "./difficulty.js";

/*
  Create an empty 9x9 board.
*/
function createEmptyBoard() {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

/*
  Shuffle an array using Fisher-Yates.
*/
function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/*
  Check whether a number can be placed.
*/
function isValidMoveLocal(board, row, col, number) {
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === number) {
      return false;
    }
  }

  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === number) {
      return false;
    }
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (
        (r !== row || c !== col) &&
        board[r][c] === number
      ) {
        return false;
      }
    }
  }

  return true;
}

/*
  Randomly fill the board with a complete valid solution.
*/
function fillBoard(board) {
  let emptyRow = -1;
  let emptyCol = -1;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        emptyRow = row;
        emptyCol = col;
        break;
      }
    }

    if (emptyRow !== -1) {
      break;
    }
  }

  if (emptyRow === -1) {
    return true;
  }

  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const number of numbers) {
    if (
      isValidMoveLocal(
        board,
        emptyRow,
        emptyCol,
        number,
      )
    ) {
      board[emptyRow][emptyCol] = number;

      if (fillBoard(board)) {
        return true;
      }

      board[emptyRow][emptyCol] = 0;
    }
  }

  return false;
}

/*
  Generate a completely solved Sudoku.
*/
export function generateSolvedBoard() {
  const board = createEmptyBoard();

  fillBoard(board);

  return board;
}

/*
  Difficulty targets.

  These are not simply clue counts.
  The generated puzzle must also pass the
  corresponding difficulty score range.
*/
const difficultySettings = {
  easy: {
    minClues: 40,
    maxClues: 46,
    minScore: 0,
    maxScore: 44,
  },

  medium: {
    minClues: 34,
    maxClues: 39,
    minScore: 45,
    maxScore: 79,
  },

  hard: {
    minClues: 28,
    maxClues: 33,
    minScore: 80,
    maxScore: 124,
  },

  expert: {
    minClues: 24,
    maxClues: 27,
    minScore: 125,
    maxScore: Infinity,
  },
};;

/*
  Count clues.
*/
function countClues(board) {
  let clues = 0;

  for (const row of board) {
    for (const value of row) {
      if (value !== 0) {
        clues++;
      }
    }
  }

  return clues;
}

/*
  Remove numbers while preserving uniqueness.
*/
function carvePuzzle(solution, settings) {
  const puzzle = solution.map((row) => [...row]);

  const cells = shuffle(
    Array.from({ length: 81 }, (_, index) => index),
  );

  let clues = 81;

  for (const cellIndex of cells) {
    if (clues <= settings.minClues) {
      break;
    }

    const row = Math.floor(cellIndex / 9);
    const col = cellIndex % 9;

    const backup = puzzle[row][col];

    puzzle[row][col] = 0;

    const testBoard = puzzle.map((currentRow) => [
      ...currentRow,
    ]);

    const solutions = countSolutions(testBoard, 2);

    if (solutions === 1) {
      clues--;
    } else {
      puzzle[row][col] = backup;
    }
  }

  return puzzle;
}

/*
  Generate a puzzle of the requested difficulty.

  We may generate several candidates until the puzzle
  actually falls inside the requested difficulty range.
*/
export function generatePuzzle(difficulty = "medium") {
  const settings =
    difficultySettings[difficulty] ??
    difficultySettings.medium;

  const maxAttempts = 20;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const solution = generateSolvedBoard();

    const puzzle = carvePuzzle(solution, settings);

    const clues = countClues(puzzle);

    /*
      Don't even rate a puzzle if its clue count
      is outside the intended range.
    */
    if (
      clues < settings.minClues ||
      clues > settings.maxClues
    ) {
      continue;
    }

    const rating = ratePuzzle(puzzle);

    if (
      rating.score >= settings.minScore &&
      rating.score <= settings.maxScore
    ) {
      return {
        puzzle,
        solution,
        difficulty: rating.difficulty,
        score: rating.score,
        clues,
        techniques: rating.techniques,
      };
    }
  }

  /*
  Fallback.

  If we could not find a puzzle that perfectly matches
  the requested difficulty within the allowed attempts,
  still return a valid puzzle.

  IMPORTANT:
  The player's requested difficulty must remain the
  selected difficulty. We must NOT replace Expert with
  Medium/Hard just because the fallback rating differs.
*/

const solution = generateSolvedBoard();
const puzzle = carvePuzzle(solution, settings);
const rating = ratePuzzle(puzzle);

return {
  puzzle,
  solution,

  // Keep the difficulty the player actually selected.
  difficulty,

  score: rating.score,
  clues: countClues(puzzle),
  techniques: rating.techniques,
};
}