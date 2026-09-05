<p align="center">
  <img src="public/1761048639831-icon.png" width="120" height="120" alt="Sudoku Logo" />
</p>

<h1 align="center">🧩 Sudoku Master</h1>

<p align="center">
  <strong>A modern, sleek, and distraction-free Sudoku web application engineered with React 19, Vite, and an algorithmic puzzle generation & rating engine.</strong>
</p>

<p align="center">
  <a href="https://github.com/Ghandour001/sudoku/actions"><img src="https://img.shields.io/badge/build-passing-brightgreen.svg?style=for-the-badge" alt="Build Status" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" /></a>
  <a href="https://reactrouter.com/"><img src="https://img.shields.io/badge/React_Router-7.18-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router 7" /></a>
  <a href="https://eslint.org/"><img src="https://img.shields.io/badge/ESLint-10.9-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint 10" /></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License MIT" /></a>
  <a href="https://github.com/Ghandour001/sudoku/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome" /></a>
</p>

<p align="center">
  <a href="#-core-features">Features</a> •
  <a href="#-how-to-play">How to Play</a> •
  <a href="#-the-algorithmic-engine">Algorithmic Engine</a> •
  <a href="#-scoring-system">Scoring</a> •
  <a href="#-keyboard-shortcuts">Shortcuts</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-architecture">Architecture</a>
</p>

---

## 📖 Overview

**Sudoku Master** is a high-performance, single-page Sudoku application designed for both casual solvers and hardcore puzzle enthusiasts. Unlike static puzzle apps that cycle through predetermined text files, Sudoku Master features a **procedural backtracking generator**, an **MRV-heuristic solver**, and a **human-logic difficulty evaluator**. 

Everything runs **100% client-side in the browser**—with lightning-fast reactivity, zero backend dependencies, complete offline persistence via `localStorage`, and an elegant, responsive UI with Dark and Light mode support.

---

## ✨ Core Features

### 🧠 Intelligent Puzzle Generation & Difficulty
- **Procedural On-the-Fly Generator**: Generates balanced, unique puzzles with Fisher-Yates randomization.
- **Mathematical Uniqueness Guarantee**: Every puzzle is verified to have exactly one valid solution (`countSolutions === 1`).
- **Human-Logic Difficulty Classification**: Evaluates puzzles based on human solving techniques (Naked Singles, Hidden Singles across rows, columns, and 3×3 boxes) and backtracking search complexity rather than just counting clues.
- **4 Distinct Difficulty Tiers**: **Easy**, **Medium**, **Hard**, and **Expert**.

### 🎮 Polished Gameplay & Board Experience
- **Distraction-Free Grid**: Instant visual cues for active cells, identical numbers across the board, and matching rows, columns, and 3×3 sub-grids.
- **Dual Input Modes**: Seamlessly toggle between direct number entry and pencil-mark **Notes Mode** (1–9 candidate tracking).
- **Conflict & Error Feedback**: Distinct, non-intrusive animations and visual highlights for invalid moves.
- **3-Mistake Challenge**: Keeps the stakes high with a three-strike game-over threshold.

### 🛠️ Strategic Tools & History Control
- **Full History Stack**: Unlimited **Undo** (`Ctrl+Z`) and **Redo** (`Ctrl+Y`) to experiment freely.
- **Pencil Notes**: Track multiple candidates per cell without committing answers.
- **Smart Hint System**: Up to 3 hints per game, placing correct numbers with appropriate scoring trade-offs.
- **Board Checker**: Instant inspection of current board progress.
- **Pause & Anti-Peek Blind**: Need a break? Pausing hides the board numbers to preserve fair timing.
- **Quick Erase & Restart**: Easily clear individual cells or restart the puzzle with confirmation safeguards.

### 📊 Analytics, Customization & Privacy
- **Persistent Progress**: Automatically saves board state, notes, elapsed timer, score, and mistakes in real time. Return anytime and click **Continue Game**.
- **Detailed Statistics Dashboard**: Track games played, win rate (%), total score, best completion times per difficulty, average solving time, and mistake counts.
- **Dark & Light Modes**: Seamless toggle with persistent theme selection.
- **Fullscreen Immersion**: One-click distraction-free fullscreen mode.
- **Accessibility & Responsiveness**: Fully responsive touch number pad for mobile & tablet, full keyboard navigation for desktop, and ARIA grid labeling.
- **100% Private & Offline**: Zero analytics trackers, zero external database calls. Your game data remains securely in your browser.

---

## 🎮 How to Play

1. **Launch a Game**: Click **New Game** from the home screen and select your desired difficulty (**Easy**, **Medium**, **Hard**, or **Expert**).
2. **Select a Cell**: Click or tap any empty cell on the 9×9 grid.
3. **Input Numbers**:
   - Use your keyboard (`1`–`9`) or tap the on-screen number pad.
   - To make temporary candidate annotations, toggle **Notes Mode** (press `N` or tap the Notes button).
4. **Use Assistive Tools**:
   - `Undo` / `Redo`: Step back and forth through your move history.
   - `Erase`: Clear an entered number or note (`Delete` / `Backspace`).
   - `Hint`: Reveal the correct number for the selected cell (up to 3 per match).
   - `Check`: Validate your current inputs against the solution.
5. **Win the Game**: Fill all 81 cells correctly without exceeding **3 mistakes**!

---

## 🔬 The Algorithmic Engine

### 1. Procedural Backtracking Generator (`generator.js`)
Puzzles are generated by creating a complete, randomly filled valid Sudoku board using a randomized backtracking algorithm with Fisher-Yates shuffling. Numbers are progressively carved out while ensuring that `countSolutions(board, 2)` strictly returns `1`.

### 2. MRV (Minimum Remaining Values) Solver (`solver.js`)
When solving boards or validating uniqueness, the solver utilizes the **MRV heuristic**—always prioritizing the empty cell with the fewest remaining candidate choices. This prunes invalid branches early and reduces search tree traversal by orders of magnitude.

### 3. Multi-Factor Difficulty Rater (`difficulty.js`)
Difficulty is calculated through a realistic model combining human techniques and algorithmic search:

$$\text{Difficulty Score} = S_{\text{clues}} + 0.5 \cdot N_{\text{naked}} + 3.0 \cdot N_{\text{hidden}} + 7.0 \cdot R_{\text{cells}} + \text{Search Penalty}$$

Where:
- **Naked Singles ($N_{\text{naked}}$)**: Cells with only one valid candidate.
- **Hidden Singles ($N_{\text{hidden}}$)**: Numbers that appear only once in a row, column, or 3×3 box.
- **Remaining Cells ($R_{\text{cells}}$)**: Unresolved cells after pure logic is exhausted.
- **Search Penalty**: Measures backtracking nodes and recursion depth required when logic alone cannot complete the puzzle.

### Difficulty Classification Matrix

| Difficulty | Clue Range | Target Score | Characteristics |
| :--- | :---: | :---: | :--- |
| **Easy** | 40 – 46 | $0 - 44$ | Solvable almost entirely using Naked Singles. |
| **Medium** | 34 – 39 | $45 - 79$ | Requires Hidden Singles across rows, columns, and boxes. |
| **Hard** | 28 – 33 | $80 - 124$ | Requires multi-step logical deductions with minimal guessing. |
| **Expert** | 24 – 27 | $125+$ | Highly constrained; resists basic logic, requiring deep search. |

---

## 🏆 Scoring System

Points encourage fast, accurate, and deliberate solving:

| Event | Points Effect | Details |
| :--- | :---: | :--- |
| **Easy Correct Move** | `+10` pts | Base score for placing a correct number on Easy. |
| **Medium Correct Move** | `+15` pts | Base score for placing a correct number on Medium. |
| **Hard Correct Move** | `+20` pts | Base score for placing a correct number on Hard. |
| **Expert Correct Move** | `+25` pts | Base score for placing a correct number on Expert. |
| **Mistake Penalty** | `-20` pts | Deducted whenever an incorrect number is placed. |
| **Hint Penalty** | `-30` pts | Deducted per hint used (max 3 hints). |
| **Puzzle Completion Bonus** | `+100` pts | Awarded upon successfully completing the board. |

> [!NOTE]
> Scores are floored at `0` points and cannot become negative.

---

## ⌨️ Keyboard Shortcuts

Speed up your gameplay on desktop with native keyboard shortcuts:

| Key Binding | Action |
| :--- | :--- |
| <kbd>1</kbd> – <kbd>9</kbd> | Enter number into selected cell (or toggle note in Notes Mode) |
| <kbd>Backspace</kbd> / <kbd>Delete</kbd> | Erase number or notes in selected cell |
| <kbd>N</kbd> | Toggle **Notes Mode** (Pencil Marks) ON / OFF |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> | **Undo** last action |
| <kbd>Ctrl</kbd> + <kbd>Y</kbd> | **Redo** previously undone action |
| <kbd>Esc</kbd> | Close active dialog or modal |

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **UI Framework** | [React 19](https://react.dev/) | Component architecture, modern hooks (`useCallback`, `useMemo`, `useRef`) |
| **Build Tool & Bundler** | [Vite 8](https://vitejs.dev/) | Instant Hot Module Replacement (HMR) and optimized ES bundle output |
| **Routing** | [React Router 7](https://reactrouter.com/) | Client-side declarative routing (`/`, `/new-game`, `/game`, `/statistics`) |
| **Code Quality** | [ESLint 10](https://eslint.org/) | Strict ECMAScript and React Hooks linting standards |
| **Styling** | Modern CSS Variables | Zero-runtime CSS with fluid dark/light design tokens and responsive layouts |
| **State & Persistence** | Browser `localStorage` | Seamless auto-save, stats recording, and settings persistence |

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
│   │   ├── GameToolbar.jsx     # Controls (Undo, Redo, Erase, Notes, Hint, Check)
│   │   ├── NumberPad.jsx       # 1-9 virtual input keypad with usage counters
│   │   ├── SudokuBoard.jsx     # 9x9 interactive grid container
│   │   └── SudokuCell.jsx      # Individual interactive cell with note matrix
│   ├── hooks/                  # Custom game logic hooks
│   │   ├── useSudoku.js        # Core game state, history stack, and handlers
│   │   └── useTimer.js         # Accurate tick & pause-aware stopwatch hook
│   ├── logic/                  # Algorithmic engine (independent of React)
│   │   ├── difficulty.js       # Logical technique detection & puzzle rater
│   │   ├── generator.js        # Procedural puzzle generator & carver
│   │   ├── solver.js           # Backtracking solver with MRV heuristics
│   │   └── validator.js        # Row, column, and box constraint checker
│   ├── pages/                  # Top-level screen views
│   │   ├── Game.jsx            # Main interactive gameplay view
│   │   ├── Home.jsx            # Landing page with Continue & New Game CTAs
│   │   ├── NewGame.jsx         # Difficulty selector screen
│   │   └── Statistics.jsx      # Historical analytics & records screen
│   ├── utils/                  # Persistent data helpers
│   │   ├── settings.js         # User preferences manager
│   │   ├── statistics.js       # Win/loss and time record keeper
│   │   └── storage.js          # LocalStorage serialization helpers
│   ├── App.jsx                 # Route definitions and layout shell
│   ├── index.css               # Global theme tokens and base reset
│   ├── features.css            # Feature cards, buttons, and animations
│   └── main.jsx                # Application bootstrap entry
├── index.html                  # HTML entry point
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
   Open your browser at `http://localhost:5173` (or the port shown in your terminal).

4. **Create a production build:**
   ```bash
   npm run build
   ```

5. **Preview the production build locally:**
   ```bash
   npm run preview
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
| `sudoku_theme` | Current visual mode preference (`dark` / `light`) |
| `sudoku_sound` | Sound preference toggle (`on` / `off`) |
| `sudoku_highlight` | Duplicate number & related cells highlight toggle (`on` / `off`) |
| `sudoku_confirm_restart`| Guard toggle before resetting an in-progress game |

> [!TIP]
> To reset all saved data, you can click **Reset All Statistics** on the Statistics page or clear site data in your browser settings.

---

## 🗺️ Roadmap

Future enhancements planned for upcoming releases:
- [ ] **Daily Challenge**: A synchronized daily puzzle with streak counters.
- [ ] **Web Audio Sound Effects**: Subtle tactile acoustic feedback for placements, notes, and completions.
- [ ] **PWA Support**: Full Progressive Web App manifest and Service Worker for 100% offline mobile installation.
- [ ] **Custom Puzzle Import**: Input custom strings (81-character format) or scan newspaper boards.
- [ ] **Step-by-Step Solver Visualizer**: Educational mode showing how techniques like X-Wing, Swordfish, and XY-Wing work.

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

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Developed with care by [Ghandour001](https://github.com/Ghandour001).

⭐ **If you enjoy this project, consider giving it a star on GitHub!**
