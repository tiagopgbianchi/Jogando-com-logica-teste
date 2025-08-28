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
  gameData: Record<string, any>; // Custom game data
  playerData: Record<number, Record<string, any>>; // Per-player data
  
  // Action tracking
  lastAction?: TurnAction;
  actionHistory: TurnAction[];
}

// Actions that can be performed
export interface TurnAction {
  type: "move" | "capture" | "place" | "custom";
  from?: Position;
  to?: Position;
  piece?: Piece;
  capturedPiece?: Piece;
  data?: Record<string, any>; // Custom action data
  cost?: number; // Movement/energy cost
}

// Win condition result
export interface WinResult {
  winner: number; // Player index, or -1 for draw
  reason: string; // Description of why they won
  immediate?: boolean; // If true, end game immediately
}

// Custom functions that games must provide
export interface GameRules {
  // Required functions
  validateMove: (state: GameState, action: TurnAction) => boolean;
  executeAction: (state: GameState, action: TurnAction) => boolean;
  getAvailableActions: (state: GameState, position?: Position) => TurnAction[];
  checkWinCondition: (state: GameState) => WinResult | null;
  
  // Optional functions
  onTurnStart?: (state: GameState) => void;
  onTurnEnd?: (state: GameState) => void;
  onGameStart?: (state: GameState) => void;
  calculateActionCost?: (state: GameState, action: TurnAction) => number;
  shouldEndTurn?: (state: GameState, action: TurnAction) => boolean;
}

// Initial piece setup
export interface InitialPieceSetup {
  type: string;
  row: number;
  col: number;
  owner: number;
  value?: number;
  data?: Record<string, any>;
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
  type: "win" | "turn_start" | "turn_end" | "action_executed" | "invalid_action";
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
  }
};