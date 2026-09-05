# Sudoku

A focused, browser-based Sudoku game built with React and Vite. Generate a puzzle, work through it with practical solving tools, and build a record of your progress over time.

## What is included

- Four puzzle levels: **Easy**, **Medium**, **Hard**, and **Expert**
- Generated puzzles with solution validation and logical difficulty analysis
- A distraction-free game board with row, column, and box interactions
- Normal input and pencil-mark **Notes Mode**
- Three hints per game, with scoring consequences for hints and mistakes
- Undo and redo history, erase, pause, restart, and board checking
- Timer that continues from saved progress
- Win/loss state with a three-mistake limit
- Dark and light themes plus gameplay preferences
- Statistics for games played, wins, scores, best times, mistakes, and hints
- Automatic local progress persistence with no account or backend required

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm

### Run locally

```bash
git clone <repository-url>
cd sudoku
npm install
npm run dev
```

Open the local URL printed by Vite. The development server supports hot module replacement, so edits appear in the browser as you work.

## How to play

1. Select **New Game** from the home screen.
2. Choose a difficulty and start the puzzle.
3. Select an empty cell, then enter a number with the number pad or keyboard.
4. Switch to **Notes Mode** to add or remove candidate numbers without committing a solution.
5. Use **Undo**, **Redo**, **Erase**, **Hint**, and **Check** as needed.
6. Solve the board before reaching three mistakes.

Completed games are recorded in Statistics. An active game is saved automatically, so **Continue Game** restores the board, notes, timer, score, hints, and settings from the last session.

## Scoring

Each difficulty has a different score value per correct move:

| Difficulty | Points per move |
| ---------- | --------------- |
| Easy       | 10              |
| Medium     | 15              |
| Hard       | 20              |
| Expert     | 25              |

Mistakes cost 20 points, hints cost 30 points, and completing a puzzle adds a 100-point win bonus. Scores cannot fall below zero.

## Available commands

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start the Vite development server      |
| `npm run build`   | Build the production bundle in `dist/` |
| `npm run preview` | Serve the production build locally     |
| `npm run lint`    | Run ESLint across the project          |

## Project structure

```text
src/
├── components/   Board, cells, number pad, toolbar, and modal UI
├── hooks/        Sudoku state and timer hooks
├── logic/        Puzzle generation, solving, validation, and difficulty scoring
├── pages/        Home, new game, game, and statistics screens
└── utils/        Settings, statistics, and local-storage helpers
```

The main routes are `/`, `/new-game`, `/game`, and `/statistics`. `App.jsx` connects those routes, while `useSudoku.js` owns the active puzzle state and game actions.

## Data and privacy

Sudoku is fully client-side. The app stores the current game, settings, and statistics in the browser with `localStorage`; it does not send gameplay data to a server. Clearing the site data for this app removes saved progress and statistics.

## Tech stack

- React 19
- React Router 7
- Vite 8
- ESLint 10

## Contributing

1. Create a feature branch.
2. Install dependencies with `npm install`.
3. Run `npm run lint` and `npm run build` before opening a pull request.
4. Keep gameplay logic in `src/logic`, stateful behavior in `src/hooks`, and reusable interface pieces in `src/components`.

## License

No license has been specified for this project yet.
