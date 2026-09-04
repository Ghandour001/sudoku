function GameToolbar({
  isNotesMode,
  onToggleNotes,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onHint,
  hints,
  onCheck,
  isPaused,
}) {
  return (
    <div className="game-toolbar">
      <div className="input-mode-row">
        <button
          type="button"
          className={`mode-button ${
            !isNotesMode
              ? "active"
              : ""
          }`}
          onClick={() => {
            if (isNotesMode) {
              onToggleNotes();
            }
          }}
          disabled={isPaused}
        >
          <span className="mode-icon">
            123
          </span>

          <span>
            Normal
            <br />
            Input
          </span>
        </button>

        <button
          type="button"
          className={`mode-button ${
            isNotesMode
              ? "active"
              : ""
          }`}
          onClick={() => {
            if (!isNotesMode) {
              onToggleNotes();
            }
          }}
          disabled={isPaused}
        >
          <span className="mode-icon notes-icon">
            A B C
            <br />
            ✎
          </span>

          <span>
            Notes
            <br />
            Mode
          </span>
        </button>
      </div>

      <div className="history-row">
        <button
          type="button"
          className="tool-button"
          onClick={onUndo}
          disabled={
            !canUndo ||
            isPaused
          }
        >
          <span>↶</span>
          <span>Undo</span>
        </button>

        <button
          type="button"
          className="tool-button"
          onClick={onRedo}
          disabled={
            !canRedo ||
            isPaused
          }
        >
          <span>↷</span>
          <span>Redo</span>
        </button>
      </div>

      <div className="action-row">
        <button
          type="button"
          className="tool-button hint-button"
          onClick={onHint}
          disabled={
            hints <= 0 ||
            isPaused
          }
        >
          <span>💡</span>

          <span>Hint</span>

          <span className="hint-count">
            {hints}
          </span>
        </button>

        <button
          type="button"
          className="tool-button"
          onClick={onCheck}
          disabled={isPaused}
        >
          <span>✓</span>
          <span>Check</span>
        </button>
      </div>
    </div>
  );
}

export default GameToolbar;