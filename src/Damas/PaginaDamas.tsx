import "./p.css";
import { useState } from "react";
import { useEffect } from "react";
import peça from "./Peça";

function PaginaDamas() {
  const boardSize = 8;

  const [matrix, setMatrix] = useState<number[][]>(
    Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => 0)
    )
  );
  const toggleCell = (row: number, col: number, piece: number) => {
    setMatrix((prev) =>
      prev.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? (cell = piece) : cell))
      )
    );
  };

  return (
    <div className="board">
      {Array.from({ length: boardSize * boardSize }, (_, index) => {
        const row = Math.floor(index / boardSize);
        const col = index % boardSize;
        const squareClass =
          (row + col) % 2 === 0 ? "square light" : "square dark";

        return (
          <div key={index} className={squareClass}>
            {matrix[row][col] === 1 ? (
              <img
                src={"../public/circulo_branco.png"}
                alt="A description"
                width={50}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default PaginaDamas;
