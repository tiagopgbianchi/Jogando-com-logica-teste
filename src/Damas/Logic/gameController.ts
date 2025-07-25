import { Player, PieceType } from "../types";
import {
  getValidMoves,
  hasMandatoryCapture,
  isValidCapture,
  isValidMove,
} from "./gameengine";

export function initializeBoard(): (PieceType | null)[][] {
  const boardSize = 8;
  const matrix: (PieceType | null)[][] = Array.from({ length: boardSize }, () =>
    Array.from({ length: boardSize }, () => null)
  );

  // Set white pieces (top 3 rows)
  let toggle = true;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (toggle) matrix[i][j] = { player: 1, isKing: false };
      toggle = !toggle;
    }
    toggle = !toggle;
  }

  // Set black pieces (bottom 3 rows)
  toggle = false;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (toggle) matrix[boardSize - 1 - i][j] = { player: 2, isKing: false };
      toggle = !toggle;
    }
    toggle = !toggle;
  }

  return matrix;
}

export function updateMandatoryCaptures(
  matrix: (PieceType | null)[][],
  turn: Player,
  mandatoryCapture: boolean
): {
  mustCapturePieces: [number, number][];
  mustCaptureTargets: [number, number][];
} {
  if (!mandatoryCapture || !hasMandatoryCapture(matrix, turn)) {
    return { mustCapturePieces: [], mustCaptureTargets: [] };
  }

  const pieces: [number, number][] = [];
  const targets: [number, number][] = [];

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      const piece = matrix[row][col];
      if (piece?.player === turn) {
        const moves = getValidMoves(matrix, row, col, piece, true);
        if (moves.length > 0) {
          pieces.push([row, col]);
          targets.push(...moves);
        }
      }
    }
  }

  return { mustCapturePieces: pieces, mustCaptureTargets: targets };
}

export function getMovesForSelectedPiece(
  matrix: (PieceType | null)[][],
  row: number,
  col: number,
  piece: PieceType,
  turn: Player,
  mandatoryCapture: boolean
): [number, number][] {
  const isMandatory = mandatoryCapture && hasMandatoryCapture(matrix, turn);

  if (isMandatory) {
    return getValidMoves(matrix, row, col, piece, true);
  } else {
    const captureMoves = getValidMoves(matrix, row, col, piece, true);
    const normalMoves = getValidMoves(matrix, row, col, piece, false);
    return [...captureMoves, ...normalMoves];
  }
}

export function attemptMove(
  matrix: (PieceType | null)[][],
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  piece: PieceType,
  turn: Player,
  mandatoryCapture: boolean
): {
  updatedMatrix: (PieceType | null)[][];
  nextTurn: Player | null;
  moreCaptures: [number, number][];
} | null {
  const isCapture = isValidCapture(
    matrix,
    fromRow,
    fromCol,
    toRow,
    toCol,
    piece
  );
  const isMove = isValidMove(matrix, fromRow, fromCol, toRow, toCol, piece);
  const mustCapture = mandatoryCapture && hasMandatoryCapture(matrix, turn);

  if (mustCapture && !isCapture) return null;
  if (!isCapture && !isMove) return null;

  const updatedMatrix = matrix.map((row) => [...row]);

  updatedMatrix[fromRow][fromCol] = null;

  if (isCapture) {
    const dx = toCol - fromCol;
    const dy = toRow - fromRow;
    const stepX = dx / Math.abs(dx);
    const stepY = dy / Math.abs(dy);

    let r = fromRow + stepY;
    let c = fromCol + stepX;

    while (r !== toRow && c !== toCol) {
      if (updatedMatrix[r][c]?.player !== turn) {
        updatedMatrix[r][c] = null; // capture the opponent piece
        break;
      }
      r += stepY;
      c += stepX;
    }
  }

  // Promote to king if reaches the end
  const reachedEnd =
    (piece.player === 1 && toRow === 7) || (piece.player === 2 && toRow === 0);
  const newPiece = {
    player: piece.player,
    isKing: piece.isKing || reachedEnd,
  };

  updatedMatrix[toRow][toCol] = newPiece;

  // Check for additional capture opportunities
  if (isCapture && mandatoryCapture) {
    const moreCaptures = getValidMoves(
      updatedMatrix,
      toRow,
      toCol,
      newPiece,
      true
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
