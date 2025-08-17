import { GameConfig, GameState, Position, Piece } from "./types";

export const tinyTestConfig: GameConfig = {
  boardWidth: 4,
  boardHeight: 4,
  players: 2,
  pieces: [
    {
      type: "king",
      movementRule: (state, from, to) =>
        Math.abs(from.row - to.row) <= 2 && Math.abs(from.col - to.col) <= 2,
      captureRule: (state, from, to) =>
        Math.abs(from.row - to.row) <= 1 && Math.abs(from.col - to.col) <= 1
    }
  ],
  initialSetup: [
    { type: "king", row: 0, col: 0, owner: 0 },
    { type: "king", row: 3, col: 3, owner: 1 }
  ],
  turnRules: { movesPerTurn: 1 }
};


export const passagemCLD: GameConfig = {
  boardWidth: 8,
  boardHeight: 8,
  players: 2,
  pieces: [
    {
      type: "regular",
      // Chess king movement: 1 square in any direction
      movementRule: (state, from, to, piece) => {
        const rowDiff = Math.abs(from.row - to.row);
        const colDiff = Math.abs(from.col - to.col);
        
        // Must move exactly 1 square in any direction (including diagonals)
        if (rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0)) {
          const targetPiece = state.board[to.row][to.col];
          
          // Can't move to occupied square
          return !targetPiece;
        }
        return false;
      },
      // No capturing for now
      captureRule: (state, from, to, piece) => false
    }
  ],
  initialSetup: [
    // Player 0 pieces (bottom row - row 7)
    { type: "regular", row: 7, col: 0, owner: 0 },
    { type: "regular", row: 7, col: 1, owner: 0 },
    { type: "regular", row: 7, col: 2, owner: 0 },
    { type: "regular", row: 7, col: 3, owner: 0 },
    { type: "regular", row: 7, col: 4, owner: 0 },
    { type: "regular", row: 7, col: 5, owner: 0 },
    { type: "regular", row: 7, col: 6, owner: 0 },
    { type: "regular", row: 7, col: 7, owner: 0 },
    
    // Player 1 pieces (top row - row 0)
    { type: "regular", row: 0, col: 0, owner: 1 },
    { type: "regular", row: 0, col: 1, owner: 1 },
    { type: "regular", row: 0, col: 2, owner: 1 },
    { type: "regular", row: 0, col: 3, owner: 1 },
    { type: "regular", row: 0, col: 4, owner: 1 },
    { type: "regular", row: 0, col: 5, owner: 1 },
    { type: "regular", row: 0, col: 6, owner: 1 },
    { type: "regular", row: 0, col: 7, owner: 1 },
  ],
  turnRules: { 
    movesPerTurn: 1
  }
};
