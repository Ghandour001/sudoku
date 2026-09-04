function SudokuCell({
  value,
  notes,
  row,
  col,
  isGiven,
  isSelected,
  isSameNumber,
  isRelated,
  isMistake,
  onClick,
}) {
  return (
    <button
      type="button"
      className={[
        "sudoku-cell",

        isGiven
          ? "given"
          : "editable",

        isSelected
          ? "selected"
          : "",

        isSameNumber
          ? "same-number"
          : "",

        isRelated
          ? "related"
          : "",

        isMistake
          ? "mistake"
          : "",

        col === 2 || col === 5
          ? "box-right"
          : "",

        row === 2 || row === 5
          ? "box-bottom"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}

      onClick={() =>
        onClick(row, col)
      }

      aria-label={`Row ${
        row + 1
      }, Column ${
        col + 1
      }`}
    >
      {value !== 0 ? (
        <span className="cell-value">
          {value}
        </span>
      ) : (
        <span className="cell-notes">
          {notes.map((note) => (
            <span
              key={note}
              className="cell-note"
            >
              {note}
            </span>
          ))}
        </span>
      )}
    </button>
  );
}

export default SudokuCell;