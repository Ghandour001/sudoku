import { isValidMove } from "./validator.js";

/*
  Count empty cells.
*/
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

/*
  Get candidates for a cell.
*/
function getCandidates(board, row, col) {
  const candidates = [];

  for (let number = 1; number <= 9; number++) {
    if (isValidMove(board, row, col, number)) {
      candidates.push(number);
    }
  }

  return candidates;
}

/*
  Build candidate map.
*/
function buildCandidates(board) {
  return Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, col) => {
      if (board[row][col] !== 0) {
        return [];
      }

      return getCandidates(board, row, col);
    }),
  );
}

/*
  Find naked singles.

  A cell with exactly one candidate.
*/
function findNakedSingles(board, candidates) {
  const moves = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (
        board[row][col] === 0 &&
        candidates[row][col].length === 1
      ) {
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

/*
  Find hidden singles in rows, columns and boxes.
*/
function findHiddenSingles(board, candidates) {
  const moves = [];

  /*
    Prevent adding the same cell multiple times.
  */
  const added = new Set();

  function addMove(row, col, number) {
    const key = `${row}-${col}`;

    if (!added.has(key)) {
      added.add(key);

      moves.push({
        row,
        col,
        number,
      });
    }
  }

  // -------------------------
  // Rows
  // -------------------------

  for (let row = 0; row < 9; row++) {
    for (let number = 1; number <= 9; number++) {
      const positions = [];

      for (let col = 0; col < 9; col++) {
        if (
          board[row][col] === 0 &&
          candidates[row][col].includes(number)
        ) {
          positions.push(col);
        }
      }

      if (positions.length === 1) {
        addMove(row, positions[0], number);
      }
    }
  }

  // -------------------------
  // Columns
  // -------------------------

  for (let col = 0; col < 9; col++) {
    for (let number = 1; number <= 9; number++) {
      const positions = [];

      for (let row = 0; row < 9; row++) {
        if (
          board[row][col] === 0 &&
          candidates[row][col].includes(number)
        ) {
          positions.push(row);
        }
      }

      if (positions.length === 1) {
        addMove(positions[0], col, number);
      }
    }
  }

  // -------------------------
  // Boxes
  // -------------------------

  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      for (let number = 1; number <= 9; number++) {
        const positions = [];

        for (let row = boxRow; row < boxRow + 3; row++) {
          for (let col = boxCol; col < boxCol + 3; col++) {
            if (
              board[row][col] === 0 &&
              candidates[row][col].includes(number)
            ) {
              positions.push({ row, col });
            }
          }
        }

        if (positions.length === 1) {
          addMove(
            positions[0].row,
            positions[0].col,
            number,
          );
        }
      }
    }
  }

  return moves;
}

/*
  Apply logical solving techniques.

  Returns information about how much of the puzzle
  can be solved without guessing.
*/
function analyzeLogicalDifficulty(originalBoard) {
  const board = originalBoard.map((row) => [...row]);

  let nakedSingles = 0;
  let hiddenSingles = 0;

  let progress = true;

  while (progress) {
    progress = false;

    const candidates = buildCandidates(board);

    /*
      First use naked singles.
    */
    const nakedMoves = findNakedSingles(
      board,
      candidates,
    );

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

    /*
      Then use hidden singles.
    */
    const hiddenMoves = findHiddenSingles(
      board,
      candidates,
    );

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

/*
  Count search nodes.

  This measures how much guessing/backtracking
  the puzzle requires after logical solving gets stuck.
*/
function measureSearchComplexity(originalBoard) {
  const board = originalBoard.map((row) => [...row]);

  let nodes = 0;
  let maxDepth = 0;

  function findBestCell() {
    let best = null;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== 0) {
          continue;
        }

        const candidates = getCandidates(
          board,
          row,
          col,
        );

        if (candidates.length === 0) {
          return {
            row,
            col,
            candidates,
          };
        }

        if (
          best === null ||
          candidates.length < best.candidates.length
        ) {
          best = {
            row,
            col,
            candidates,
          };

          if (candidates.length === 1) {
            return best;
          }
        }
      }
    }

    return best;
  }

  function search(depth) {
    nodes++;

    if (depth > maxDepth) {
      maxDepth = depth;
    }

    const cell = findBestCell();

    if (!cell) {
      return true;
    }

    if (cell.candidates.length === 0) {
      return false;
    }

    for (const number of cell.candidates) {
      board[cell.row][cell.col] = number;

      if (search(depth + 1)) {
        return true;
      }

      board[cell.row][cell.col] = 0;
    }

    return false;
  }

  search(0);

  return {
    nodes,
    maxDepth,
  };
}

/*
  Rate the puzzle.

  Difficulty is based on:
    - number of clues
    - naked singles
    - hidden singles
    - cells remaining after logical solving
    - search nodes
    - search depth
*/
export function ratePuzzle(originalBoard) {
  const clues =
    81 - countEmptyCells(originalBoard);

  const logical = analyzeLogicalDifficulty(
    originalBoard,
  );

  const search = measureSearchComplexity(
    logical.board,
  );

  let score = 0;

  /*
    Fewer clues generally increases difficulty,
    but clues alone do NOT determine the rating.
  */
  if (clues <= 27) {
    score += 25;
  } else if (clues <= 31) {
    score += 15;
  } else if (clues <= 37) {
    score += 8;
  }

  /*
    Hidden singles are more difficult than simple
    naked singles.
  */
  score += logical.nakedSingles * 0.5;
  score += logical.hiddenSingles * 3;

  /*
    If logic cannot finish the puzzle, add a
    significant difficulty penalty.
  */
  score += logical.remainingCells * 7;

  /*
    Search complexity is the strongest indicator
    when logical techniques are insufficient.
  */
  score += Math.min(search.nodes * 0.15, 100);
  score += Math.min(search.maxDepth * 4, 60);

  /*
    Classification.

    The important rule:
    Expert requires the puzzle to actually resist
    basic logical solving and/or require substantial
    search.
  */

  let difficulty;

  if (
    logical.remainingCells === 0 &&
    score < 45
  ) {
    difficulty = "easy";
  } else if (
    logical.remainingCells <= 3 &&
    search.nodes < 100 &&
    score < 80
  ) {
    difficulty = "medium";
  } else if (
    logical.remainingCells <= 10 &&
    search.nodes < 500 &&
    score < 125
  ) {
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