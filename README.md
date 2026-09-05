# Sudoku

A browser-based Sudoku game built with React and Vite. Choose a difficulty, solve puzzles at your own pace, and track your performance over time.

## Features

- Four difficulty levels: Easy, Medium, Hard, and Expert
- Puzzle generation, solution validation, and difficulty scoring
- Notes mode, hints, undo/redo, pause, restart, and mistake tracking
- Timer with saved-game restoration
- Light and dark themes with configurable game settings
- Statistics for games played, wins, win rate, scores, times, and mistakes
- Progress and statistics stored locally in the browser

## Getting Started

### Requirements

- Node.js 18 or newer
- npm

### Install and run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

## Available Commands

| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start the Vite development server with hot reload |
| `npm run build`   | Create a production build in `dist/`              |
| `npm run preview` | Preview the production build locally              |
| `npm run lint`    | Run ESLint across the project                     |

## Project Structure

```text
src/
├── components/   Reusable game interface components
├── hooks/        Sudoku and timer state management
├── logic/        Puzzle generation, solving, validation, and difficulty logic
├── pages/        Home, new game, game, and statistics screens
└── utils/        Browser storage, settings, and statistics helpers
```

## Data Storage

The app does not require a backend. The current game, preferences, and statistics are stored in the browser using `localStorage`. Clearing site data will remove saved progress and statistics.

## Tech Stack

- React 19
- React Router
- Vite
- ESLint
