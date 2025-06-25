import Piece from "./Piece";
import "../styles/board.css";
interface BoardGridProps {
  matrix: number[][];
  validMoves: [number, number][];
  selectedPos: [number, number] | null;
  onPieceClick: (row: number, col: number, piece: number) => void;
  onSquareClick: (row: number, col: number) => void;
}

export default function BoardGrid({
  matrix,
  validMoves,
  selectedPos,
  onPieceClick,
  onSquareClick,
}: BoardGridProps) {
  return (
    <div className="board">
      {Array.from({ length: 64 }, (_, index) => {
        const row = Math.floor(index / 8);
        const col = index % 8;
        const isValidDest = validMoves.some(
          ([r, c]) => r === row && c === col
        );
        const squareClass = [
          "square",
          (row + col) % 2 === 0 ? "light" : "dark",
          isValidDest ? "highlight" : "",
        ].join(" ");

        return (
          <div key={index} className={squareClass}>
            {matrix[row][col] !== 0 ? (
              <Piece
                codigo={onPieceClick}
                image={matrix[row][col]}
                posi_x={row}
                posi_y={col}
                selected={
                  selectedPos !== null &&
                  selectedPos[0] === row &&
                  selectedPos[1] === col
                }
              />
            ) : (
              <button
                onClick={() => onSquareClick(row, col)}
                className="botao_quadrado"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
