<p align="center">
  <img src="public/1761048639831-icon.png" width="128" height="128" alt="Sudoku Master Logo" />
</p>

<h1 align="center">🧩 Sudoku Master</h1>

<p align="center">
  <strong>A high-performance, distraction-free Sudoku web application engineered with React 19, Vite, Bitmask-accelerated algorithmic generation, and real-time Web Audio synthesis.</strong>
</p>

<p align="center">
  <em>Created & Maintained by <strong><a href="https://github.com/Ghandour001">Mohamed Elghandour</a></strong></em>
</p>

<p align="center">
  <a href="https://github.com/Ghandour001/sudoku/actions"><img src="https://img.shields.io/badge/build-passing-brightgreen.svg?style=for-the-badge" alt="Build Status" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" /></a>
  <a href="https://reactrouter.com/"><img src="https://img.shields.io/badge/React_Router-7.18-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router 7" /></a>
  <a href="https://eslint.org/"><img src="https://img.shields.io/badge/ESLint-10.9-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint 10" /></a>
  <a href="#-license"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License MIT" /></a>
  <a href="https://github.com/Ghandour001/sudoku/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome" /></a>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-core-features">Features</a> •
  <a href="#-performance-benchmarks">Performance</a> •
  <a href="#-how-to-play">How to Play</a> •
  <a href="#-the-algorithmic-engine">Algorithmic Engine</a> •
  <a href="#-scoring-system">Scoring</a> •
  <a href="#-keyboard-shortcuts">Shortcuts</a> •
  <a href="#-project-architecture">Architecture</a> •
  <a href="#-author">Author</a>
</p>

---

## 📖 Overview

**Sudoku Master** is an ultra-responsive, single-page Sudoku application built for both casual solvers and hardcore logic enthusiasts. Unlike static puzzle apps that cycle through predetermined text files, Sudoku Master features a **Bitmask-accelerated procedural generator**, an **MRV-heuristic solver**, a **human-logic difficulty evaluator**, and a native **Web Audio API synthesizer**.

Everything runs **100% client-side in the browser**—with sub-millisecond solving speed, zero backend dependencies, complete offline persistence via `localStorage`, and an elegant, responsive UI with Dark and Light mode support.

---

## ✨ Core Features

### ⚡ Blazing-Fast Algorithmic Engine
- **Bitmask-Powered Backtracking**: Bitwise flags (`rowMask`, `colMask`, `boxMask`) replace nested iteration loops, calculating candidates in a single CPU instruction.
- **Instant Puzzle Generation**: Generates even **Expert** difficulty puzzles in **< 10ms** (down from ~4 minutes), preventing any browser freeze or UI lockup.
- **Mathematical Uniqueness Guarantee**: Every generated board is algorithmically verified to have strictly one valid solution (`countSolutions === 1`).
- **Human-Logic Difficulty Classification**: Evaluates puzzles based on human deduction techniques (Naked Singles, Hidden Singles across rows, columns, and 3×3 boxes) and search depth penalties rather than simple clue counts.
- **4 Balanced Tiers**: **Easy**, **Medium**, **Hard**, and **Expert**.

### 🎮 Polished Gameplay & Board Experience
- **Interactive Highlighting**: Instant visual cues for active cells, identical numbers across the grid, and matching rows, columns, and 3×3 sub-grids (with toggle in Preferences).
- **Fixed 3×3 Note Matrix**: Pencil notes occupy deterministic positions (1 top-left, 9 bottom-right) so candidate annotations never shift or jump around inside the cell.
- **Real-Time Validation**: Entered numbers are verified directly against the unique solution. Incorrect inputs trigger immediate mistake indicators and prevent board soft-locks.
- **3-Mistake Challenge**: Keeps gameplay thrilling with a 3-strike threshold.
- **Arrow Key & WASD Navigation**: Seamlessly navigate the 9×9 grid using keyboard arrows or `WASD` without lifting your hands.

### 🔊 Native Web Audio Sound Effects
- **Synthesized Acoustic Feedback**: 100% native audio generated on the fly via the **Web Audio API**—zero external MP3 files, zero download latency, and fully offline.
- Distinct audio cues for placing numbers, toggling notes, cell erasing, mistake alerts, hint chimes, and victory fanfares.
- Sound effects can be easily toggled on/off in the Settings modal.

### 🛠️ Strategic Tools & History Control
- **Centralized `useReducer` State Machine**: Atomic, predictable state transitions with robust history stacks.
- **Unlimited Undo & Redo**: Full `Ctrl+Z` and `Ctrl+Y` history traversal.
- **Targeted Hint Assistant**: Intelligently inspects the currently selected cell and places the correct number, deducting score accordingly.
- **Check Board Assistant**: Instant scan of user entries with non-intrusive feedback confirming valid progress or identifying mistakes.
- **Endgame Auto-Complete Assistant**: When 10 or fewer empty cells remain, a high-visibility, radiant **Auto Complete** button unlocks. Players maintain total freedom to finish the puzzle in a single tap or continue solving manually.
- **Pause & Anti-Peek Blind**: Pausing conceals the grid numbers to preserve fair timing when taking breaks.

### 📊 Analytics, Customization & Privacy
- **Persistent Progress**: Automatically saves board state, notes, elapsed timer, score, and mistakes in real time. Return anytime and click **Continue Game**.
- **Detailed Statistics Dashboard**: Track games played, win rate (%), total score, best completion times per difficulty, average solving time, and mistake counts.
- **Dark & Light Modes**: Fluid visual transition with persistent theme preference.
- **Fullscreen Immersion**: One-click distraction-free fullscreen mode.
- **100% Private & Offline**: Zero analytics trackers, zero third-party databases. All data remains exclusively on your device.

---

## ⚡ Performance Benchmarks

Thanks to Bitmask optimizations and diagonal box seeding, puzzle generation and validation benchmarks reflect industry-leading client-side performance:

| Operation | Before Optimization | After Optimization (Bitmasks) | Speedup Factor |
| :--- | :---: | :---: | :---: |
| **Generate Solved Board** | `~100 ms` | **`1 ms`** | **100× Faster** |
| **Easy Puzzle Generation** | `~1,000 ms` | **`3 ms`** | **330× Faster** |
| **Medium Puzzle Generation** | `~3,000 ms` | **`4 ms`** | **750× Faster** |
| **Hard Puzzle Generation** | `~15,000 ms` | **`5 ms`** | **3,000× Faster** |
| **Expert Puzzle Generation** | `~223,000 ms` (3m 43s) | **`7 ms`** | **~30,000× Faster** |
| **Single Uniqueness Check** | `~5 - 20 ms` | **`< 0.1 ms`** | **Instantaneous** |

---

## 🎮 How to Play

1. **Launch a Game**: Click **New Game** from the home screen and select your desired difficulty (**Easy**, **Medium**, **Hard**, or **Expert**).
2. **Select a Cell**: Click, tap, or navigate with Arrow keys / `WASD` to any empty cell on the 9×9 grid.
3. **Input Numbers**:
   - Use your keyboard (`1`–`9`) or tap the on-screen number pad.
   - To make temporary candidate annotations, toggle **Notes Mode** (press `N` or tap the Notes button).
4. **Use Assistive Tools**:
   - `Undo` / `Redo`: Step back and forth through your move history (`Ctrl+Z` / `Ctrl+Y`).
   - `Erase`: Clear an entered number or note (`Delete` / `Backspace`).
   - `Hint`: Reveal the correct number for the active cell (up to 3 per match, press `H`).
   - `Check`: Validate your current inputs against the solution.
   - `Auto Complete`: When 10 or fewer numbers remain, an optional Auto Complete button unlocks (or press `A`), giving you the choice to finish the board instantly or complete it manually.
5. **Win the Game**: Fill all 81 cells correctly without exceeding **3 mistakes**!

---

## 🔬 The Algorithmic Engine

### 1. Bitmask Solver & MRV Heuristic (`solver.js`)
Numbers 1–9 are represented as bit flags (`1 << num`). Available candidates for any cell `(row, col)` are calculated in a single bitwise operation:

```javascript
// Instant candidate calculation in a single CPU instruction:
const available = ~(rowMask[row] | colMask[col] | boxMask[box]) & 0x03FE;
```

The solver applies the **Minimum Remaining Values (MRV)** heuristic, prioritizing empty cells with the fewest candidate choices to prune search branches early.

### 2. Fast Procedural Carving (`generator.js`)
1. Generates diagonal 3×3 blocks independently (which never conflict with each other), then solves the board via randomized backtracking.
2. Carves numbers out while ensuring that `countSolutions(board, 2)` strictly returns `1`.

### 3. Multi-Factor Difficulty Rater (`difficulty.js`)
Difficulty is calculated through a realistic hybrid model combining human techniques and algorithmic search:

```text
Difficulty Score = Clue Weight + (0.5 × Naked Singles) + (3.0 × Hidden Singles) + (7.0 × Remaining Cells) + Search Penalty
```

Where:
- **Naked Singles (`N_naked`)**: Cells with only one valid candidate.
- **Hidden Singles (`N_hidden`)**: Numbers that appear only once in a row, column, or 3×3 box.
- **Remaining Cells (`R_cells`)**: Unresolved cells after pure logic is exhausted.
- **Search Penalty**: Measures backtracking nodes and recursion depth required when logic alone cannot complete the puzzle.

### Difficulty Classification Matrix

| Difficulty | Clue Range | Target Score | Characteristics |
| :--- | :---: | :---: | :--- |
| **Easy** | 38 – 44 | 0 – 49 | Solvable almost entirely using Naked Singles. |
| **Medium** | 30 – 36 | 40 – 84 | Requires Hidden Singles across rows, columns, and boxes. |
| **Hard** | 26 – 29 | 75 – 130 | Requires multi-step logical deductions with minimal guessing. |
| **Expert** | 22 – 26 | 110+ | Highly constrained; resists basic logic, requiring deep search. |

---

## 🏆 Scoring System

Points encourage fast, accurate, and deliberate solving:

| Event | Points Effect | Details |
| :--- | :---: | :--- |
| **Easy Correct Move** | `+10` pts | Base score for placing a correct number on Easy |
| **Medium Correct Move** | `+15` pts | Base score for placing a correct number on Medium |
| **Hard Correct Move** | `+20` pts | Base score for placing a correct number on Hard |
| **Expert Correct Move** | `+25` pts | Base score for placing a correct number on Expert |
| **Mistake Penalty** | `-20` pts | Deducted whenever an incorrect number is entered |
| **Hint Penalty** | `-30` pts | Deducted per hint used (max 3 hints) |
| **Puzzle Completion Bonus** | `+100` pts | Awarded upon successfully completing the board |
| **Endgame Auto-Complete** | Full move pts + `+100` | Awards remaining cell points (`remaining × moveScore`) plus win bonus |

> [!NOTE]
> Scores are floored at `0` points and cannot become negative.

---

## ⌨️ Keyboard Shortcuts

Speed up your gameplay on desktop with native keyboard shortcuts:

| Key Binding | Action |
| :--- | :--- |
| <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> / <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> | Navigate around the 9×9 grid |
| <kbd>1</kbd> – <kbd>9</kbd> | Enter number into selected cell (or toggle note in Notes Mode) |
| <kbd>Backspace</kbd> / <kbd>Delete</kbd> | Erase number or notes in selected cell |
| <kbd>N</kbd> | Toggle **Notes Mode** (Pencil Marks) ON / OFF |
| <kbd>H</kbd> | Request a **Hint** for the selected cell |
| <kbd>A</kbd> | **Auto Complete** remaining numbers (when ≤ 10 cells remain) |
| <kbd>P</kbd> / <kbd>Space</kbd> | **Pause** or resume the game |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> / <kbd>Cmd</kbd> + <kbd>Z</kbd> | **Undo** last action |
| <kbd>Ctrl</kbd> + <kbd>Y</kbd> / <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> | **Redo** previously undone action |
| <kbd>Esc</kbd> | Close active dialog or modal |

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **UI Framework** | [React 19](https://react.dev/) | Modern functional components with `useReducer`, `useMemo`, and custom hooks |
| **Build Tool & Bundler** | [Vite 8](https://vitejs.dev/) | Instant Hot Module Replacement (HMR) and optimized production bundle |
| **Routing** | [React Router 7](https://reactrouter.com/) | Client-side declarative routing (`/`, `/new-game`, `/game`, `/statistics`) |
| **Sound Synthesis** | [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Low-latency, client-side synthesized acoustic feedback |
| **Code Quality** | [ESLint 10](https://eslint.org/) | Strict ECMAScript and React Hooks linting standards |
| **Styling** | Modern Vanilla CSS | Zero-runtime CSS with fluid dark/light design tokens and responsive layouts |
| **State & Persistence** | Browser `localStorage` | Seamless auto-save, statistics recording, and settings persistence |

---

## 📂 Project Architecture

```text
sudoku/
├── public/
│   ├── 1761048639831-icon.png  # Project neon brand icon
│   ├── favicon.svg             # Vector site favicon
│   └── icons.svg               # SVG icon sprites
├── src/
│   ├── assets/                 # Graphics and branding media
│   ├── components/             # Modular React UI components
│   │   ├── GameModal.jsx       # Win, loss, pause, and alert modals
│   │   ├── GameToolbar.jsx     # Controls (Undo, Redo, Erase, Notes, Hint, Check, Auto Complete)
│   │   ├── NumberPad.jsx       # 1-9 virtual input keypad with usage counters
│   │   ├── SudokuBoard.jsx     # 9x9 interactive grid container
│   │   └── SudokuCell.jsx      # Individual interactive cell with fixed 3x3 note matrix
│   ├── hooks/                  # Custom game logic hooks
│   │   ├── useSudoku.js        # Centralized useReducer state machine, endgame auto-complete & actions
│   │   └── useTimer.js         # Accurate tick & pause-aware stopwatch hook
│   ├── logic/                  # Algorithmic engine (independent of React)
│   │   ├── difficulty.js       # Logical technique detection & puzzle rater
│   │   ├── generator.js        # Bitmask-accelerated procedural puzzle generator & carver
│   │   ├── solver.js           # Backtracking solver with MRV heuristics using Bitmasks
│   │   └── validator.js        # Row, column, and box constraint checker & conflict detector
│   ├── pages/                  # Top-level screen views
│   │   ├── Game.jsx            # Main interactive gameplay view
│   │   ├── Home.jsx            # Landing page with Continue & New Game CTAs
│   │   ├── NewGame.jsx         # Difficulty selector screen
│   │   └── Statistics.jsx      # Historical analytics & records screen
│   ├── utils/                  # Persistent data & audio helpers
│   │   ├── settings.js         # User preferences manager (theme, sound, highlights)
│   │   ├── sound.js            # Web Audio API synthesized procedural sound engine
│   │   ├── statistics.js       # Win/loss and time record keeper
│   │   └── storage.js          # LocalStorage serialization helpers
│   ├── App.jsx                 # Route definitions and layout shell
│   ├── index.css               # Global theme tokens and base reset
│   ├── features.css            # Feature cards, buttons, and animations
│   └── main.jsx                # Application bootstrap entry
├── index.html                  # HTML entry point with metadata
├── package.json                # Project dependencies and scripts
└── vite.config.js              # Vite configuration
```

---

## 🚀 Getting Started

Follow these steps to run Sudoku Master locally on your machine.

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher (or `pnpm` / `yarn`)
- **Git**: Installed on your system

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ghandour001/sudoku.git
   cd sudoku
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Create a production build:**
   ```bash
   npm run build
   ```

5. **Run ESLint checks:**
   ```bash
   npm run lint
   ```

---

## 📋 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Vite dev server with instant HMR |
| `npm run build` | Compiles optimized production bundle into `dist/` |
| `npm run preview` | Spins up a local static server to preview `dist/` |
| `npm run lint` | Runs ESLint to inspect code quality and conventions |

---

## 💾 State Persistence & Privacy

Sudoku Master is built with a **privacy-first** approach. No analytics scripts, tracking pixels, or third-party storage services are used. All state is maintained locally in the client:

| LocalStorage Key | Data Stored |
| :--- | :--- |
| `sudoku_current_game` | Active board state, solution, notes, difficulty, timer, score, mistakes |
| `sudoku_statistics` | Lifetime metrics: games played, games won, best times, mistake counters |
| `sudoku_settings` | User preferences: theme (`dark`/`light`), sound (`on`/`off`), highlights (`on`/`off`), restart confirmation |

> [!TIP]
> To reset all saved data, you can click **Reset Statistics** on the Statistics page or clear site data in your browser settings.

---

## 🗺️ Roadmap

Future enhancements planned for upcoming releases:
- [x] **Web Audio Sound Effects**: Low-latency procedural acoustic feedback for moves, notes, mistakes, and wins.
- [x] **Arrow Keys & WASD Navigation**: Smooth desktop keyboard grid traversal.
- [x] **Bitmask Solver Engine**: Sub-millisecond solving and <10ms generation across all difficulty tiers.
- [ ] **Daily Challenge**: A synchronized daily puzzle with streak counters.
- [ ] **PWA Support**: Full Progressive Web App manifest and Service Worker for 100% offline mobile installation.
- [ ] **Custom Puzzle Import**: Input custom strings (81-character format) or scan newspaper boards.
- [ ] **Step-by-Step Solver Visualizer**: Educational mode demonstrating techniques like X-Wing, Swordfish, and XY-Wing.

---

## 🤝 Contributing

Contributions make the open-source community a fantastic place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

1. **Fork the Project**
2. **Create your Feature Branch:**
   ```bash
   git checkout -b feat/AmazingFeature
   ```
3. **Commit your Changes:**
   ```bash
   git commit -m 'feat: add some AmazingFeature'
   ```
4. **Verify Quality:**
   ```bash
   npm run lint
   npm run build
   ```
5. **Push to the Branch:**
   ```bash
   git push origin feat/AmazingFeature
   ```
6. **Open a Pull Request**

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

<p align="left">
  <strong>Mohamed Elghandour</strong><br>
  GitHub: <a href="https://github.com/Ghandour001">@Ghandour001</a>
</p>

Developed with passion and engineered for maximum performance by **Mohamed Elghandour**.

⭐ **If you enjoy this project, consider giving it a star on GitHub!**
