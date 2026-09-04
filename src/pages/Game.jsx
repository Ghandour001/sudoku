import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import useSudoku from "../hooks/useSudoku.js";
import useTimer from "../hooks/useTimer.js";

import {
  clearCurrentGame,
  loadCurrentGame,
  saveCurrentGame,
} from "../utils/storage.js";

import {
  recordGameResult,
} from "../utils/statistics.js";

import SudokuBoard from "../components/SudokuBoard.jsx";
import NumberPad from "../components/NumberPad.jsx";
import GameToolbar from "../components/GameToolbar.jsx";
import GameModal from "../components/GameModal.jsx";

function formatTime(seconds) {
  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    seconds % 60;

  return `${String(
    minutes,
  ).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function GameScreen({
  difficulty,
  savedGame,
}) {
  const navigate =
    useNavigate();

  const sudoku =
    useSudoku(
      difficulty,
      savedGame,
    );

  const {
    puzzle,
    board,
    notes,

    difficulty: currentDifficulty,

    score,
    mistakes,
    maxMistakes,
    hints,

    isNotesMode,
    isPaused,
    gameStatus,

    selectedCell,
    mistakeCell,

    numberStats,

    canUndo,
    canRedo,

    restartGame,

    selectCell,
    enterNumber,
    eraseCell,

    undo,
    redo,

    useHint,
    checkBoard,

    togglePause,
    toggleNotesMode,

    clearMistake,
  } = sudoku;

  const {
    seconds,
    reset: resetTimer,
    setTime,
  } = useTimer(
    savedGame?.elapsedSeconds ?? 0,
    gameStatus === "playing" &&
      !isPaused,
  );

  const [theme, setTheme] =
    useState(() => {
      const stored =
        localStorage.getItem(
          "sudoku_theme",
        );

      return stored === "light"
        ? "light"
        : "dark";
    });

  const [
    settingsOpen,
    setSettingsOpen,
  ] = useState(false);

  const [
    rulesOpen,
    setRulesOpen,
  ] = useState(false);

  const [
    isFullscreen,
    setIsFullscreen,
  ] = useState(
    Boolean(
      document.fullscreenElement,
    ),
  );

  const [
    soundEnabled,
    setSoundEnabled,
  ] = useState(() =>
    localStorage.getItem(
      "sudoku_sound",
    ) !== "off",
  );

  const [
    highlightEnabled,
    setHighlightEnabled,
  ] = useState(() =>
    localStorage.getItem(
      "sudoku_highlight",
    ) !== "off",
  );

  const [
    confirmRestart,
    setConfirmRestart,
  ] = useState(() =>
    localStorage.getItem(
      "sudoku_confirm_restart",
    ) !== "off",
  );

  const hasRecordedResult =
    useRef(false);

  /*
   * Theme
   */
  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;

    document.body.dataset.theme =
      theme;

    localStorage.setItem(
      "sudoku_theme",
      theme,
    );
  }, [theme]);

  /*
   * Timer restoration
   *
   * Only runs once for a loaded game.
   */
  useEffect(() => {
    if (savedGame?.elapsedSeconds) {
      setTime(
        savedGame.elapsedSeconds,
      );
    }
  }, [savedGame, setTime]);

  /*
   * Save current game.
   *
   * Only an active game is saved.
   */
  useEffect(() => {
    if (
      gameStatus !== "playing"
    ) {
      return;
    }

    saveCurrentGame({
      puzzle,
      solution:
        sudoku.solution,
      board,
      notes,

      difficulty:
        currentDifficulty,

      difficultyScore:
        sudoku.difficultyScore,

      clues:
        sudoku.clues,

      score,
      mistakes,
      hints,

      maxMistakes,

      isPaused,
      isNotesMode,

      selectedCell,

      elapsedSeconds:
        seconds,
    });
  }, [
    puzzle,
    board,
    notes,
    currentDifficulty,
    score,
    mistakes,
    hints,
    maxMistakes,
    isPaused,
    isNotesMode,
    selectedCell,
    seconds,
    gameStatus,
    sudoku.solution,
    sudoku.difficultyScore,
    sudoku.clues,
  ]);

  /*
   * Record finished games exactly once.
   */
  useEffect(() => {
    if (
      gameStatus !== "won" &&
      gameStatus !== "lost"
    ) {
      return;
    }

    if (hasRecordedResult.current) {
      return;
    }

    hasRecordedResult.current =
      true;

    recordGameResult({
      difficulty:
        currentDifficulty,

      score,

      time: seconds,

      mistakes,

      hints:
        3 - hints,

      won:
        gameStatus === "won",
    });

    clearCurrentGame();
  }, [
    gameStatus,
    currentDifficulty,
    score,
    seconds,
    mistakes,
    hints,
  ]);

  /*
   * Mistake visual feedback.
   */
  useEffect(() => {
    if (!mistakeCell) {
      return undefined;
    }

    const timeout =
      window.setTimeout(
        () => {
          clearMistake();
        },
        650,
      );

    return () =>
      window.clearTimeout(
        timeout,
      );
  }, [
    mistakeCell,
    clearMistake,
  ]);

  /*
   * Fullscreen state.
   */
  useEffect(() => {
    const handleFullscreen =
      () => {
        setIsFullscreen(
          Boolean(
            document.fullscreenElement,
          ),
        );
      };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreen,
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreen,
      );
    };
  }, []);

  /*
   * Keyboard controls.
   */
  useEffect(() => {
    const handleKeyDown =
      (event) => {
        if (
          isPaused ||
          gameStatus !== "playing"
        ) {
          return;
        }

        if (
          event.target instanceof
            HTMLInputElement ||
          event.target instanceof
            HTMLTextAreaElement ||
          event.target instanceof
            HTMLSelectElement
        ) {
          return;
        }

        if (
          event.key >= "1" &&
          event.key <= "9"
        ) {
          enterNumber(
            Number(event.key),
          );

          return;
        }

        if (
          event.key ===
            "Delete" ||
          event.key ===
            "Backspace"
        ) {
          eraseCell();

          return;
        }

        if (
          event.key.toLowerCase() ===
          "n"
        ) {
          toggleNotesMode();

          return;
        }

        if (
          event.ctrlKey &&
          event.key.toLowerCase() ===
            "z"
        ) {
          event.preventDefault();

          undo();

          return;
        }

        if (
          event.ctrlKey &&
          event.key.toLowerCase() ===
            "y"
        ) {
          event.preventDefault();

          redo();
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    isPaused,
    gameStatus,
    enterNumber,
    eraseCell,
    toggleNotesMode,
    undo,
    redo,
  ]);

  const toggleTheme =
    () => {
      setTheme(
        (currentTheme) =>
          currentTheme === "dark"
            ? "light"
            : "dark",
      );
    };

  const toggleFullscreen =
    async () => {
      try {
        if (
          !document.fullscreenElement
        ) {
          await document.documentElement.requestFullscreen?.();
        } else {
          await document.exitFullscreen?.();
        }
      } catch (error) {
        console.error(
          "Fullscreen error:",
          error,
        );
      }
    };

  const handleRestart =
    () => {
      if (
        confirmRestart &&
        !window.confirm(
          "Restart this puzzle?",
        )
      ) {
        return;
      }

      restartGame();
      resetTimer();

      hasRecordedResult.current =
        false;

      clearCurrentGame();
    };

  const handleNewGame =
    () => {
      clearCurrentGame();

      navigate(
        "/new-game",
      );
    };

  const toggleSound =
    () => {
      setSoundEnabled(
        (current) => {
          const next =
            !current;

          localStorage.setItem(
            "sudoku_sound",
            next
              ? "on"
              : "off",
          );

          return next;
        },
      );
    };

  const toggleHighlight =
    () => {
      setHighlightEnabled(
        (current) => {
          const next =
            !current;

          localStorage.setItem(
            "sudoku_highlight",
            next
              ? "on"
              : "off",
          );

          return next;
        },
      );
    };

  const toggleConfirmRestart =
    () => {
      setConfirmRestart(
        (current) => {
          const next =
            !current;

          localStorage.setItem(
            "sudoku_confirm_restart",
            next
              ? "on"
              : "off",
          );

          return next;
        },
      );
    };

  return (
    <main
      className={`game-page ${
        highlightEnabled
          ? "highlight-enabled"
          : "highlight-disabled"
      }`}
    >
      <header className="game-header">
        <div className="brand">
          <Link
            to="/"
            className="brand-logo"
            aria-label="Sudoku Home"
          >
            ▦
          </Link>

          <div>
            <Link
              to="/"
              className="brand-name"
            >
              Sudoku
            </Link>

            <p>
              Train your mind
            </p>
          </div>
        </div>

        <nav className="game-nav">
          <Link to="/">
            Home
          </Link>

          <Link
            to="/game"
            className="active"
          >
            Game
          </Link>

          <Link to="/statistics">
            Statistics
          </Link>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="header-icon-button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark"
              ? "☀"
              : "☾"}
          </button>

          <button
            type="button"
            className="header-icon-button"
            onClick={() =>
              setSettingsOpen(true)
            }
            aria-label="Settings"
            title="Settings"
          >
            ⚙
          </button>

          <button
            type="button"
            className="header-icon-button"
            onClick={
              toggleFullscreen
            }
            aria-label="Fullscreen"
            title="Fullscreen"
          >
            {isFullscreen
              ? "⛶"
              : "⛶"}
          </button>
        </div>
      </header>

      <section className="game-topbar">
        <div className="difficulty-control">
          <span>
            Difficulty:
          </span>

          <strong>
            {currentDifficulty
              .charAt(0)
              .toUpperCase() +
              currentDifficulty.slice(
                1,
              )}
          </strong>
        </div>

        <div className="game-stats">
          <div className="timer">
            <span className="timer-icon">
              ◷
            </span>

            <strong>
              {formatTime(seconds)}
            </strong>
          </div>

          <div className="stats-divider" />

          <div className="mistakes">
            <span>
              ⚠
            </span>

            <span>
              Mistakes:
            </span>

            <strong>
              {mistakes}/
              {maxMistakes}
            </strong>
          </div>

          <div className="stats-divider" />

          <div className="score-display">
            <span>
              Score:
            </span>

            <strong>
              {score}
            </strong>
          </div>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="pause-button"
            onClick={
              togglePause
            }
          >
            <span className="pause-icon" aria-hidden="true">
  {isPaused ? (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="currentColor"
    >
      <path d="M8 5.5v13l10-6.5z" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="currentColor"
    >
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  )}
</span>

<span className="pause-label">
  {isPaused ? "Resume" : "Pause"}
</span>
          </button>

          <button
            type="button"
            className="new-game-button"
            onClick={
              handleNewGame
            }
          >
            ↻
            <span>
              New Game
            </span>
          </button>
        </div>
      </section>

      <section className="game-layout">
        <div className="board-section">
          <SudokuBoard
            board={board}
            puzzle={puzzle}
            notes={notes}
            selectedCell={
              selectedCell
            }
            mistakeCell={
              mistakeCell
            }
            onSelectCell={
              selectCell
            }
            isPaused={
              isPaused
            }
          />
        </div>

        <aside className="game-sidebar">
          <NumberPad
            numberStats={
              numberStats
            }
            onNumberClick={
              enterNumber
            }
            onErase={
              eraseCell
            }
            isPaused={
              isPaused
            }
          />

          <GameToolbar
            isNotesMode={
              isNotesMode
            }
            onToggleNotes={
              toggleNotesMode
            }
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            onHint={useHint}
            hints={hints}
            onCheck={
              checkBoard
            }
            isPaused={
              isPaused
            }
          />
        </aside>
      </section>

      <section className="how-to-play">
        <div className="info-icon">
          i
        </div>

        <div className="how-to-content">
          <h2>
            How to play
          </h2>

          <p>
            Fill the grid with
            numbers 1–9 so that
            each number appears
            only once in each
            row, column, and 3×3
            box.
          </p>
        </div>

        <button
          type="button"
          className="rules-button"
          onClick={() =>
            setRulesOpen(true)
          }
        >
          View Rules
        </button>
      </section>

      <footer className="game-footer">
        <div>
          <strong>
            Sudoku — Challenge
            Your Mind
          </strong>

          <span>
            Play anytime,
            anywhere.
          </span>
        </div>

        <div className="offline-status">
          <span className="wifi-icon">
            ◉
          </span>

          <div>
            <strong>
              Offline Ready
            </strong>

            <span>
              Your current game is
              saved locally.
            </span>
          </div>
        </div>
      </footer>

      <GameModal
        gameStatus={
          gameStatus
        }
        difficulty={
          currentDifficulty
        }
        score={score}
        mistakes={mistakes}
        onNewGame={
          handleNewGame
        }
        onRestart={
          handleRestart
        }
      />

      {settingsOpen && (
        <div
          className="app-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSettingsOpen(
                false,
              );
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
                <p className="modal-eyebrow">
                  PREFERENCES
                </p>

                <h2 id="settings-title">
                  Settings
                </h2>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={() =>
                  setSettingsOpen(
                    false,
                  )
                }
                aria-label="Close settings"
              >
                ×
              </button>
            </div>

            <div className="settings-list">
              <button
                type="button"
                className="setting-row"
                onClick={
                  toggleTheme
                }
              >
                <span>
                  <strong>
                    Theme
                  </strong>

                  <small>
                    {theme ===
                    "dark"
                      ? "Dark"
                      : "Light"}
                  </small>
                </span>

                <b>
                  {theme ===
                  "dark"
                    ? "☾"
                    : "☀"}
                </b>
              </button>

              <button
                type="button"
                className="setting-row"
                onClick={
                  toggleSound
                }
              >
                <span>
                  <strong>
                    Sound Effects
                  </strong>

                  <small>
                    {soundEnabled
                      ? "On"
                      : "Off"}
                  </small>
                </span>

                <b>
                  {soundEnabled
                    ? "✓"
                    : "×"}
                </b>
              </button>

              <button
                type="button"
                className="setting-row"
                onClick={
                  toggleHighlight
                }
              >
                <span>
                  <strong>
                    Highlight Same Numbers
                  </strong>

                  <small>
                    {highlightEnabled
                      ? "On"
                      : "Off"}
                  </small>
                </span>

                <b>
                  {highlightEnabled
                    ? "✓"
                    : "×"}
                </b>
              </button>

              <button
                type="button"
                className="setting-row"
                onClick={
                  toggleConfirmRestart
                }
              >
                <span>
                  <strong>
                    Confirm Restart
                  </strong>

                  <small>
                    {confirmRestart
                      ? "On"
                      : "Off"}
                  </small>
                </span>

                <b>
                  {confirmRestart
                    ? "✓"
                    : "×"}
                </b>
              </button>
            </div>
          </section>
        </div>
      )}

      {rulesOpen && (
        <div
          className="app-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setRulesOpen(
                false,
              );
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
                <p className="modal-eyebrow">
                  HOW TO PLAY
                </p>

                <h2 id="rules-title">
                  Sudoku Rules
                </h2>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={() =>
                  setRulesOpen(
                    false,
                  )
                }
                aria-label="Close rules"
              >
                ×
              </button>
            </div>

            <div className="rules-content">
              <div>
                <strong>
                  1. Fill the grid
                </strong>

                <p>
                  Place numbers 1–9
                  in every empty cell.
                </p>
              </div>

              <div>
                <strong>
                  2. Follow the three rules
                </strong>

                <p>
                  Every number must
                  appear only once in
                  each row, column, and
                  3×3 box.
                </p>
              </div>

              <div>
                <strong>
                  3. Notes Mode
                </strong>

                <p>
                  Use Notes Mode to
                  keep possible
                  candidates inside an
                  empty cell.
                </p>
              </div>

              <div>
                <strong>
                  4. Mistakes
                </strong>

                <p>
                  You can make up to
                  three mistakes.
                </p>
              </div>

              <div>
                <strong>
                  5. Hints
                </strong>

                <p>
                  You have three hints.
                  Hints reduce your score.
                </p>
              </div>

              <div>
                <strong>
                  6. Keyboard
                </strong>

                <p>
                  1–9: input · Delete:
                  erase · N: Notes ·
                  Ctrl+Z: Undo ·
                  Ctrl+Y: Redo
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
  const location =
    useLocation();

  const savedGame =
    loadCurrentGame();

  const requestedDifficulty =
    location.state?.difficulty;

  const shouldContinue =
    !requestedDifficulty &&
    Boolean(savedGame);

  const difficulty =
    requestedDifficulty ??
    savedGame?.difficulty;

  const navigate =
    useNavigate();

  useEffect(() => {
    if (
      !difficulty &&
      !shouldContinue
    ) {
      navigate(
        "/new-game",
        {
          replace: true,
        },
      );
    }
  }, [
    difficulty,
    shouldContinue,
    navigate,
  ]);

  if (!difficulty) {
    return null;
  }

  const gameToLoad =
    shouldContinue
      ? savedGame
      : null;

  return (
    <GameScreen
      key={
        gameToLoad
          ? `saved-${gameToLoad.savedAt ?? "game"}`
          : `new-${difficulty}`
      }
      difficulty={difficulty}
      savedGame={
        gameToLoad
      }
    />
  );
}

export default Game;