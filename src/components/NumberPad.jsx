function NumberPad({
  numberStats,
  onNumberClick,
  onErase,
  isPaused,
}) {
  return (
    <div className="number-pad">
      <div className="number-grid">
        {numberStats.map(({ number, remaining, disabled }) => (
          <button
            key={number}
            type="button"
            className="number-button"
            disabled={disabled || isPaused}
            onClick={() => onNumberClick(number)}
            aria-label={`Number ${number}, ${remaining} remaining`}
          >
            <span className="number-value">{number}</span>
            <span className="number-remaining">{remaining} left</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="erase-button"
        onClick={onErase}
        disabled={isPaused}
        aria-label="Erase selected cell"
      >
        <span className="erase-icon">×</span>
        <span>Erase</span>
      </button>
    </div>
  );
}

export default NumberPad;