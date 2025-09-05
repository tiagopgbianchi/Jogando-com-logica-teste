// Core position and piece interfaces
export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  id: string;
  type: string;
  owner: number;
  value?: number; // For games like Math War
  data?: Record<string, any>; // Custom piece data
  isObstacle?: boolean; // For obstacles/barriers
}

// Game state - the engine manages this structure
export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: number;
  turnCount: number;
  players: number;
  config: GameConfig;
  
  // Game phase and winner
  gamePhase: "playing" | "ended";
  winner: number | null; // null = no winner yet, -1 = draw
  
  // Turn resources
  remainingMoves: number;
  remainingEnergy?: number; // For Math War
  gameData: Record<string, any>; // Custom game data
  playerData: Record<number, Record<string, any>>; // Per-player data
  
  // Action tracking
  lastAction?: TurnAction;
  actionHistory: TurnAction[];
  
  // Dice rolls
  lastDiceRoll?: number[]; // For Math War
}

// Actions that can be performed
export interface TurnAction {
  type: "move" | "capture" | "place" | "custom" | "jump" | "bounce" | "promote" | "roll_dice";
  from?: Position;
  to?: Position;
  piece?: Piece;
  capturedPiece?: Piece;
  data?: Record<string, any>; // Custom action data
  cost?: number; // Movement/energy cost
  direction?: string; // For bounce actions
  diceRoll?: number[]; // For dice-based games
}

// Win condition result
export interface WinResult {
  winner: number; // Player index, or -1 for draw
  reason: string; // Description of why they won
  immediate?: boolean; // If true, end game immediately
}

// Custom functions that games must provide
export interface GameRules {
  getActionsForPiece(state: GameState, position: Position): unknown;
  shouldPromotePiece(state: GameState, piece: Piece, to: Position): unknown;
  // Required functions
  validateMove: (state: GameState, action: TurnAction) => boolean;
  executeAction: (state: GameState, action: TurnAction) => boolean;
  getAvailableActions: (state: GameState, position?: Position) => TurnAction[];
  checkWinCondition: (state: GameState) => WinResult | null;
  
  // Optional functions
  onTurnStart?: (state: GameState) => void;
  onTurnEnd?: (state: GameState) => void;
  onGameStart?: (state: GameState) => void;
  onAfterAction?: (state: GameState, action: TurnAction) => void; // For surrounding captures
  calculateActionCost?: (state: GameState, action: TurnAction) => number;
  shouldEndTurn?: (state: GameState, action: TurnAction) => boolean;
  canCapture?: (state: GameState, attacker: Piece, defender: Piece) => boolean; // For capture restrictions
  getMovementPattern?: (state: GameState, piece: Piece) => string[]; // For piece-specific movement
}

// Initial piece setup
export interface InitialPieceSetup {
  type: string;
  row: number;
  col: number;
  owner: number;
  value?: number;
  data?: Record<string, any>;
  isObstacle?: boolean;
}

// Game configuration
export interface GameConfig {
  // Board setup
  boardWidth: number;
  boardHeight: number;
  players: number;
  initialSetup: InitialPieceSetup[];
  
  // Turn rules
  movesPerTurn: number;
  mustUseAllMoves?: boolean; // For Kings Path
  energyPerTurn?: number; // For Math War
  useDice?: boolean; // For Math War
  diceCount?: number; // For Math War
  diceSides?: number; // For Math War
  
  // Timer settings
  turnTimeLimit?: number; // seconds per turn
  gameTimeLimit?: number; // total game time
  
  // Game metadata
  name: string;
  description?: string;
}

// Utility types for common patterns
export interface DiceRoll {
  count: number;
  sides: number;
  results?: number[];
}

// Event system for UI integration
export interface GameEvent {
  type: "win" | "turn_start" | "turn_end" | "action_executed" | "invalid_action" | "piece_captured" | "piece_promoted" | "barrier_placed" | "dice_rolled";
  data?: any;
}

export type GameEventHandler = (event: GameEvent) => void;

// Pre-built movement patterns that games can use
export const MovementPatterns = {
  orthogonal: (from: Position, to: Position): boolean => {
    return (from.row === to.row) !== (from.col === to.col);
  },
  
  diagonal: (from: Position, to: Position): boolean => {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    return rowDiff === colDiff && rowDiff > 0;
  },
  
  king: (from: Position, to: Position): boolean => {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0);
  },
  
  distance: (from: Position, to: Position): number => {
    return Math.abs(from.row - to.row) + Math.abs(from.col - to.col);
  },
  
  jumper: (from: Position, to: Position): boolean => {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    return (rowDiff === 2 && colDiff === 0) || (rowDiff === 0 && colDiff === 2);
  }
};

// Utility functions for common game operations
export const GameUtils = {
  isInBounds: (pos: Position, width: number, height: number): boolean => {
    return pos.row >= 0 && pos.row < height && pos.col >= 0 && pos.col < width;
  },
  
  rollDice: (count: number, sides: number): number[] => {
    const results: number[] = [];
    for (let i = 0; i < count; i++) {
      results.push(Math.floor(Math.random() * sides) + 1);
    }
    return results;
  },
  
  positionsEqual: (a: Position, b: Position): boolean => {
    return a.row === b.row && a.col === b.col;
  },
  
  cloneBoard: (board: (Piece | null)[][]): (Piece | null)[][] => {
    return board.map(row => 
      row.map(piece => piece ? { ...piece } : null)
    );
  },
  
  // Check if a position is adjacent to board edge for bounce mechanics
  isAdjacentToEdge: (pos: Position, width: number, height: number): boolean => {
    return pos.row === 0 || pos.row === height - 1 || pos.col === 0 || pos.col === width - 1;
  },
  
  // Get direction between two positions
  getDirection: (from: Position, to: Position): string => {
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    
    if (rowDiff === 0) return colDiff > 0 ? "right" : "left";
    if (colDiff === 0) return rowDiff > 0 ? "down" : "up";
    if (rowDiff > 0) return colDiff > 0 ? "down-right" : "down-left";
    return colDiff > 0 ? "up-right" : "up-left";
  },
  
  // Calculate bounce direction
  getBounceDirection: (direction: string, boardWidth: number, boardHeight: number, position: Position): string[] => {
    const possibleDirections: string[] = [];
    
    if (direction === "right" || direction === "left") {
      if (position.row > 0) possibleDirections.push("up");
      if (position.row < boardHeight - 1) possibleDirections.push("down");
    } else if (direction === "up" || direction === "down") {
      if (position.col > 0) possibleDirections.push("left");
      if (position.col < boardWidth - 1) possibleDirections.push("right");
    } else if (direction === "down-right") {
      if (position.row > 0) possibleDirections.push("up-right");
      if (position.col > 0) possibleDirections.push("down-left");
    } else if (direction === "down-left") {
      if (position.row > 0) possibleDirections.push("up-left");
      if (position.col < boardWidth - 1) possibleDirections.push("down-right");
    } else if (direction === "up-right") {
      if (position.row < boardHeight - 1) possibleDirections.push("down-right");
      if (position.col > 0) possibleDirections.push("up-left");
    } else if (direction === "up-left") {
      if (position.row < boardHeight - 1) possibleDirections.push("down-left");
      if (position.col < boardWidth - 1) possibleDirections.push("up-right");
    }
    
    return possibleDirections;
  }
};