import Piece from "./Piece";
import styles from "../styles/board.module.css";
import { PieceType } from "../types";

interface BoardGridProps {
  matrix: (PieceType | null)[][];
  validMoves: [number, number][];
  selectedPos: [number, number] | null;
  selectedPlayer: number | null;
  onPieceClick: (row: number, col: number, piece: PieceType) => void;
  onSquareClick: (row: number, col: number) => void;
  mustCapturePieces: [number, number][];
  mustCaptureTargets: [number, number][];
}

function BoardGrid({
  matrix,
  validMoves,
  selectedPos,
  selectedPlayer,
  onPieceClick,
  onSquareClick,
  mustCapturePieces,
  mustCaptureTargets,
}: BoardGridProps) {
  // Remove unused variable warnings
  selectedPlayer = selectedPlayer;
  mustCaptureTargets = mustCaptureTargets;

  const isSquareHighlighted = (row: number, col: number) =>
    validMoves.some(([r, c]) => r === row && c === col);

  const isSquareMustCapture = (row: number, col: number) =>
    mustCapturePieces.some(([r, c]) => r === row && c === col);

  const getSquareLabel = (row: number, col: number) => {
    // Add coordinate labels for better UX (optional)
    const files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return `${files[col]}${ranks[row]}`;
  };

  return (
    <div className={styles.board}>
      {matrix.map((rowArr, row) =>
        rowArr.map((piece, col) => {
          const isDark = (row + col) % 2 !== 0;
          const squareColor = isDark ? "dark" : "light";
          const isHighlighted = isSquareHighlighted(row, col);
          const isSelected =
            selectedPos?.[0] === row && selectedPos?.[1] === col;
          const mustCapture = isSquareMustCapture(row, col);

          return (
            <div
              key={`${row}-${col}`}
              className={`${styles.square} ${styles[squareColor]} ${
                isHighlighted ? styles["must-move-target"] : ""
              }`}
              title={getSquareLabel(row, col)} // Tooltip with square coordinates
            >
              {piece ? (
                <Piece
                  codigo={onPieceClick}
                  piece={piece}
                  posi_x={row}
                  posi_y={col}
                  selected={isSelected}
                  mustCapture={mustCapture}
                />
              ) : (
                <button
                  className={styles.botao_quadrado}
                  onClick={() => onSquareClick(row, col)}
                  aria-label={`Move to ${getSquareLabel(row, col)}`}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default BoardGrid;