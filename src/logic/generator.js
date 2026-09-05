import { countSolutions, solveSudoku } from "./solver.js";
import { ratePuzzle } from "./difficulty.js";

function createEmptyBoard() {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/*
  Fill 3x3 block with shuffled numbers 1-9
*/
function fillBox(board, startRow, startCol) {
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let idx = 0;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      board[startRow + r][startCol + c] = numbers[idx++];
    }
  }
}

/*
  Generate a completely solved Sudoku board fast by filling
  independent diagonal 3x3 boxes, then solving the rest.
*/
export function generateSolvedBoard() {
  const board = createEmptyBoard();

  // Diagonal boxes are mutually independent
  fillBox(board, 0, 0);
  fillBox(board, 3, 3);
  fillBox(board, 6, 6);

  solveSudoku(board);
  return board;
}

const difficultySettings = {
  easy: {
    minClues: 38,
    maxClues: 44,
    minScore: 0,
    maxScore: 49,
  },
  medium: {
    minClues: 30,
    maxClues: 36,
    minScore: 40,
    maxScore: 84,
  },
  hard: {
    minClues: 26,
    maxClues: 29,
    minScore: 75,
    maxScore: 130,
  },
  expert: {
    minClues: 22,
    maxClues: 26,
    minScore: 110,
    maxScore: Infinity,
  },
};

function countClues(board) {
  let clues = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== 0) clues++;
    }
  }
  return clues;
}

/*
  Remove numbers while preserving uniqueness.
*/
function carvePuzzle(solution, targetClues) {
  const puzzle = solution.map((row) => [...row]);
  const cells = shuffle(Array.from({ length: 81 }, (_, i) => i));

  let clues = 81;

  for (const cellIndex of cells) {
    if (clues <= targetClues) break;

    const row = Math.floor(cellIndex / 9);
    const col = cellIndex % 9;
    const backup = puzzle[row][col];

    puzzle[row][col] = 0;

    const testBoard = puzzle.map((r) => [...r]);
    if (countSolutions(testBoard, 2) === 1) {
      clues--;
    } else {
      puzzle[row][col] = backup;
    }
  }

  return puzzle;
}

/*
  Generate a puzzle matching the requested difficulty.
*/
export function generatePuzzle(difficulty = "medium") {
  const settings = difficultySettings[difficulty] ?? difficultySettings.medium;
  const targetClues = Math.floor((settings.minClues + settings.maxClues) / 2);
  const maxAttempts = 5;

  let bestResult = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const solution = generateSolvedBoard();
    const puzzle = carvePuzzle(solution, targetClues);
    const clues = countClues(puzzle);
    const rating = ratePuzzle(puzzle);

    const result = {
      puzzle,
      solution,
      difficulty,
      score: rating.score,
      clues,
      techniques: rating.techniques,
    };

    if (
      clues >= settings.minClues &&
      clues <= settings.maxClues &&
      rating.score >= settings.minScore &&
      rating.score <= settings.maxScore
    ) {
      return result;
    }

    if (!bestResult || Math.abs(clues - targetClues) < Math.abs(bestResult.clues - targetClues)) {
      bestResult = result;
    }
  }

  // Fallback to best found
  return bestResult;
}