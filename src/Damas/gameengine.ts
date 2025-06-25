import {Player} from './types'

export function isValidMove(
  matrix: number[][],
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  piece: number
): boolean {
  const dx = toCol - fromCol;
  const dy = toRow - fromRow;

  if (!isWithinBounds(matrix, toRow, toCol)) return false;
  if (matrix[toRow][toCol] !== 0) return false;

  // Normal move (non-capture)
  if (piece === 1 && dy === 1 && Math.abs(dx) === 1) return true; // white moves down
  if (piece === 2 && dy === -1 && Math.abs(dx) === 1) return true; // black moves up

  return false;
}

/**
 * Checks if a capture move is valid
 */
export function isValidCapture(
  matrix: number[][],
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  piece: number
): boolean {
  const dx = toCol - fromCol;
  const dy = toRow - fromRow;
  const midRow = fromRow + dy / 2;
  const midCol = fromCol + dx / 2;

  if (!isWithinBounds(matrix, toRow, toCol)) return false;
  if (matrix[toRow][toCol] !== 0) return false;
  if (Math.abs(dx) !== 2 || Math.abs(dy) !== 2) return false;

  const middlePiece = matrix[midRow][midCol];
  if (middlePiece === 0 || middlePiece === piece) return false; // Must be opponent

  if (piece === 1 && dy === 2) return true; // white captures down
  if (piece === 2 && dy === -2) return true; // black captures up

  return false;
}

/**
 * Checks if a player must capture (mandatory capture rule)
 */
export function hasMandatoryCapture(matrix: number[][], player: Player): boolean {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      if (matrix[row][col] !== player) continue;
      for (const dx of [-2, 2]) {
        for (const dy of player === 1 ? [2] : [-2]) {
          const toRow = row + dy;
          const toCol = col + dx;
          if (isValidCapture(matrix, row, col, toRow, toCol, player)) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

/**
 * Helper to check if coordinates are inside board
 */
function isWithinBounds(matrix: number[][], row: number, col: number): boolean {
  return row >= 0 && row < matrix.length && col >= 0 && col < matrix[0].length;
}

export function getValidMoves(
  matrix: number[][],
  row: number,
  col: number,
  piece: number,
  mandatory: boolean
): [number, number][] {
  const moves: [number, number][] = [];
  const directions = piece === 1 ? [[1, -1], [1, 1]] : [[-1, -1], [-1, 1]];
  const captures = piece === 1 ? [[2, -2], [2, 2]] : [[-2, -2], [-2, 2]];

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
  return moves;
}