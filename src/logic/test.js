import { isValidMove } from "./validator.js";
import { solveSudoku, countSolutions } from "./solver.js";
import { generateSolvedBoard, generatePuzzle } from "./generator.js";

const board = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

console.log("Validator tests:");
console.log(isValidMove(board, 0, 2, 4));
console.log(isValidMove(board, 0, 2, 5));

const solvedBoard = board.map((row) => [...row]);

console.log("\nSolver test:");
console.log("Solved:", solveSudoku(solvedBoard));

console.table(solvedBoard);

const solutionTestBoard = board.map((row) => [...row]);

console.log("\nSolution count:");
console.log(countSolutions(solutionTestBoard, 2));

// ========================================
// Generated boards
// ========================================

console.log("\nGenerating solved board...");

const generatedSolution = generateSolvedBoard();

console.table(generatedSolution);

// ========================================
// Difficulty tests
// ========================================

const difficulties = [
  "easy",
  "medium",
  "hard",
  "expert",
];

for (const difficulty of difficulties) {
  console.log(`\n==============================`);
  console.log(`Generating ${difficulty.toUpperCase()} puzzle...`);
  console.log(`==============================`);

  const game = generatePuzzle(difficulty);

  console.table(game.puzzle);

  console.log("Requested difficulty:", difficulty);
  console.log("Detected difficulty:", game.difficulty);
  console.log("Score:", game.score);
  console.log("Clues:", game.clues);
  console.log("Techniques:", game.techniques);

  const puzzleCopy = game.puzzle.map((row) => [...row]);

  console.log(
    "Solutions:",
    countSolutions(puzzleCopy, 2),
  );
}