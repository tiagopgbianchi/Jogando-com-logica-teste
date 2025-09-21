import { GameConfig, InitialPieceSetup } from "./types";

// Create initial checkers board setup
const createCheckersSetup = (): InitialPieceSetup[] => {
  let setup: InitialPieceSetup[] = [];

  setup = [
     { type: "jumper", owner: 0, row: 1, col: 3 },
    { type: "jumper", owner: 0, row: 0, col: 2 },
    { type: "jumper", owner: 0, row: 2, col: 4 },
    { type: "killer", owner: 0, row: 0, col: 3 },
    { type: "killer", owner: 0, row: 1, col: 4 },
    { type: "king", owner: 0, row: 0, col: 4 },

    { type: "jumper", owner: 1, row: 2, col: 0 },
    { type: "jumper", owner: 1, row: 3, col: 1 },
    { type: "jumper", owner: 1, row: 4, col: 2 },
    { type: "killer", owner: 1, row: 4, col: 1 },
    { type: "killer", owner: 1, row: 3, col: 0 },
    { type: "king", owner: 1, row: 4, col: 0 },
  ];

  return setup;
};

export const gameConfig: GameConfig = {
  // Board dimensions
  boardWidth: 5,
  boardHeight: 5,

  // Game setup
  players: 2,
  initialSetup: createCheckersSetup(),

  // Turn rules
  movesPerTurn: 1, // One move per turn

  // Game metadata
  name: "Checkers",
  description: "Classic checkers game with diagonal movement",
};
