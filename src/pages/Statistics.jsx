import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getStoredStatistics,
  resetStatistics,
} from "../utils/statistics.js";

function formatTime(seconds) {
  if (
    seconds === null ||
    seconds === undefined
  ) {
    return "--:--";
  }

  const safeSeconds =
    Math.max(
      0,
      Number(seconds) || 0,
    );

  const minutes =
    Math.floor(
      safeSeconds / 60,
    );

  const remaining =
    safeSeconds % 60;

  return `${String(
    minutes,
  ).padStart(2, "0")}:${String(
    remaining,
  ).padStart(2, "0")}`;
}

function getWinRate(
  played,
  won,
) {
  if (!played) {
    return 0;
  }

  return Math.round(
    (won / played) * 100,
  );
}

function Statistics() {
  const [
    statistics,
    setStatistics,
  ] = useState(
    () => getStoredStatistics(),
  );

  const handleReset =
    () => {
      if (
        !window.confirm(
          "Reset all statistics?",
        )
      ) {
        return;
      }

      setStatistics(
        resetStatistics(),
      );
    };

  const winRate =
    getWinRate(
      statistics.gamesPlayed,
      statistics.gamesWon,
    );

  const averageTime =
    statistics.gamesPlayed > 0
      ? Math.round(
          statistics.totalTime /
            statistics.gamesPlayed,
        )
      : 0;

  const averageMistakes =
    statistics.gamesPlayed > 0
      ? (
          statistics.totalMistakes /
          statistics.gamesPlayed
        ).toFixed(1)
      : "0.0";

  const difficultyNames = [
    "easy",
    "medium",
    "hard",
    "expert",
  ];

  return (
    <main className="statistics-page">
      <section className="statistics-heading">
        <div>
          <p className="eyebrow">
            PERFORMANCE
          </p>

          <h1>
            Statistics
          </h1>

          <p>
            Track your progress
            across every difficulty.
          </p>
        </div>

        <div className="statistics-actions">
          <Link
            to="/"
            className="secondary-button"
          >
            Home
          </Link>

          <Link
            to="/new-game"
            className="primary-button"
          >
            New Game
          </Link>
        </div>
      </section>

      <section className="statistics-grid">
        <div className="stat-card">
          <span>
            Games Played
          </span>

          <strong>
            {statistics.gamesPlayed}
          </strong>
        </div>

        <div className="stat-card">
          <span>
            Games Won
          </span>

          <strong>
            {statistics.gamesWon}
          </strong>
        </div>

        <div className="stat-card">
          <span>
            Win Rate
          </span>

          <strong>
            {winRate}%
          </strong>
        </div>

        <div className="stat-card">
          <span>
            Best Score
          </span>

          <strong>
            {statistics.bestScore}
          </strong>
        </div>

        <div className="stat-card">
          <span>
            Best Time
          </span>

          <strong>
            {formatTime(
              statistics.bestTime,
            )}
          </strong>
        </div>

        <div className="stat-card">
          <span>
            Average Time
          </span>

          <strong>
            {formatTime(
              averageTime,
            )}
          </strong>
        </div>
      </section>

      <section className="statistics-small-grid">
        <div className="stat-card">
          <span>
            Total Score
          </span>

          <strong>
            {statistics.totalScore}
          </strong>
        </div>

        <div className="stat-card">
          <span>
            Total Mistakes
          </span>

          <strong>
            {statistics.totalMistakes}
          </strong>
        </div>

        <div className="stat-card">
          <span>
            Average Mistakes
          </span>

          <strong>
            {averageMistakes}
          </strong>
        </div>

        <div className="stat-card">
          <span>
            Total Hints Used
          </span>

          <strong>
            {statistics.totalHints}
          </strong>
        </div>
      </section>

      <section className="difficulty-performance">
        <p className="eyebrow">
          BY DIFFICULTY
        </p>

        <h2>
          Detailed Performance
        </h2>

        <div className="difficulty-stat-grid">
          {difficultyNames.map(
            (difficulty) => {
              const data =
                statistics
                  .difficulties[
                  difficulty
                ];

              const rate =
                getWinRate(
                  data.played,
                  data.won,
                );

              return (
                <article
                  key={difficulty}
                  className="difficulty-stat-card"
                >
                  <div className="difficulty-stat-header">
                    <h3>
                      {difficulty
                        .charAt(0)
                        .toUpperCase() +
                        difficulty.slice(
                          1,
                        )}
                    </h3>

                    <span>
                      {rate}% win
                    </span>
                  </div>

                  <div className="difficulty-stat-values">
                    <div>
                      <small>
                        Played
                      </small>

                      <strong>
                        {data.played}
                      </strong>
                    </div>

                    <div>
                      <small>
                        Won
                      </small>

                      <strong>
                        {data.won}
                      </strong>
                    </div>

                    <div>
                      <small>
                        Best Score
                      </small>

                      <strong>
                        {data.bestScore}
                      </strong>
                    </div>

                    <div>
                      <small>
                        Best Time
                      </small>

                      <strong>
                        {formatTime(
                          data.bestTime,
                        )}
                      </strong>
                    </div>
                  </div>
                </article>
              );
            },
          )}
        </div>
      </section>

      <section className="statistics-reset">
        <button
          type="button"
          className="danger-button"
          onClick={
            handleReset
          }
        >
          Reset Statistics
        </button>
      </section>
    </main>
  );
}

export default Statistics;