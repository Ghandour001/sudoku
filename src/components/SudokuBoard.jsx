import SudokuCell from "./SudokuCell.jsx";

function SudokuBoard({
  board,
  puzzle,
  notes,
  selectedCell,
  mistakeCell,
  onSelectCell,
  isPaused,
}) {
  const selectedValue =
    selectedCell
      ? board[selectedCell.row][selectedCell.col]
      : 0;

  const isRelated = (row, col) => {
    if (!selectedCell) return false;

    return (
      row === selectedCell.row ||
      col === selectedCell.col ||
      (
        Math.floor(row / 3) === Math.floor(selectedCell.row / 3) &&
        Math.floor(col / 3) === Math.floor(selectedCell.col / 3)
      )
    );
  };

  return (
    <div
      className="sudoku-board"
      role="grid"
      aria-label="Sudoku board"
    >
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          const isSelected =
            selectedCell?.row === rowIndex &&
            selectedCell?.col === colIndex;

          /*
           * Highlight every cell containing
           * the same number as the selected cell.
           *
           * The selected cell itself gets only
           * the stronger "selected" style.
           */
          const isSameNumber =
            selectedValue !== 0 &&
            value === selectedValue &&
            !isSelected;

          const isMistake =
            mistakeCell?.row === rowIndex &&
            mistakeCell?.col === colIndex;

          return (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              value={value}
              notes={notes[rowIndex][colIndex]}
              row={rowIndex}
              col={colIndex}
              isGiven={puzzle[rowIndex][colIndex] !== 0}
              isSelected={isSelected}
              isSameNumber={isSameNumber}
              isRelated={isRelated(rowIndex, colIndex)}
              isMistake={isMistake}
              onClick={onSelectCell}
            />
          );
        })
      )}

      {isPaused && (
        <div
          className="board-pause-overlay"
          aria-label="Game paused"
        >
          <div>
            <strong>Game Paused</strong>
            <span>Press Resume to continue</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SudokuBoard;