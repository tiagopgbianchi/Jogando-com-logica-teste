import { GameConfig, InitialPieceSetup } from "./types";

// Create initial checkers board setup
const createCheckersSetup = (): InitialPieceSetup[] => {
  const setup: InitialPieceSetup[] = [];
  
  // Player 0 pieces (bottom of board) - rows 5, 6, 7
  for (let row = 5; row <= 7; row++) {
    for (let col = 0; col < 8; col++) {
      // Only place pieces on dark squares (where row + col is odd)
      if ((row + col) % 2 === 1) {
        setup.push({
          type: 'checker',
          row: row,
          col: col,
          owner: 0,
          data: { isKing: false }
        });
      }
    }
  }
  
  // Player 1 pieces (top of board) - rows 0, 1, 2
  for (let row = 0; row <= 2; row++) {
    for (let col = 0; col < 8; col++) {
      // Only place pieces on dark squares (where row + col is odd)
      if ((row + col) % 2 === 1) {
        setup.push({
          type: 'checker',
          row: row,
          col: col,
          owner: 1,
          data: { isKing: false }
        });
      }
    }
  }
  
  return setup;
};

export const gameConfig: GameConfig = {
  // Board dimensions
  boardWidth: 8,
  boardHeight: 8,
  
  // Game setup
  players: 2,
  initialSetup: createCheckersSetup(),
  
  // Turn rules
  movesPerTurn: 1, // One move per turn
  
  // Game metadata
  name: "Checkers",
  description: "Classic checkers game with diagonal movement"
};