import { 
  GameConfig, 
  PieceDefinition, 
  InitialPieceSetup, 
  MovementPatterns 
} from './types';

// King-like movement pattern for Passagem pieces
const PassagemMovement = (state: any, from: any, to: any, piece: any): boolean => {
  const rowDiff = Math.abs(from.row - to.row);
  const colDiff = Math.abs(from.col - to.col);
  // Can move 1 square in any direction (orthogonal or diagonal)
  return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0);
};

// Passagem piece movement with collision detection
const PassagemMovementWithCollision = (state: any, from: any, to: any, piece: any): boolean => {
  const rowDiff = Math.abs(from.row - to.row);
  const colDiff = Math.abs(from.col - to.col);
  
  // Can move 1 square in any direction (orthogonal or diagonal)
  if (!(rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0))) {
    return false;
  }
  
  // Cannot move into a square occupied by ANY piece (own or enemy)
  const targetPiece = state.board[to.row][to.col];
  if (targetPiece) {
    return false; // Square is occupied, cannot move there
  }
  
  return true;
};

// Passagem piece definition
const passagemPiece: PieceDefinition = {
  type: "pawn",
  displayName: "Passagem Piece",
  description: "Moves 1 square in any direction, cannot capture by moving",
  
  // Movement: 1 square in any direction, but cannot move into occupied squares
  movementRule: PassagemMovementWithCollision,
  
  // No direct capture by moving onto enemy pieces
  captureRule: (state, from, to, piece) => false,
  
  // Path requirements
  requiresClearPath: false,
  blocksMovement: true,
  canBeJumpedOver: false
};

// Initial setup: 8 pieces per player on their first row
const initialSetup: InitialPieceSetup[] = [
  // Player 0 pieces (bottom row - row 7)
  { type: "pawn", row: 7, col: 0, owner: 0 },
  { type: "pawn", row: 7, col: 1, owner: 0 },
  { type: "pawn", row: 7, col: 2, owner: 0 },
  { type: "pawn", row: 7, col: 3, owner: 0 },
  { type: "pawn", row: 7, col: 4, owner: 0 },
  { type: "pawn", row: 7, col: 5, owner: 0 },
  { type: "pawn", row: 7, col: 6, owner: 0 },
  { type: "pawn", row: 7, col: 7, owner: 0 },
  
  // Player 1 pieces (top row - row 0)
  { type: "pawn", row: 0, col: 0, owner: 1 },
  { type: "pawn", row: 0, col: 1, owner: 1 },
  { type: "pawn", row: 0, col: 2, owner: 1 },
  { type: "pawn", row: 0, col: 3, owner: 1 },
  { type: "pawn", row: 0, col: 4, owner: 1 },
  { type: "pawn", row: 0, col: 5, owner: 1 },
  { type: "pawn", row: 0, col: 6, owner: 1 },
  { type: "pawn", row: 0, col: 7, owner: 1 }
];

export const passagemConfig: GameConfig = {
  name: "Passagem",
  description: "Strategic board game with surrounding captures",
  
  // Board setup
  boardWidth: 8,
  boardHeight: 8,
  players: 2,
  
  // Piece definitions
  pieces: [passagemPiece],
  
  // Initial piece placement
  initialSetup: initialSetup,
  
  // Basic turn rules (minimal for now)
  turnRules: {
    movesPerTurn: 1,
    canSkipTurn: false
  },
  
  // Temporary win conditions (will be updated later)
  winConditions: {}
};