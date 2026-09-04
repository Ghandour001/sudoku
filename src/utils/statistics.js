const STATISTICS_KEY =
  "sudoku_statistics";

const DEFAULT_STATISTICS = {
  gamesPlayed: 0,
  gamesWon: 0,

  totalScore: 0,
  bestScore: 0,

  totalTime: 0,
  bestTime: null,

  totalMistakes: 0,
  totalHints: 0,

  difficulties: {
    easy: {
      played: 0,
      won: 0,
      bestScore: 0,
      bestTime: null,
    },

    medium: {
      played: 0,
      won: 0,
      bestScore: 0,
      bestTime: null,
    },

    hard: {
      played: 0,
      won: 0,
      bestScore: 0,
      bestTime: null,
    },

    expert: {
      played: 0,
      won: 0,
      bestScore: 0,
      bestTime: null,
    },
  },
};

function cloneDefaultStatistics() {
  return JSON.parse(
    JSON.stringify(
      DEFAULT_STATISTICS,
    ),
  );
}

function getStatistics() {
  try {
    const raw =
      localStorage.getItem(
        STATISTICS_KEY,
      );

    if (!raw) {
      return cloneDefaultStatistics();
    }

    const parsed =
      JSON.parse(raw);

    const defaults =
      cloneDefaultStatistics();

    return {
      ...defaults,
      ...parsed,

      difficulties: {
        ...defaults.difficulties,

        ...(parsed.difficulties ||
          {}),
      },
    };
  } catch (error) {
    console.error(
      "Failed to load statistics:",
      error,
    );

    return cloneDefaultStatistics();
  }
}

function saveStatistics(
  statistics,
) {
  try {
    localStorage.setItem(
      STATISTICS_KEY,
      JSON.stringify(
        statistics,
      ),
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to save statistics:",
      error,
    );

    return false;
  }
}

export function recordGameResult({
  difficulty,
  score,
  time,
  mistakes,
  hints,
  won,
}) {
  const statistics =
    getStatistics();

  const safeDifficulty =
    statistics.difficulties[
      difficulty
    ]
      ? difficulty
      : "medium";

  const numericScore =
    Math.max(
      0,
      Number(score) || 0,
    );

  const numericTime =
    Math.max(
      0,
      Number(time) || 0,
    );

  const numericMistakes =
    Math.max(
      0,
      Number(mistakes) || 0,
    );

  const numericHints =
    Math.max(
      0,
      Number(hints) || 0,
    );

  statistics.gamesPlayed += 1;

  statistics.totalScore +=
    numericScore;

  statistics.totalTime +=
    numericTime;

  statistics.totalMistakes +=
    numericMistakes;

  statistics.totalHints +=
    numericHints;

  statistics.bestScore =
    Math.max(
      statistics.bestScore,
      numericScore,
    );

  if (
    won &&
    (
      statistics.bestTime ===
        null ||
      numericTime <
        statistics.bestTime
    )
  ) {
    statistics.bestTime =
      numericTime;
  }

  const difficultyStats =
    statistics.difficulties[
      safeDifficulty
    ];

  difficultyStats.played += 1;

  difficultyStats.bestScore =
    Math.max(
      difficultyStats.bestScore,
      numericScore,
    );

  if (won) {
    statistics.gamesWon += 1;

    difficultyStats.won += 1;

    if (
      difficultyStats.bestTime ===
        null ||
      numericTime <
        difficultyStats.bestTime
    ) {
      difficultyStats.bestTime =
        numericTime;
    }
  }

  saveStatistics(
    statistics,
  );

  return statistics;
}

export function getStoredStatistics() {
  return getStatistics();
}

export function resetStatistics() {
  const statistics =
    cloneDefaultStatistics();

  saveStatistics(
    statistics,
  );

  return statistics;
}