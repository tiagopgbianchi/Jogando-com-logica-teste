import { useEffect, useState } from "react";
import { Player } from "../types";
import BoardGrid from "../Components/BoardGrid";
import {
  getValidMoves,
  hasMandatoryCapture,
  isValidCapture,
  isValidMove,
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
  const [selectedPiece, setSelectedPiece] = useState<[number, number, number] | null>(null);

  // Helper to update a specific cell on the board
  const setPieceAt = (row: number, col: number, piece: number) => {
    setMatrix((prev) =>
      prev.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? piece : cell))
      )
    );
  };

  // Initial white pieces setup
  useEffect(() => {
    let toggle = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (toggle) setPieceAt(i, j, 1); // white = 1
        toggle = !toggle;
      }
      toggle = !toggle;
    }
  }, []);

  // Initial black pieces setup
  useEffect(() => {
    let toggle = false;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (toggle) setPieceAt(boardSize - 1 - i, j, 2); // black = 2
        toggle = !toggle;
      }
      toggle = !toggle;
    }
  }, []);

  const handlePieceClick = (row: number, col: number, piece: number) => {
    if (piece !== turn) return;

    const mandatory = hasMandatoryCapture(matrix, turn);
    const moves = getValidMoves(matrix, row, col, piece, mandatory);

    setSelectedPiece([row, col, piece]);
    setValidMoves(moves);
  };

  const handleSquareClick = (row: number, col: number) => {
    if (!selectedPiece) return;

    const [fromRow, fromCol, piece] = selectedPiece;
    const toRow = row;
    const toCol = col;
    const mandatory = hasMandatoryCapture(matrix, turn);

    if (mandatory) {
      if (isValidCapture(matrix, fromRow, fromCol, toRow, toCol, piece)) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;

        setPieceAt(fromRow, fromCol, 0);
        setPieceAt(midRow, midCol, 0);
        setPieceAt(toRow, toCol, piece);

        setSelectedPiece(null);
        setValidMoves([]);
        setTurn(turn === 1 ? 2 : 1);
      }
    } else {
      if (isValidMove(matrix, fromRow, fromCol, toRow, toCol, piece)) {
        setPieceAt(fromRow, fromCol, 0);
        setPieceAt(toRow, toCol, piece);

        setSelectedPiece(null);
        setValidMoves([]);
        setTurn(turn === 1 ? 2 : 1);
      }
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>
        Turn: {turn === 1 ? "White" : "Black"}
      </h2>
      <BoardGrid
        matrix={matrix}
        validMoves={validMoves}
        selectedPos={
          selectedPiece ? [selectedPiece[0], selectedPiece[1]] : null
        }
        onPieceClick={handlePieceClick}
        onSquareClick={handleSquareClick}
      />
    </div>
  );
}

export default Board;
