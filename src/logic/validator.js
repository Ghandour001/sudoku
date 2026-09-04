export function isValidMove(board, row, col, number) {
  // Check the row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === number) {
      return false;
    }
  }

  // Check the column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === number) {
      return false;
    }
  }

  // Find the top-left corner of the 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  // Check the 3x3 box
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