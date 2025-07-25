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

  if (piece.isKing) {
    // Must move in perfect diagonal
    if (absDx !== absDy) return false;

    // Check all squares between origin and destination are empty
    const stepX = dx / absDx;
    const stepY = dy / absDy;

    for (let i = 1; i < absDx; i++) {
      const intermediateRow = fromRow + i * stepY;
      const intermediateCol = fromCol + i * stepX;
      if (matrix[intermediateRow][intermediateCol] !== null) {
        return false;
      }
    }

    return true;
  } else {
    const direction = piece.player === 1 ? 1 : -1;
    return absDx === 1 && dy === direction;
  }
}
/**
 * Checks if a capture move is valid
 */
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
export function hasMandatoryCapture(
  matrix: (PieceType | null)[][],
  player: Player
): boolean {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      const piece = matrix[row][col];
      if (!piece || piece.player !== player) continue;

      const directions = piece.isKing
        ? [
            [2, 2],
            [2, -2],
            [-2, 2],
            [-2, -2],
          ]
        : player === 1
        ? [
            [2, 2],
            [2, -2],
          ]
        : [
            [-2, 2],
            [-2, -2],
          ];

      for (const [dy, dx] of directions) {
        const toRow = row + dy;
        const toCol = col + dx;
        if (isValidCapture(matrix, row, col, toRow, toCol, piece)) {
          return true;
        }
      }
    }
  }
  return false;
}

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
  piece: PieceType,
  mandatory: boolean
): [number, number][] {
  const moves: [number, number][] = [];

  const moveDirs = piece.isKing
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

  const captureDirs = piece.isKing
    ? [
        [2, 2],
        [2, -2],
        [-2, 2],
        [-2, -2],
      ]
    : piece.player === 1
    ? [
        [2, 2],
        [2, -2],
      ]
    : [
        [-2, 2],
        [-2, -2],
      ];

  if (mandatory) {
    if (piece.isKing) {
      for (const [dy, dx] of moveDirs) {
        let step = 1;
        while (true) {
          const toRow = row + dy * step;
          const toCol = col + dx * step;
          if (!isWithinBounds(matrix, toRow, toCol)) break;
          if (isValidCapture(matrix, row, col, toRow, toCol, piece)) {
            moves.push([toRow, toCol]);
          }
          step++;
        }
      }
    } else {
      for (const [dy, dx] of captureDirs) {
        const toRow = row + dy;
        const toCol = col + dx;
        if (isValidCapture(matrix, row, col, toRow, toCol, piece)) {
          moves.push([toRow, toCol]);
        }
      }
    }
  } else {
    // Check normal movement
    if (piece.isKing) {
      for (const [dy, dx] of moveDirs) {
        let step = 1;
        while (true) {
          const toRow = row + dy * step;
          const toCol = col + dx * step;
          if (!isWithinBounds(matrix, toRow, toCol)) break;
          if (matrix[toRow][toCol] !== null) break;
          moves.push([toRow, toCol]);
          step++;
        }
      }
    } else {
      for (const [dy, dx] of moveDirs) {
        const toRow = row + dy;
        const toCol = col + dx;
        if (isValidMove(matrix, row, col, toRow, toCol, piece)) {
          moves.push([toRow, toCol]);
        }
      }
    }
  }

  return moves;
}
