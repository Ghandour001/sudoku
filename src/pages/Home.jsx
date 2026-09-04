import { Link } from "react-router-dom";
import { hasCurrentGame } from "../utils/storage.js";

function Home() {
  const canContinue =
    hasCurrentGame();

  return (
    <main className="home-page">
      <section className="hero">
        <p className="eyebrow">
          BRAIN TRAINING
        </p>

        <h1>
          Sudoku
        </h1>

        <p className="hero-description">
          Challenge your mind, improve your logic,
          and solve puzzles at your own pace.
        </p>

        <div className="home-actions">
          <Link
            to="/new-game"
            className="primary-button"
          >
            New Game
          </Link>

          {canContinue ? (
            <Link
              to="/game"
              className="secondary-button"
            >
              Continue Game
            </Link>
          ) : (
            <span
              className="secondary-button disabled-home-button"
              aria-disabled="true"
            >
              No Saved Game
            </span>
          )}
        </div>
      </section>

      <section className="home-features">
        <div className="feature-card">
          <span className="feature-icon">
            ◈
          </span>

          <h2>
            Multiple Difficulties
          </h2>

          <p>
            Choose from Easy, Medium,
            Hard, and Expert puzzles.
          </p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">
            ◷
          </span>

          <h2>
            Track Your Time
          </h2>

          <p>
            Improve your solving speed
            and beat your personal records.
          </p>
        </div>

        <div className="feature-card">
          <span className="feature-icon">
            ✦
          </span>

          <h2>
            Train Your Brain
          </h2>

          <p>
            Practice logical thinking with
            a new puzzle whenever you want.
          </p>
        </div>
      </section>

      <section className="home-bottom">
        <Link
          to="/statistics"
          className="stats-link"
        >
          View Statistics →
        </Link>
      </section>
    </main>
  );
}

export default Home;