import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  clearCurrentGame,
} from "../utils/storage.js";


const difficulties = [
  {
    value: "easy",
    title: "Easy",
    description:
      "A gentle puzzle to warm up your brain.",
    icon: "◈",
  },
  {
    value: "medium",
    title: "Medium",
    description:
      "A balanced challenge for everyday practice.",
    icon: "◆",
  },
  {
    value: "hard",
    title: "Hard",
    description:
      "For players who want a serious challenge.",
    icon: "✦",
  },
  {
    value: "expert",
    title: "Expert",
    description:
      "The ultimate Sudoku challenge.",
    icon: "♛",
  },
];

function NewGame() {
  const navigate =
    useNavigate();

  const [
    selectedDifficulty,
    setSelectedDifficulty,
  ] = useState("medium");

  const startGame = () => {
  clearCurrentGame();

  navigate("/game", {
    state: {
      difficulty: selectedDifficulty,
    },
  });
};

  return (
    <main className="new-game-page">
      <div className="new-game-card">
        <div className="new-game-heading">
          <p className="eyebrow">
            NEW GAME
          </p>

          <h1>
            Choose Your
            <span>
              {" "}
              Difficulty
            </span>
          </h1>

          <p>
            Select a difficulty level
            and start a new Sudoku
            puzzle.
          </p>
        </div>

        <div className="difficulty-options">
          {difficulties.map(
            (difficulty) => (
              <button
                key={
                  difficulty.value
                }
                type="button"
                className={[
                  "difficulty-option",
                  selectedDifficulty ===
                  difficulty.value
                    ? "selected"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() =>
                  setSelectedDifficulty(
                    difficulty.value,
                  )
                }
              >
                <span className="difficulty-icon">
                  {
                    difficulty.icon
                  }
                </span>

                <span className="difficulty-content">
                  <strong>
                    {
                      difficulty.title
                    }
                  </strong>

                  <span>
                    {
                      difficulty.description
                    }
                  </span>
                </span>

                <span className="difficulty-check">
                  {selectedDifficulty ===
                  difficulty.value
                    ? "✓"
                    : ""}
                </span>
              </button>
            ),
          )}
        </div>

        <div className="new-game-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              navigate("/")
            }
          >
            Back
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={
              startGame
            }
          >
            Start Game
          </button>
        </div>
      </div>
    </main>
  );
}

export default NewGame;