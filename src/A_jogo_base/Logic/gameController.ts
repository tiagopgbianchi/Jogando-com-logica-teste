import { Player, PieceType } from "../types";
import {
  getValidMoves,
  isValidCapture,
  isValidMove,
} from "./gameengine";

export function initializeBoard(): (PieceType | null)[][] {
  const boardSize = 8;
  const rowsPerPlayer = 3;
  const matrix: (PieceType | null)[][] = Array.from({ length: boardSize }, () =>
    Array.from({ length: boardSize }, () => null)
  );

  const placePieces = (player: 1 | 2, startRow: number, direction: 1 | -1) => {
    for (let i = 0; i < rowsPerPlayer; i++) {
      const row = startRow + i * direction;
      for (let col = 0; col < boardSize; col++) {
        if ((row + col) % 2 === 1) {
          matrix[row][col] = { player, isKing: false };
        }
      }
    }
  };

  placePieces(1, 0, 1); // Player 1 on top
  placePieces(2, boardSize - 1, -1); // Player 2 on bottom

  return matrix;
}


export function getMovesForSelectedPiece(
  matrix: (PieceType | null)[][],
  row: number,
  col: number,
  piece: PieceType
): [number, number][] {
  return getValidMoves(matrix, row, col, piece);
}

export function attemptMove(
  matrix: (PieceType | null)[][],
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  piece: PieceType,
  turn: Player
): {
  updatedMatrix: (PieceType | null)[][];
  nextTurn: Player | null;
  moreCaptures: [number, number][];
} | null {
  const isCapture = isValidCapture(matrix, fromRow, fromCol, toRow, toCol, piece);
  const isMove = isValidMove(matrix, fromRow, fromCol, toRow, toCol, piece);

  if (!isCapture && !isMove) return null;

  const updatedMatrix = matrix.map((row) => [...row]);

  // Remove the piece from its original position
  updatedMatrix[fromRow][fromCol] = null;

  // If it's a capture, remove the captured piece
  if (isCapture) {
    const dx = toCol - fromCol;
    const dy = toRow - fromRow;
    const stepX = dx / Math.abs(dx);
    const stepY = dy / Math.abs(dy);

    let r = fromRow + stepY;
    let c = fromCol + stepX;

    while (r !== toRow && c !== toCol) {
      if (updatedMatrix[r][c]?.player !== turn) {
        updatedMatrix[r][c] = null;
        break;
      }
      r += stepY;
      c += stepX;
    }
  }

  // Promote to king if it reaches the end of the board
  const reachedEnd =
    (piece.player === 1 && toRow === 7) || (piece.player === 2 && toRow === 0);

  const newPiece = {
    player: piece.player,
    isKing: piece.isKing || reachedEnd,
  };

  updatedMatrix[toRow][toCol] = newPiece;

  // Optional chaining for multiple captures — this is up to your game rules
  let moreCaptures: [number, number][] = [];

  if (isCapture) {
    moreCaptures = getValidMoves(updatedMatrix, toRow, toCol, newPiece).filter(
      ([r, c]) => isValidCapture(updatedMatrix, toRow, toCol, r, c, newPiece)
    );

    if (moreCaptures.length > 0) {
      return {
        updatedMatrix,
        nextTurn: null,
        moreCaptures,
      };
    }
  }

  return {
    updatedMatrix,
    nextTurn: turn === 1 ? 2 : 1,
    moreCaptures: [],
  };
}