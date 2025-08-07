import { useState } from "react";
import { Player, PieceType } from "../types";
import BoardGrid from "./BoardGrid";
import {
  initializeBoard,
  getMovesForSelectedPiece,
  attemptMove,
} from "../Logic/gameController";

function Board() {
  const [matrix, setMatrix] = useState<(PieceType | null)[][]>(
    initializeBoard()
  );
  const [turn, setTurn] = useState<Player>(1);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);

  const [selectedPiece, setSelectedPiece] = useState<{
    row: number;
    col: number;
    piece: PieceType;
  } | null>(null);

  const handlePieceClick = (row: number, col: number, piece: PieceType) => {
    if (piece.player !== turn) return;

    const moves = getMovesForSelectedPiece(matrix, row, col, piece);
    setSelectedPiece({ row, col, piece });
    setValidMoves(moves);
  };

  const handleSquareClick = (row: number, col: number) => {
    if (!selectedPiece) return;

    const { row: fromRow, col: fromCol, piece } = selectedPiece;

    const result = attemptMove(
      matrix,
      fromRow,
      fromCol,
      row,
      col,
      piece,
      turn
    );

    if (!result) return;

    const { updatedMatrix, nextTurn, moreCaptures } = result;
    setMatrix(updatedMatrix);

    if (moreCaptures.length > 0) {
      const newPiece = updatedMatrix[row][col];
      if (newPiece) {
        setSelectedPiece({ row, col, piece: newPiece });
        setValidMoves(moreCaptures);
      }
    } else {
      setSelectedPiece(null);
      setValidMoves([]);
      if (nextTurn !== null) setTurn(nextTurn);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>
        Turn: {turn === 1 ? "White" : "Black"}
      </h2>
      <BoardGrid
        selectedPlayer={selectedPiece ? selectedPiece.piece.player : null}
        matrix={matrix}
        validMoves={validMoves}
        selectedPos={
          selectedPiece ? [selectedPiece.row, selectedPiece.col] : null
        }
        onPieceClick={handlePieceClick}
        onSquareClick={handleSquareClick}
      />
    </div>
  );
}

export default Board;