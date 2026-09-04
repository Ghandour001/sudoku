const CURRENT_GAME_KEY = "sudoku_current_game";

function isValidBoard(board) {
  return (
    Array.isArray(board) &&
    board.length === 9 &&
    board.every(
      (row) =>
        Array.isArray(row) &&
        row.length === 9,
    )
  );
}

function isValidNotes(notes) {
  return (
    Array.isArray(notes) &&
    notes.length === 9 &&
    notes.every(
      (row) =>
        Array.isArray(row) &&
        row.length === 9 &&
        row.every((cell) => Array.isArray(cell)),
    )
  );
}

function isValidGameData(data) {
  if (!data || typeof data !== "object") {
    return false;
  }

  return (
    isValidBoard(data.puzzle) &&
    isValidBoard(data.solution) &&
    isValidBoard(data.board) &&
    isValidNotes(data.notes)
  );
}

export function saveCurrentGame(game) {
  try {
    if (!isValidGameData(game)) {
      return false;
    }

    const data = {
      puzzle: game.puzzle,
      solution: game.solution,
      board: game.board,
      notes: game.notes,

      difficulty: game.difficulty ?? "medium",
      difficultyScore:
        Number(game.difficultyScore) || 0,

      clues: Number(game.clues) || 0,
      score: Math.max(0, Number(game.score) || 0),

      mistakes: Math.max(
        0,
        Number(game.mistakes) || 0,
      ),

      hints: Math.max(
        0,
        Number(game.hints) || 0,
      ),

      maxMistakes: Math.max(
        1,
        Number(game.maxMistakes) || 3,
      ),

      isPaused: Boolean(game.isPaused),
      isNotesMode: Boolean(game.isNotesMode),

      selectedCell:
        game.selectedCell ?? null,

      elapsedSeconds: Math.max(
        0,
        Number(game.elapsedSeconds) || 0,
      ),

      savedAt: Date.now(),
    };

    localStorage.setItem(
      CURRENT_GAME_KEY,
      JSON.stringify(data),
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to save current game:",
      error,
    );

    return false;
  }
}

export function loadCurrentGame() {
  try {
    const raw =
      localStorage.getItem(CURRENT_GAME_KEY);

    if (!raw) {
      return null;
    }

    const data = JSON.parse(raw);

    if (!isValidGameData(data)) {
      localStorage.removeItem(
        CURRENT_GAME_KEY,
      );

      return null;
    }

    return {
      ...data,

      difficulty:
        data.difficulty ?? "medium",

      difficultyScore:
        Number(data.difficultyScore) || 0,

      clues:
        Number(data.clues) || 0,

      score: Math.max(
        0,
        Number(data.score) || 0,
      ),

      mistakes: Math.max(
        0,
        Number(data.mistakes) || 0,
      ),

      hints:
        data.hints === undefined
          ? 3
          : Math.max(0, Number(data.hints) || 0),

      maxMistakes:
        data.maxMistakes === undefined
          ? 3
          : Math.max(
              1,
              Number(data.maxMistakes) || 3,
            ),

      isPaused: Boolean(data.isPaused),

      isNotesMode: Boolean(
        data.isNotesMode,
      ),

      selectedCell:
        data.selectedCell ?? null,

      elapsedSeconds: Math.max(
        0,
        Number(data.elapsedSeconds) || 0,
      ),
    };
  } catch (error) {
    console.error(
      "Failed to load current game:",
      error,
    );

    return null;
  }
}

export function clearCurrentGame() {
  try {
    localStorage.removeItem(
      CURRENT_GAME_KEY,
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to clear current game:",
      error,
    );

    return false;
  }
}

export function hasCurrentGame() {
  return loadCurrentGame() !== null;
}