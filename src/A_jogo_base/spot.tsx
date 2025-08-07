{/*import "../styles/board.css";
import { useEffect, useState } from "react";
import Piece from "./Piece";
import { Player } from "../types";
import {
  isValidMove,
  isValidCapture,
  hasMandatoryCapture,
} from "../gameengine";

const boardSize = 8;

function Board() {
  const [matrix, setMatrix] = useState<number[][]>(
    Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => 0)
    )
  );
  const [turn, setTurn] = useState<Player>(1);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [clicado, setClicado] = useState(false);
  const [qualClicado, setQualClicado] = useState([-1, -1, -1]);

  const setPieceAt = (row: number, col: number, piece: number) => {
    setMatrix((prev) =>
      prev.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? piece : cell))
      )
    );
  };

  useEffect(() => {
    let x = true;
    for (let i = 0; i < 3; i++) {
      for (let y = 0; y < boardSize; y++) {
        if (x === true) {
          setPieceAt(i, y, 1);
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
          setPieceAt(boardSize - i - 1, y, 2);
        }
        x = !x;
      }
      x = !x;
    }
  }, []);

  const Ativar = (row: number, col: number, piece: number) => {
    if (piece !== turn) return;

    const moves: [number, number][] = [];
    const mandatory = hasMandatoryCapture(matrix, turn);

    const directions =
      piece === 1
        ? [
            [1, -1],
            [1, 1],
          ]
        : [
            [-1, -1],
            [-1, 1],
          ];
    const captures =
      piece === 1
        ? [
            [2, -2],
            [2, 2],
          ]
        : [
            [-2, -2],
            [-2, 2],
          ];

    if (mandatory) {
      for (const [dy, dx] of captures) {
        const toRow = row + dy;
        const toCol = col + dx;
        if (isValidCapture(matrix, row, col, toRow, toCol, piece)) {
          moves.push([toRow, toCol]);
        }
      }
    } else {
      for (const [dy, dx] of directions) {
        const toRow = row + dy;
        const toCol = col + dx;
        if (isValidMove(matrix, row, col, toRow, toCol, piece)) {
          moves.push([toRow, toCol]);
        }
      }
    }

    setClicado(true);
    setQualClicado([row, col, piece]);
    setValidMoves(moves);
  };

  const HandleClick = (row: number, col: number) => {
    if (!clicado) return;

    const [fromRow, fromCol, piece] = qualClicado;
    const toRow = row;
    const toCol = col;

    const mandatoryCapture = hasMandatoryCapture(matrix, turn);

    if (mandatoryCapture) {
      if (isValidCapture(matrix, fromRow, fromCol, toRow, toCol, piece)) {
        // Capture: remove jumped piece
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;

        setPieceAt(fromRow, fromCol, 0); // remove from
        setPieceAt(midRow, midCol, 0); // remove captured piece
        setPieceAt(toRow, toCol, piece); // place at target

        setClicado(false);
        setTurn(turn === 1 ? 2 : 1);
      }
    } else {
      if (isValidMove(matrix, fromRow, fromCol, toRow, toCol, piece)) {
        setPieceAt(fromRow, fromCol, 0);
        setPieceAt(toRow, toCol, piece);
        setClicado(false);
        setTurn(turn === 1 ? 2 : 1);
      }
    }
    setValidMoves([]);
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>
        Turn: {turn === 1 ? "White" : "Black"}
      </h2>
      <div className="board">
        {Array.from({ length: boardSize * boardSize }, (_, index) => {
          const row = Math.floor(index / boardSize);
          const col = index % boardSize;
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
                  codigo={Ativar}
                  image={matrix[row][col]}
                  posi_x={row}
                  posi_y={col}
                  selected={
                    clicado && qualClicado[0] === row && qualClicado[1] === col
                  }
                />
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
    </div>
  );
}

export default Board;
*/}