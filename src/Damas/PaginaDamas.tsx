import "./p.css";
import { useState } from "react";
import { useEffect } from "react";
import Piece from "./Piece";

function PaginaDamas() {
  const boardSize = 8;

  const [matrix, setMatrix] = useState<number[][]>(
    Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => 0)
    )
  );
  const ToggleCell = (row: number, col: number, piece: number) => {
    setMatrix((prev) =>
      prev.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? (cell = piece) : cell))
      )
    );
  };
  useEffect(() => {
    let x = true;
    for (let i = 0; i < 3; i++) {
      for (let y = 0; y < boardSize; y++) {
        if (x === true) {
          ToggleCell(i, y, 1);
        }
        x = !x;
      }
      x = !x;
    }
  }, []);
  useEffect(() => {
    let x = false;
    for (let i = 0; i < 3; i++) {
      for (let y = 0; y < boardSize; y++) {
        if (x === true) {
          ToggleCell(boardSize - i - 1, y, 2);
        }
        x = !x;
      }
      x = !x;
    }
  }, []);
  const [clicado, setClicado] = useState(false);
  const [qualClicado, setQualClicado] = useState([-1, -1, -1]);
  const HandleClick = (x: number, y: number) => {
    if (clicado) {
      ToggleCell(qualClicado[0], qualClicado[1], 0);
      ToggleCell(x, y, qualClicado[2]);
      setClicado(false);
    }
  };

  const Ativar = (posi_x: number, posi_y: number, qual: number) => {
    setClicado(true);
    setQualClicado([posi_x, posi_y, qual]);
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
            {matrix[row][col] != 0 ? (
              <Piece
                codigo={Ativar}
                image={matrix[row][col]}
                posi_x={row}
                posi_y={col}
              ></Piece>
            ) : (
              <button
                onClick={() => HandleClick(row, col)}
                className="botao_quadrado"
              ></button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PaginaDamas;
