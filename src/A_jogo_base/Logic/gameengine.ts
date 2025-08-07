import { Player, PieceType } from "../types";

export function isValidMove(
  matrix: (PieceType | null)[][],
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  piece: PieceType
): boolean {
  const dx = toCol - fromCol;
  const dy = toRow - fromRow;

  if (!isWithinBounds(matrix, toRow, toCol)) return false;
  if (matrix[toRow][toCol] !== null) return false;

  // Direction of movement
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  const direction = piece.player === 1 ? 1 : -1;
  return absDx === 1 && dy === direction;
}

export function isValidCapture(
  matrix: (PieceType | null)[][],
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  piece: PieceType
): boolean {
  const dx = toCol - fromCol;
  const dy = toRow - fromRow;

  if (!isWithinBounds(matrix, toRow, toCol)) return false;
  if (matrix[toRow][toCol] !== null) return false;

  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (absDx !== absDy) return false; // must move diagonally

  const stepX = dx / absDx;
  const stepY = dy / absDy;

  let enemyFound = false;

  for (let i = 1; i < absDx; i++) {
    const r = fromRow + i * stepY;
    const c = fromCol + i * stepX;
    const current = matrix[r][c];

    if (current) {
      if (current.player === piece.player) return false; // cannot jump own piece
      if (enemyFound) return false; // already found one, can't jump two
      enemyFound = true;
    }
  }

  return enemyFound;
}

/**
 * Checks if a player must capture (mandatory capture rule)
 */


/**
 * Helper to check if coordinates are inside board
 */
function isWithinBounds(
  matrix: (PieceType | null)[][],
  row: number,
  col: number
): boolean {
  return row >= 0 && row < matrix.length && col >= 0 && col < matrix[0].length;
}

export function getValidMoves(
  matrix: (PieceType | null)[][],
  row: number,
  col: number,
  piece: PieceType
): [number, number][] {
  const moves: [number, number][] = [];

  const directions = piece.isKing
    ? [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]
    : piece.player === 1
    ? [
        [1, 1],
        [1, -1],
      ]
    : [
        [-1, 1],
        [-1, -1],
      ];

  for (const [dy, dx] of directions) {
    let step = 1;

    while (true) {
      const toRow = row + dy * step;
      const toCol = col + dx * step;
      if (!isWithinBounds(matrix, toRow, toCol)) break;

      // Try regular move
      if (isValidMove(matrix, row, col, toRow, toCol, piece)) {
        moves.push([toRow, toCol]);
      }

      // Try capture move
      if (isValidCapture(matrix, row, col, toRow, toCol, piece)) {
        moves.push([toRow, toCol]);
      }

      // Stop if it's not a king (they can't slide)
      if (!piece.isKing) break;

      step++;
    }
  }

  return moves;
}
