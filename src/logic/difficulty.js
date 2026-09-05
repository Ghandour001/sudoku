import { initMasks } from "./solver.js";

const BOX_INDEX = new Uint8Array(81);
for (let r = 0; r < 9; r++) {
  for (let c = 0; c < 9; c++) {
    BOX_INDEX[r * 9 + c] = Math.floor(r / 3) * 3 + Math.floor(c / 3);
  }
}

function countEmptyCells(board) {
  let count = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        count++;
      }
    }
  }
  return count;
}

function buildCandidatesFast(board) {
  const { rowMask, colMask, boxMask } = initMasks(board);
  const candidates = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []));

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== 0) continue;

      const b = BOX_INDEX[r * 9 + c];
      const used = rowMask[r] | colMask[c] | boxMask[b];
      const available = (~used) & 0x3FE;
      const list = [];

      for (let num = 1; num <= 9; num++) {
        if ((available & (1 << num)) !== 0) {
          list.push(num);
        }
      }

      candidates[r][c] = list;
    }
  }

  return candidates;
}

function findNakedSingles(board, candidates) {
  const moves = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0 && candidates[row][col].length === 1) {
        moves.push({
          row,
          col,
          number: candidates[row][col][0],
        });
      }
    }
  }

  return moves;
}

function findHiddenSingles(board, candidates) {
  const moves = [];
  const added = new Set();

  function addMove(row, col, number) {
    const key = `${row}-${col}`;
    if (!added.has(key)) {
      added.add(key);
      moves.push({ row, col, number });
    }
  }

  // Rows
  for (let row = 0; row < 9; row++) {
    for (let number = 1; number <= 9; number++) {
      const positions = [];
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0 && candidates[row][col].includes(number)) {
          positions.push(col);
        }
      }
      if (positions.length === 1) {
        addMove(row, positions[0], number);
      }
    }
  }

  // Columns
  for (let col = 0; col < 9; col++) {
    for (let number = 1; number <= 9; number++) {
      const positions = [];
      for (let row = 0; row < 9; row++) {
        if (board[row][col] === 0 && candidates[row][col].includes(number)) {
          positions.push(row);
        }
      }
      if (positions.length === 1) {
        addMove(positions[0], col, number);
      }
    }
  }

  // Boxes
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      for (let number = 1; number <= 9; number++) {
        const positions = [];
        for (let row = boxRow; row < boxRow + 3; row++) {
          for (let col = boxCol; col < boxCol + 3; col++) {
            if (board[row][col] === 0 && candidates[row][col].includes(number)) {
              positions.push({ row, col });
            }
          }
        }
        if (positions.length === 1) {
          addMove(positions[0].row, positions[0].col, number);
        }
      }
    }
  }

  return moves;
}

function analyzeLogicalDifficulty(originalBoard) {
  const board = originalBoard.map((row) => [...row]);
  let nakedSingles = 0;
  let hiddenSingles = 0;
  let progress = true;

  while (progress) {
    progress = false;
    const candidates = buildCandidatesFast(board);

    const nakedMoves = findNakedSingles(board, candidates);
    if (nakedMoves.length > 0) {
      for (const move of nakedMoves) {
        if (board[move.row][move.col] === 0) {
          board[move.row][move.col] = move.number;
          nakedSingles++;
          progress = true;
        }
      }
      continue;
    }

    const hiddenMoves = findHiddenSingles(board, candidates);
    if (hiddenMoves.length > 0) {
      for (const move of hiddenMoves) {
        if (board[move.row][move.col] === 0) {
          board[move.row][move.col] = move.number;
          hiddenSingles++;
          progress = true;
        }
      }
      continue;
    }
  }

  return {
    board,
    nakedSingles,
    hiddenSingles,
    remainingCells: countEmptyCells(board),
  };
}

function measureSearchComplexity(originalBoard) {
  const board = originalBoard.map((row) => [...row]);
  const { rowMask, colMask, boxMask } = initMasks(board);
  let nodes = 0;
  let maxDepth = 0;

  function search(depth) {
    nodes++;
    if (depth > maxDepth) maxDepth = depth;
    if (nodes > 600) return true; // Early cutoff for rating speed

    let bestRow = -1;
    let bestCol = -1;
    let bestCandidates = null;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== 0) continue;

        const b = BOX_INDEX[r * 9 + c];
        const used = rowMask[r] | colMask[c] | boxMask[b];
        const available = (~used) & 0x3FE;

        const list = [];
        for (let num = 1; num <= 9; num++) {
          if ((available & (1 << num)) !== 0) list.push(num);
        }

        if (list.length === 0) return false;

        if (bestCandidates === null || list.length < bestCandidates.length) {
          bestRow = r;
          bestCol = c;
          bestCandidates = list;
          if (list.length === 1) break;
        }
      }
      if (bestCandidates && bestCandidates.length === 1) break;
    }

    if (bestRow === -1) return true; // Complete

    const b = BOX_INDEX[bestRow * 9 + bestCol];
    for (const num of bestCandidates) {
      const bit = 1 << num;
      board[bestRow][bestCol] = num;
      rowMask[bestRow] |= bit;
      colMask[bestCol] |= bit;
      boxMask[b] |= bit;

      if (search(depth + 1)) return true;

      board[bestRow][bestCol] = 0;
      rowMask[bestRow] &= ~bit;
      colMask[bestCol] &= ~bit;
      boxMask[b] &= ~bit;
    }

    return false;
  }

  search(0);

  return { nodes, maxDepth };
}

export function ratePuzzle(originalBoard) {
  const clues = 81 - countEmptyCells(originalBoard);
  const logical = analyzeLogicalDifficulty(originalBoard);
  const search = measureSearchComplexity(logical.board);

  let score = 0;

  if (clues <= 27) {
    score += 25;
  } else if (clues <= 31) {
    score += 15;
  } else if (clues <= 37) {
    score += 8;
  }

  score += logical.nakedSingles * 0.5;
  score += logical.hiddenSingles * 3;
  score += logical.remainingCells * 7;
  score += Math.min(search.nodes * 0.15, 100);
  score += Math.min(search.maxDepth * 4, 60);

  let difficulty;

  if (logical.remainingCells === 0 && score < 45) {
    difficulty = "easy";
  } else if (logical.remainingCells <= 3 && search.nodes < 100 && score < 80) {
    difficulty = "medium";
  } else if (logical.remainingCells <= 10 && search.nodes < 500 && score < 125) {
    difficulty = "hard";
  } else {
    difficulty = "expert";
  }

  return {
    difficulty,
    score: Math.round(score),
    clues,
    remainingCells: logical.remainingCells,
    techniques: {
      nakedSingles: logical.nakedSingles,
      hiddenSingles: logical.hiddenSingles,
    },
    search: {
      nodes: search.nodes,
      maxDepth: search.maxDepth,
    },
  };
}