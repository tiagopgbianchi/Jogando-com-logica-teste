import { GameConfig, GameState, Position, Piece } from "./types";

// --- helpers ---
function inBounds(state: GameState, r: number, c: number): boolean {
  return (
    r >= 0 &&
    r < state.config.boardHeight &&
    c >= 0 &&
    c < state.config.boardWidth
  );
}

// --- rules ---
// Move exactly 1 square in any direction into an empty square.
const kingStepMove = (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
  // must move to a different square
  if (from.row === to.row && from.col === to.col) return false;
  if (!inBounds(state, to.row, to.col)) return false;

  // destination must be empty
  if (state.board[to.row][to.col] !== null) return false;

  const dRow = Math.abs(to.row - from.row);
  const dCol = Math.abs(to.col - from.col);

  // king-like: 8 neighbors only
  return dRow <= 1 && dCol <= 1;
};

// No capturing in this minimal version.
const noCapture = () => false;

// --- config ---
export const passagemGPT: GameConfig = {
  boardWidth: 8,
  boardHeight: 8,
  players: 2,
  pieces: [
    {
      // using "king" so your PieceComponent renders ♔ (else it shows ●)
      type: "king",
      movementRule: kingStepMove,
      captureRule: noCapture,
    },
  ],
  initialSetup: [
    // Player 1 (owner 0) first row = row 0
    ...Array.from({ length: 8 }, (_, col) => ({
      type: "king",
      row: 0,
      col,
      owner: 0,
    })),
    // Player 2 (owner 1) first row = row 7
    ...Array.from({ length: 8 }, (_, col) => ({
      type: "king",
      row: 7,
      col,
      owner: 1,
    })),
  ],
  turnRules: {
    movesPerTurn: 1,
    diceBased: false,
    teamBased: false,
  },
};