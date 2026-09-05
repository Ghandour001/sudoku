import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import useSudoku from "../hooks/useSudoku.js";
import useTimer from "../hooks/useTimer.js";

import {
  clearCurrentGame,
  loadCurrentGame,
  saveCurrentGame,
} from "../utils/storage.js";
import { recordGameResult } from "../utils/statistics.js";
import { getSettings, updateSettings } from "../utils/settings.js";
import {
  playEraseSound,
  playHintSound,
  playMistakeSound,
  playNoteSound,
  playNumberSound,
  playVictorySound,
} from "../utils/sound.js";

import SudokuBoard from "../components/SudokuBoard.jsx";
import NumberPad from "../components/NumberPad.jsx";
import GameToolbar from "../components/GameToolbar.jsx";
import GameModal from "../components/GameModal.jsx";

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function GameScreen({ difficulty, savedGame }) {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(() => getSettings());
  const { theme, soundEnabled, highlightEnabled, confirmRestart } = settings;

  const sudoku = useSudoku(difficulty, savedGame);
  const {
    puzzle,
    board,
    notes,
    solution,
    difficulty: currentDifficulty,
    difficultyScore,
    clues,
    score,
    mistakes,
    maxMistakes,
    hints,
    isNotesMode,
    isPaused,
    gameStatus,
    selectedCell,
    mistakeCell,
    checkFeedback,
    numberStats,
    canUndo,
    canRedo,
    restartGame,
    selectCell,
    moveSelection,
    enterNumber,
    eraseCell,
    undo,
    redo,
    applyHint,
    checkBoard,
    togglePause,
    toggleNotesMode,
    clearMistake,
    clearCheckFeedback,
  } = sudoku;

  const {
    seconds,
    reset: resetTimer,
    setTime,
  } = useTimer(
    savedGame?.elapsedSeconds ?? 0,
    gameStatus === "playing" && !isPaused,
  );

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(
    Boolean(document.fullscreenElement),
  );

  const hasRecordedResult = useRef(false);

  /* Theme sync */
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
  }, [theme]);

  /* Timer restoration for saved games */
  useEffect(() => {
    if (savedGame?.elapsedSeconds) {
      setTime(savedGame.elapsedSeconds);
    }
  }, [savedGame, setTime]);

  /* Save current game while playing */
  useEffect(() => {
    if (gameStatus !== "playing") return;

    saveCurrentGame({
      puzzle,
      solution,
      board,
      notes,
      difficulty: currentDifficulty,
      difficultyScore,
      clues,
      score,
      mistakes,
      hints,
      maxMistakes,
      isPaused,
      isNotesMode,
      selectedCell,
      elapsedSeconds: seconds,
    });
  }, [
    puzzle,
    solution,
    board,
    notes,
    currentDifficulty,
    difficultyScore,
    clues,
    score,
    mistakes,
    hints,
    maxMistakes,
    isPaused,
    isNotesMode,
    selectedCell,
    seconds,
    gameStatus,
  ]);

  /* Record game results when finished */
  useEffect(() => {
    if (gameStatus !== "won" && gameStatus !== "lost") return;
    if (hasRecordedResult.current) return;

    hasRecordedResult.current = true;

    if (gameStatus === "won") {
      playVictorySound(soundEnabled);
    }

    recordGameResult({
      difficulty: currentDifficulty,
      score,
      time: seconds,
      mistakes,
      hints: 3 - hints,
      won: gameStatus === "won",
    });

    clearCurrentGame();
  }, [gameStatus, currentDifficulty, score, seconds, mistakes, hints, soundEnabled]);

  /* Mistake feedback sound & visual auto-clear */
  useEffect(() => {
    if (!mistakeCell) return undefined;

    playMistakeSound(soundEnabled);

    const timeout = window.setTimeout(() => {
      clearMistake();
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [mistakeCell, clearMistake, soundEnabled]);

  /* Check feedback auto-clear */
  useEffect(() => {
    if (!checkFeedback) return undefined;

    const timeout = window.setTimeout(() => {
      clearCheckFeedback();
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [checkFeedback, clearCheckFeedback]);

  /* Fullscreen tracker */
  useEffect(() => {
    const handleFullscreen = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  /* User input handlers with sound */
  const handleEnterNumber = useCallback(
    (number) => {
      if (isPaused || gameStatus !== "playing") return;

      if (isNotesMode) {
        playNoteSound(soundEnabled);
      } else {
        playNumberSound(soundEnabled);
      }

      enterNumber(number);
    },
    [isPaused, gameStatus, isNotesMode, soundEnabled, enterNumber],
  );

  const handleErase = useCallback(() => {
    if (isPaused || gameStatus !== "playing") return;
    playEraseSound(soundEnabled);
    eraseCell();
  }, [isPaused, gameStatus, soundEnabled, eraseCell]);

  const handleHint = useCallback(() => {
    if (isPaused || gameStatus !== "playing" || hints <= 0) return;
    playHintSound(soundEnabled);
    applyHint();
  }, [isPaused, gameStatus, hints, soundEnabled, applyHint]);

  /* Keyboard controls with Arrow keys navigation */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Space / P for pause
      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        togglePause();
        return;
      }

      if (isPaused || gameStatus !== "playing") return;

      // Arrow navigation
      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveSelection(-1, 0);
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveSelection(1, 0);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveSelection(0, -1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveSelection(0, 1);
        return;
      }

      // Numbers 1-9
      if (event.key >= "1" && event.key <= "9") {
        handleEnterNumber(Number(event.key));
        return;
      }

      // Erase
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        handleErase();
        return;
      }

      // Notes toggle
      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        toggleNotesMode();
        return;
      }

      // Undo (Ctrl+Z or Cmd+Z)
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === "z") {
        event.preventDefault();
        undo();
        return;
      }

      // Redo (Ctrl+Y or Ctrl+Shift+Z or Cmd+Shift+Z)
      if (
        ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "z")
      ) {
        event.preventDefault();
        redo();
        return;
      }

      // Hint shortcut (H)
      if (event.key.toLowerCase() === "h") {
        event.preventDefault();
        handleHint();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isPaused,
    gameStatus,
    moveSelection,
    handleEnterNumber,
    handleErase,
    toggleNotesMode,
    togglePause,
    undo,
    redo,
    handleHint,
  ]);

  /* Settings update helper */
  const updateSettingField = (key, value) => {
    const updated = updateSettings({ [key]: value });
    setSettings(updated);
  };

  const toggleTheme = () => {
    updateSettingField("theme", theme === "dark" ? "light" : "dark");
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  const handleRestart = () => {
    if (confirmRestart && !window.confirm("Restart this puzzle from the beginning?")) {
      return;
    }

    restartGame();
    resetTimer();
    hasRecordedResult.current = false;
  };

  const handleNewGame = () => {
    clearCurrentGame();
    navigate("/new-game");
  };

  return (
    <main
      className={`game-page ${highlightEnabled ? "highlight-enabled" : "highlight-disabled"}`}
    >
      <header className="game-header">
        <div className="brand">
          <Link to="/" className="brand-logo" aria-label="Sudoku Home">
            ▦
          </Link>
          <div>
            <Link to="/" className="brand-name">
              Sudoku
            </Link>
            <p>Train your mind</p>
          </div>
        </div>

        <nav className="game-nav">
          <Link to="/">Home</Link>
          <Link to="/game" className="active">
            Game
          </Link>
          <Link to="/statistics">Statistics</Link>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="header-icon-button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>

          <button
            type="button"
            className="header-icon-button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
            title="Settings"
          >
            ⚙
          </button>

          <button
            type="button"
            className="header-icon-button"
            onClick={toggleFullscreen}
            aria-label="Fullscreen"
            title="Fullscreen"
          >
            {isFullscreen ? "⛶" : "⛶"}
          </button>
        </div>
      </header>

      <section className="game-topbar">
        <div className="difficulty-control">
          <span>Difficulty:</span>
          <strong>
            {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}
          </strong>
        </div>

        <div className="game-stats">
          <div className="timer">
            <span className="timer-icon">◷</span>
            <strong>{formatTime(seconds)}</strong>
          </div>

          <div className="stats-divider" />

          <div className="mistakes">
            <span>⚠</span>
            <span>Mistakes:</span>
            <strong>
              {mistakes}/{maxMistakes}
            </strong>
          </div>

          <div className="stats-divider" />

          <div className="score-display">
            <span>Score:</span>
            <strong>{score}</strong>
          </div>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="pause-button"
            onClick={togglePause}
            aria-label={isPaused ? "Resume game" : "Pause game"}
          >
            <span className="pause-icon" aria-hidden="true">
              {isPaused ? (
                <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                  <path d="M8 5.5v13l10-6.5z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              )}
            </span>
            <span className="pause-label">{isPaused ? "Resume" : "Pause"}</span>
          </button>

          <button
            type="button"
            className="new-game-button"
            onClick={handleNewGame}
          >
            ↻
            <span>New Game</span>
          </button>
        </div>
      </section>

      {checkFeedback && (
        <div className={`check-feedback-banner ${checkFeedback.type}`} role="status">
          <span>{checkFeedback.type === "success" ? "✓" : "⚠"}</span>
          <p>{checkFeedback.text}</p>
          <button
            type="button"
            className="banner-close"
            onClick={clearCheckFeedback}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <section className="game-layout">
        <div className="board-section">
          <SudokuBoard
            board={board}
            puzzle={puzzle}
            notes={notes}
            selectedCell={selectedCell}
            mistakeCell={mistakeCell}
            onSelectCell={selectCell}
            isPaused={isPaused}
          />
        </div>

        <aside className="game-sidebar">
          <NumberPad
            numberStats={numberStats}
            onNumberClick={handleEnterNumber}
            onErase={handleErase}
            isPaused={isPaused}
          />

          <GameToolbar
            isNotesMode={isNotesMode}
            onToggleNotes={toggleNotesMode}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            onHint={handleHint}
            hints={hints}
            onCheck={checkBoard}
            isPaused={isPaused}
          />
        </aside>
      </section>

      <section className="how-to-play">
        <div className="info-icon">i</div>
        <div className="how-to-content">
          <h2>How to play</h2>
          <p>
            Fill the grid with numbers 1–9 so that each number appears only once in each
            row, column, and 3×3 box. Use Arrow Keys or WASD to navigate smoothly.
          </p>
        </div>
        <button
          type="button"
          className="rules-button"
          onClick={() => setRulesOpen(true)}
        >
          View Rules
        </button>
      </section>

      <footer className="game-footer">
        <div>
          <strong>Sudoku — Challenge Your Mind</strong>
          <span>Play anytime, anywhere.</span>
        </div>
        <div className="offline-status">
          <span className="wifi-icon">◉</span>
          <div>
            <strong>Offline Ready</strong>
            <span>Your current game is saved locally.</span>
          </div>
        </div>
      </footer>

      <GameModal
        gameStatus={gameStatus}
        difficulty={currentDifficulty}
        score={score}
        mistakes={mistakes}
        onNewGame={handleNewGame}
        onRestart={handleRestart}
      />

      {settingsOpen && (
        <div
          className="app-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSettingsOpen(false);
            }
          }}
        >
          <section
            className="app-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
          >
            <div className="modal-header-row">
              <div>
                <p className="modal-eyebrow">PREFERENCES</p>
                <h2 id="settings-title">Settings</h2>
              </div>
              <button
                type="button"
                className="modal-close-button"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close settings"
              >
                ×
              </button>
            </div>

            <div className="settings-list">
              <button
                type="button"
                className="setting-row"
                onClick={toggleTheme}
              >
                <span>
                  <strong>Theme</strong>
                  <small>{theme === "dark" ? "Dark" : "Light"}</small>
                </span>
                <b>{theme === "dark" ? "☾" : "☀"}</b>
              </button>

              <button
                type="button"
                className="setting-row"
                onClick={() => updateSettingField("soundEnabled", !soundEnabled)}
              >
                <span>
                  <strong>Sound Effects</strong>
                  <small>{soundEnabled ? "On" : "Off"}</small>
                </span>
                <b>{soundEnabled ? "✓" : "×"}</b>
              </button>

              <button
                type="button"
                className="setting-row"
                onClick={() => updateSettingField("highlightEnabled", !highlightEnabled)}
              >
                <span>
                  <strong>Highlight Same Numbers</strong>
                  <small>{highlightEnabled ? "On" : "Off"}</small>
                </span>
                <b>{highlightEnabled ? "✓" : "×"}</b>
              </button>

              <button
                type="button"
                className="setting-row"
                onClick={() => updateSettingField("confirmRestart", !confirmRestart)}
              >
                <span>
                  <strong>Confirm Restart</strong>
                  <small>{confirmRestart ? "On" : "Off"}</small>
                </span>
                <b>{confirmRestart ? "✓" : "×"}</b>
              </button>
            </div>
          </section>
        </div>
      )}

      {rulesOpen && (
        <div
          className="app-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setRulesOpen(false);
            }
          }}
        >
          <section
            className="app-modal rules-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rules-title"
          >
            <div className="modal-header-row">
              <div>
                <p className="modal-eyebrow">HOW TO PLAY</p>
                <h2 id="rules-title">Sudoku Rules</h2>
              </div>
              <button
                type="button"
                className="modal-close-button"
                onClick={() => setRulesOpen(false)}
                aria-label="Close rules"
              >
                ×
              </button>
            </div>

            <div className="rules-content">
              <div>
                <strong>1. Fill the grid</strong>
                <p>Place numbers 1–9 in every empty cell.</p>
              </div>

              <div>
                <strong>2. Follow the three rules</strong>
                <p>Every number must appear only once in each row, column, and 3×3 box.</p>
              </div>

              <div>
                <strong>3. Notes Mode</strong>
                <p>Use Notes Mode (Press N) to pencil in possible candidates inside an empty cell.</p>
              </div>

              <div>
                <strong>4. Mistakes</strong>
                <p>You can make up to three mistakes. Entering an incorrect number counts as a mistake.</p>
              </div>

              <div>
                <strong>5. Hints & Check</strong>
                <p>You have three hints. Click Check anytime to verify your current entries.</p>
              </div>

              <div>
                <strong>6. Keyboard Controls</strong>
                <p>
                  Arrows / WASD: Move · 1–9: Input · Delete: Erase · N: Notes · H: Hint · P: Pause · Ctrl+Z: Undo · Ctrl+Y: Redo
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function Game() {
  const location = useLocation();
  const savedGame = loadCurrentGame();
  const requestedDifficulty = location.state?.difficulty;

  const shouldContinue = !requestedDifficulty && Boolean(savedGame);
  const difficulty = requestedDifficulty ?? savedGame?.difficulty;

  const navigate = useNavigate();

  useEffect(() => {
    if (!difficulty && !shouldContinue) {
      navigate("/new-game", { replace: true });
    }
  }, [difficulty, shouldContinue, navigate]);

  if (!difficulty) {
    return null;
  }

  const gameToLoad = shouldContinue ? savedGame : null;

  return (
    <GameScreen
      key={gameToLoad ? `saved-${gameToLoad.savedAt ?? "game"}` : `new-${difficulty}`}
      difficulty={difficulty}
      savedGame={gameToLoad}
    />
  );
}

export default Game;