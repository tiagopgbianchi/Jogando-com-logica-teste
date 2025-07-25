import Piece from "./Piece";
import "../styles/board.css";
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
  selectedPlayer = selectedPlayer
  mustCaptureTargets=mustCaptureTargets
  const isSquareHighlighted = (row: number, col: number) =>
    validMoves.some(([r, c]) => r === row && c === col);

  const isSquareMustCapture = (row: number, col: number) =>
    mustCapturePieces.some(([r, c]) => r === row && c === col);

  return (
    <div className="board">
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
              className={`square ${squareColor} ${isHighlighted ? `must-move-target` : ""}`}
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
                  className="botao_quadrado"
                  onClick={() => onSquareClick(row, col)}
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
