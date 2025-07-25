import { useEffect, useState } from "react";
import { Player, PieceType } from "../types";
import BoardGrid from "../Components/BoardGrid";
import {
  initializeBoard,
  updateMandatoryCaptures,
  getMovesForSelectedPiece,
  attemptMove,
} from "../Logic/gameController";

interface BoardProps {
  mandatoryCapture: boolean;
}

function Board({ mandatoryCapture }: BoardProps) {
  const [matrix, setMatrix] = useState<(PieceType | null)[][]>(
    initializeBoard()
  );
  const [turn, setTurn] = useState<Player>(1);

  const [mustCapturePieces, setMustCapturePieces] = useState<
    [number, number][]
  >([]);
  const [mustCaptureTargets, setMustCaptureTargets] = useState<
    [number, number][]
  >([]);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);

  const [selectedPiece, setSelectedPiece] = useState<{
    row: number;
    col: number;
    piece: PieceType;
  } | null>(null);

  useEffect(() => {
    const { mustCapturePieces, mustCaptureTargets } = updateMandatoryCaptures(
      matrix,
      turn,
      mandatoryCapture
    );
    setMustCapturePieces(mustCapturePieces);
    setMustCaptureTargets(mustCaptureTargets);
  }, [matrix, turn, mandatoryCapture]);

  const handlePieceClick = (row: number, col: number, piece: PieceType) => {
    if (piece.player !== turn) return;

    const moves = getMovesForSelectedPiece(
      matrix,
      row,
      col,
      piece,
      turn,
      mandatoryCapture
    );

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
      turn,
      mandatoryCapture
    );

    if (!result) return;

    const { updatedMatrix, nextTurn, moreCaptures } = result;
    setMatrix(updatedMatrix);

    if (moreCaptures.length > 0) {
      const newPiece = updatedMatrix[row][col]; // ✅ get updated king
      if (newPiece) {
        setSelectedPiece({ row, col, piece: newPiece }); // ✅ use newPiece (may be a king)
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
        mustCapturePieces={mustCapturePieces}
        mustCaptureTargets={mustCaptureTargets}
      />
    </div>
  );
}

export default Board;
