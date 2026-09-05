/*
  High-performance Sudoku Solver using Bitmasks and MRV Heuristic
*/

// Precompute bit counts for numbers 0 to 1023 (0x3FF)
const BIT_COUNT = new Uint8Array(1024);
for (let i = 0; i < 1024; i++) {
  let count = 0;
  let n = i;
  while (n > 0) {
    n &= n - 1;
    count++;
  }
  BIT_COUNT[i] = count;
}

// Precompute box index for each (row, col)
const BOX_INDEX = new Uint8Array(81);
for (let r = 0; r < 9; r++) {
  for (let c = 0; c < 9; c++) {
    BOX_INDEX[r * 9 + c] = Math.floor(r / 3) * 3 + Math.floor(c / 3);
  }
}

export function initMasks(board) {
  const rowMask = new Uint16Array(9);
  const colMask = new Uint16Array(9);
  const boxMask = new Uint16Array(9);

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val !== 0) {
        const bit = 1 << val;
        const b = BOX_INDEX[r * 9 + c];
        rowMask[r] |= bit;
        colMask[c] |= bit;
        boxMask[b] |= bit;
      }
    }
  }

  return { rowMask, colMask, boxMask };
}

/*
  Find the empty cell with the fewest candidates (MRV).
*/
function findBestEmptyCellMasked(board, rowMask, colMask, boxMask) {
  let bestRow = -1;
  let bestCol = -1;
  let bestMask = 0;
  let minCandidates = 10;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== 0) continue;

      const b = BOX_INDEX[r * 9 + c];
      const used = rowMask[r] | colMask[c] | boxMask[b];
      const available = (~used) & 0x3FE;
      const count = BIT_COUNT[available];

      if (count === 0) {
        return { row: r, col: c, available: 0, count: 0 };
      }

      if (count < minCandidates) {
        minCandidates = count;
        bestRow = r;
        bestCol = c;
        bestMask = available;

        if (count === 1) {
          return { row: r, col: c, available: bestMask, count: 1 };
        }
      }
    }
  }

  if (bestRow === -1) {
    return null;
  }

  return { row: bestRow, col: bestCol, available: bestMask, count: minCandidates };
}

/*
  Solve Sudoku using backtracking + MRV with bitmasks.
*/
export function solveSudoku(board) {
  const { rowMask, colMask, boxMask } = initMasks(board);

  function search() {
    const cell = findBestEmptyCellMasked(board, rowMask, colMask, boxMask);
    if (!cell) return true; // Solved
    if (cell.count === 0) return false;

    const { row, col, available } = cell;
    const b = BOX_INDEX[row * 9 + col];

    for (let num = 1; num <= 9; num++) {
      const bit = 1 << num;
      if ((available & bit) !== 0) {
        board[row][col] = num;
        rowMask[row] |= bit;
        colMask[col] |= bit;
        boxMask[b] |= bit;

        if (search()) return true;

        board[row][col] = 0;
        rowMask[row] &= ~bit;
        colMask[col] &= ~bit;
        boxMask[b] &= ~bit;
      }
    }

    return false;
  }

  return search();
}

/*
  Count solutions up to limit (default 2 for uniqueness checking).
*/
export function countSolutions(board, limit = 2) {
  const { rowMask, colMask, boxMask } = initMasks(board);
  let solutions = 0;

  function search() {
    if (solutions >= limit) return;

    const cell = findBestEmptyCellMasked(board, rowMask, colMask, boxMask);
    if (!cell) {
      solutions++;
      return;
    }
    if (cell.count === 0) return;

    const { row, col, available } = cell;
    const b = BOX_INDEX[row * 9 + col];

    for (let num = 1; num <= 9; num++) {
      const bit = 1 << num;
      if ((available & bit) !== 0) {
        board[row][col] = num;
        rowMask[row] |= bit;
        colMask[col] |= bit;
        boxMask[b] |= bit;

        search();

        board[row][col] = 0;
        rowMask[row] &= ~bit;
        colMask[col] &= ~bit;
        boxMask[b] &= ~bit;

        if (solutions >= limit) return;
      }
    }
  }

  search();
  return solutions;
}