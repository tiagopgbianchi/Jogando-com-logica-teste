import { GameConfig, InitialPieceSetup } from "./types";

// Function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = (array: number[]): number[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Create initial checkers board setup
const createCheckersSetup = (): InitialPieceSetup[] => {
  // Create shuffled value arrays for each player
  const baseValues = [2, 2, 3, 3, 3, 4, 4, 4, 5, 5];
  const player0Values = shuffleArray(baseValues);
  const player1Values = shuffleArray(baseValues);
  
  let setup: InitialPieceSetup[] = [
    // Player 0 pieces with random values
    { type: "pawn", owner: 0, row: 0, col: 1, value: player0Values[0] },
    { type: "pawn", owner: 0, row: 0, col: 2, value: player0Values[1] },
    { type: "pawn", owner: 0, row: 0, col: 3, value: player0Values[2] },
    { type: "pawn", owner: 0, row: 0, col: 4, value: player0Values[3] },
    { type: "pawn", owner: 0, row: 0, col: 5, value: player0Values[4] },
    { type: "pawn", owner: 0, row: 0, col: 6, value: player0Values[5] },
    { type: "pawn", owner: 0, row: 1, col: 2, value: player0Values[6] },
    { type: "pawn", owner: 0, row: 1, col: 3, value: player0Values[7] },
    { type: "pawn", owner: 0, row: 1, col: 4, value: player0Values[8] },
    { type: "pawn", owner: 0, row: 1, col: 5, value: player0Values[9] },

    // Player 1 pieces with random values
    { type: "pawn", owner: 1, row: 7, col: 1, value: player1Values[0] },
    { type: "pawn", owner: 1, row: 7, col: 2, value: player1Values[1] },
    { type: "pawn", owner: 1, row: 7, col: 3, value: player1Values[2] },
    { type: "pawn", owner: 1, row: 7, col: 4, value: player1Values[3] },
    { type: "pawn", owner: 1, row: 7, col: 5, value: player1Values[4] },
    { type: "pawn", owner: 1, row: 7, col: 6, value: player1Values[5] },
    { type: "pawn", owner: 1, row: 6, col: 2, value: player1Values[6] },
    { type: "pawn", owner: 1, row: 6, col: 3, value: player1Values[7] },
    { type: "pawn", owner: 1, row: 6, col: 4, value: player1Values[8] },
    { type: "pawn", owner: 1, row: 6, col: 5, value: player1Values[9] },
  ];

  return setup;
};

export const gameConfig: GameConfig = {
  boardWidth: 8,
  boardHeight: 8,
  players: 2,
  initialSetup: createCheckersSetup(),
  movesPerTurn: 1,
  name: "Math War",
  description: "Board game with dice and math",
  useDice: true,
  diceCount: 2,
  diceSides: 5,
};