function GameModal({
  gameStatus,
  difficulty,
  score,
  mistakes,
  onNewGame,
  onRestart,
}) {
  if (
    gameStatus !== "won" &&
    gameStatus !== "lost"
  ) {
    return null;
  }

  const isWon =
    gameStatus === "won";

  return (
    <div className="game-modal-overlay">
      <div className="game-modal">
        <div
          className={`modal-icon ${
            isWon
              ? "modal-success"
              : "modal-failure"
          }`}
        >
          {isWon ? "✓" : "!"}
        </div>

        <p className="modal-eyebrow">
          {isWon
            ? "PUZZLE COMPLETE"
            : "GAME OVER"}
        </p>

        <h2>
          {isWon
            ? "Well Done!"
            : "Better Luck Next Time"}
        </h2>

        <p className="modal-description">
          {isWon
            ? "You solved the Sudoku puzzle successfully."
            : "You reached the maximum number of mistakes."}
        </p>

        <div className="modal-stats">
          <div>
            <span>Difficulty</span>
            <strong>
              {difficulty}
            </strong>
          </div>

          <div>
            <span>Score</span>
            <strong>
              {score}
            </strong>
          </div>

          <div>
            <span>Mistakes</span>
            <strong>
              {mistakes}/3
            </strong>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="primary-button"
            onClick={onNewGame}
          >
            New Game
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={onRestart}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameModal;