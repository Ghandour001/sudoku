import { isValidMove } from "./validator.js";

/*
  Find the empty cell with the fewest possible candidates.

  This is called the MRV heuristic:
  Minimum Remaining Values.

  It makes Sudoku solving dramatically faster,
  especially for difficult puzzles.
*/
function findBestEmptyCell(board) {
  let bestCell = null;
  let bestCandidates = null;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== 0) {
        continue;
      }

      const candidates = [];

      for (let number = 1; number <= 9; number++) {
        if (isValidMove(board, row, col, number)) {
          candidates.push(number);
        }
      }

      // No possible number -> this path is impossible.
      if (candidates.length === 0) {
        return {
          row,
          col,
          candidates: [],
        };
      }

      /*
        This is the most constrained cell so far.
      */
      if (
        bestCandidates === null ||
        candidates.length < bestCandidates.length
      ) {
        bestCell = { row, col };
        bestCandidates = candidates;

        // Can't get better than one candidate.
        if (candidates.length === 1) {
          return {
            ...bestCell,
            candidates: bestCandidates,
          };
        }
      }
    }
  }

  if (!bestCell) {
    return null;
  }

  return {
    ...bestCell,
    candidates: bestCandidates,
  };
}

/*
  Solve Sudoku using backtracking + MRV.
*/
export function solveSudoku(board) {
  const cell = findBestEmptyCell(board);

  // No empty cells -> solved.
  if (!cell) {
    return true;
  }

  // Empty cell has no legal candidates.
  if (cell.candidates.length === 0) {
    return false;
  }

  for (const number of cell.candidates) {
    board[cell.row][cell.col] = number;

    if (solveSudoku(board)) {
      return true;
    }

    // Backtrack.
    board[cell.row][cell.col] = 0;
  }

  return false;
}

/*
  Count Sudoku solutions.

  The default limit is 2 because:
    0 = no solution
    1 = exactly one solution
    2 = two or more solutions

  We don't need to know whether there are 2, 3, or 100 solutions.
*/
export function countSolutions(board, limit = 2) {
  let solutions = 0;

  function search() {
    if (solutions >= limit) {
      return;
    }

    const cell = findBestEmptyCell(board);

    // Board is complete.
    if (!cell) {
      solutions++;
      return;
    }

    // This branch cannot produce a solution.
    if (cell.candidates.length === 0) {
      return;
    }

    for (const number of cell.candidates) {
      board[cell.row][cell.col] = number;

      search();

      board[cell.row][cell.col] = 0;

      if (solutions >= limit) {
        return;
      }
    }
  }

  search();

  return solutions;
}