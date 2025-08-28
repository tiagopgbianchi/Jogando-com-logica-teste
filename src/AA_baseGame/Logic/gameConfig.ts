// games/passagem/passagemConfig.ts
import { GameConfig, InitialPieceSetup } from './types';

const createPassagemSetup = (): InitialPieceSetup[] => {
  const setup: InitialPieceSetup[] = [];
  
  // Player 0 pieces (bottom row - row 7)
  // Place 7 pieces, leaving at least 1 empty square as per rules
  const player0Positions = [0, 1, 2, 3, 5, 6, 7]; // Skip position 4
  for (const col of player0Positions) {
    setup.push({
      type: "pawn",
      row: 7,
      col,
      owner: 0
    });
  }
  
  // Player 1 pieces (top row - row 0)  
  // Place 7 pieces, leaving at least 1 empty square as per rules
  const player1Positions = [0, 1, 2, 4, 5, 6, 7]; // Skip position 3
  for (const col of player1Positions) {
    setup.push({
      type: "pawn",
      row: 0,
      col,
      owner: 1
    });
  }
  
  return setup;
};

export const passagemConfig: GameConfig = {
  name: "Passagem",
  description: "Cross the board with 4 pieces to win",
  boardWidth: 8,
  boardHeight: 8,
  players: 2,
  movesPerTurn: 1,
  initialSetup: createPassagemSetup()
};