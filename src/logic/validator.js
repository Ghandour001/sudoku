/*
  Sudoku Validator utilities
*/

export function isValidMove(board, row, col, number) {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === number) {
      return false;
    }
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === number) {
      return false;
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === number) {
        return false;
      }
    }
  }

  return true;
}

export function isBoardComplete(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        return false;
      }
    }
  }
  return true;
}

export function boardsEqual(boardA, boardB) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (boardA[r][c] !== boardB[r][c]) {
        return false;
      }
    }
  }
  return true;
}

export function findBoardConflicts(board) {
  const conflicts = new Set();

  // Check rows
  for (let r = 0; r < 9; r++) {
    const seen = new Map();
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val !== 0) {
        if (seen.has(val)) {
          conflicts.add(`${r}-${c}`);
          conflicts.add(`${r}-${seen.get(val)}`);
        } else {
          seen.set(val, c);
        }
      }
    }
  }

  // Check cols
  for (let c = 0; c < 9; c++) {
    const seen = new Map();
    for (let r = 0; r < 9; r++) {
      const val = board[r][c];
      if (val !== 0) {
        if (seen.has(val)) {
          conflicts.add(`${r}-${c}`);
          conflicts.add(`${seen.get(val)}-${c}`);
        } else {
          seen.set(val, r);
        }
      }
    }
  }

  // Check boxes
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const seen = new Map();
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          const val = board[r][c];
          if (val !== 0) {
            if (seen.has(val)) {
              conflicts.add(`${r}-${c}`);
              const prev = seen.get(val);
              conflicts.add(`${prev.r}-${prev.c}`);
            } else {
              seen.set(val, { r, c });
            }
          }
        }
      }
    }
  }

  return conflicts;
}