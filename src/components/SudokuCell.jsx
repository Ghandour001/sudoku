function SudokuCell({
  value,
  notes = [],
  row,
  col,
  isGiven,
  isSelected,
  isSameNumber,
  isRelated,
  isMistake,
  onClick,
}) {
  const cellClasses = [
    "sudoku-cell",
    isGiven ? "given" : "editable",
    isSelected ? "selected" : "",
    isSameNumber ? "same-number" : "",
    isRelated ? "related" : "",
    isMistake ? "mistake" : "",
    col === 2 || col === 5 ? "box-right" : "",
    row === 2 || row === 5 ? "box-bottom" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const cellStatus = isGiven
    ? `Given number ${value}`
    : value !== 0
      ? `Entered number ${value}`
      : notes.length > 0
        ? `Notes: ${notes.join(", ")}`
        : "Empty";

  return (
    <button
      type="button"
      className={cellClasses}
      onClick={() => onClick(row, col)}
      aria-label={`Row ${row + 1}, Column ${col + 1}. ${cellStatus}`}
    >
      {value !== 0 ? (
        <span className="cell-value">{value}</span>
      ) : (
        <span className="cell-notes">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            const hasNote = notes.includes(num);
            return (
              <span
                key={num}
                className={`cell-note ${hasNote ? "visible" : "empty"}`}
              >
                {hasNote ? num : ""}
              </span>
            );
          })}
        </span>
      )}
    </button>
  );
}

export default SudokuCell;