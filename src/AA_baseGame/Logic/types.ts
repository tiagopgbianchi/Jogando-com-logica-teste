// Where a piece is on the board
export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  id: string;
  type: string;
  owner: number;
  data?: Record<string, any>;
  hasMoved?: boolean; // For castling, pawn first moves, etc.
  lastMoveNumber?: number; // For en passant detection
}

// Enhanced game state with more tracking
export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: number;
  turnCount: number;
  players: number;
  config: GameConfig;
  gameData?: Record<string, any>; // For game-specific data (captures, scores, etc.)
  playerData?: Record<number, Record<string, any>>; // Per-player data (barriers left, etc.)
  gamePhase?: string; // "setup", "playing", "endgame", etc.
  winner?: number | null;
  lastMove?: TurnAction; // For en passant, undo functionality
  moveHistory?: TurnAction[]; // Full game history
}

// Multi-step turn support
export interface TurnAction {
  type: "move" | "place" | "capture" | "promote" | "castle" | "enpassant" | "jump";
  from?: Position;
  to?: Position;
  piece?: Piece;
  capturedPiece?: Piece; // For undo functionality
  capturedPosition?: Position; // For en passant where capture pos != to pos
  data?: Record<string, any>; // Additional action data
  promoteTo?: string; // For promotion actions
}

// Enhanced turn rules
export interface TurnRules {
  movesPerTurn?: number;
  actionsPerTurn?: number;
  canSkipTurn?: boolean;
  mustCapture?: boolean; // Checkers forced captures
  multiJump?: boolean; // Checkers multi-captures
  specialMoves?: string[]; // "castling", "enpassant", "promotion"
  winConditions?: string[]; // Multiple win conditions
  piecesToWin?: number;
  capturesToWin?: number;
  hasBarriers?: boolean;
  barriersPerPlayer?: number;
  maxBarriersInFirstRow?: number;
}

// Rule function types
export type MovementRule = (
  state: GameState,
  from: Position,
  to: Position,
  piece: Piece
) => boolean;

export type CaptureRule = MovementRule;

export type SpecialMoveRule = (
  state: GameState,
  from: Position,
  to: Position,
  piece: Piece,
  ...args: any[]
) => boolean;

export type PromotionRule = (
  state: GameState,
  position: Position,
  piece: Piece
) => string[] | null; // Returns available promotion types

export type WinConditionRule = (state: GameState) => number | null;

export type CaptureDetectionRule = (state: GameState) => Position[]; // Find pieces that should be captured

// Enhanced piece definition
export interface PieceDefinition {
  type: string;
  movementRule: MovementRule;
  captureRule?: CaptureRule; // Optional - some pieces might not capture
  specialMoves?: Record<string, SpecialMoveRule>; // castling, en passant, etc.
  promotionRule?: PromotionRule; // pawns -> queens, checkers -> kings
  canJump?: boolean; // For checkers-style jumping
  immobileWhenScored?: boolean; // For Passagem scoring
  blocksMovement?: boolean; // Whether other pieces can move through this
  canBeJumpedOver?: boolean; // For checkers captures
}

export interface InitialPieceSetup {
  type: string;
  row: number;
  col: number;
  owner: number;
  data?: Record<string, any>;
}

// Enhanced game config
export interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  players: number;
  pieces: PieceDefinition[];
  initialSetup?: InitialPieceSetup[];
  turnRules: TurnRules;
  winConditions?: Record<string, WinConditionRule>; // Custom win condition functions
  captureRules?: Record<string, CaptureDetectionRule>; // Custom capture detection
  gameSpecificRules?: Record<string, any>; // Flexible additional rules
}

// Common movement patterns as reusable functions
export const MovementPatterns = {
  King: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0);
  },

  Rook: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    return from.row === to.row || from.col === to.col;
  },

  Bishop: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    return rowDiff === colDiff && rowDiff > 0;
  },

  Knight: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  },

  Pawn: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    const direction = piece.owner === 0 ? -1 : 1; // Player 0 moves up, Player 1 moves down
    const startRow = piece.owner === 0 ? state.config.boardHeight - 2 : 1;
    
    // Forward move
    if (from.col === to.col) {
      // One square forward
      if (to.row === from.row + direction) {
        return !state.board[to.row][to.col];
      }
      // Two squares forward from starting position
      if (from.row === startRow && to.row === from.row + 2 * direction) {
        return !state.board[to.row][to.col];
      }
    }
    return false;
  },

  CheckersPawn: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    const direction = piece.owner === 0 ? -1 : 1;
    const rowDiff = to.row - from.row;
    const colDiff = Math.abs(to.col - from.col);
    
    // Normal diagonal move
    if (rowDiff === direction && colDiff === 1) {
      return !state.board[to.row][to.col];
    }
    
    return false;
  }
};

// Common capture patterns
export const CapturePatterns = {
  Standard: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    const targetPiece = state.board[to.row][to.col];
    return targetPiece !== null && targetPiece.owner !== piece.owner;
  },

  PawnCapture: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    const direction = piece.owner === 0 ? -1 : 1;
    const targetPiece = state.board[to.row][to.col];
    
    return to.row === from.row + direction && 
           Math.abs(to.col - from.col) === 1 && 
           targetPiece !== null && 
           targetPiece.owner !== piece.owner;
  },

  CheckersJump: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    
    // Must be 2 squares diagonally
    if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
      const middleRow = from.row + rowDiff / 2;
      const middleCol = from.col + colDiff / 2;
      const middlePiece = state.board[middleRow][middleCol];
      
      return middlePiece !== null && 
             middlePiece.owner !== piece.owner && 
             !state.board[to.row][to.col];
    }
    return false;
  }
};

// Common win conditions
export const WinConditions = {
  Checkmate: (state: GameState): number | null => {
    // TODO: Implement checkmate detection
    return null;
  },

  CrossingRace: (state: GameState): number | null => {
    const piecesToWin = state.config.turnRules.piecesToWin || 4;
    
    for (let player = 0; player < state.players; player++) {
      const goalRow = player === 0 ? 0 : state.config.boardHeight - 1;
      let scored = 0;
      
      for (let col = 0; col < state.config.boardWidth; col++) {
        const piece = state.board[goalRow][col];
        if (piece && piece.owner === player && piece.type !== "barrier") {
          scored++;
        }
      }
      
      if (scored >= piecesToWin) return player;
    }
    return null;
  },

  CaptureCount: (state: GameState): number | null => {
    const capturesNeeded = state.config.turnRules.capturesToWin || 5;
    if (!state.gameData?.capturedPieces) return null;
    
    for (let player = 0; player < state.players; player++) {
      if (state.gameData.capturedPieces[player] >= capturesNeeded) {
        return player;
      }
    }
    return null;
  },

  LastPieceStanding: (state: GameState): number | null => {
    const pieceCounts = new Array(state.players).fill(0);
    
    for (let row = 0; row < state.config.boardHeight; row++) {
      for (let col = 0; col < state.config.boardWidth; col++) {
        const piece = state.board[row][col];
        if (piece && piece.type !== "barrier") {
          pieceCounts[piece.owner]++;
        }
      }
    }
    
    const playersWithPieces = pieceCounts.filter(count => count > 0).length;
    if (playersWithPieces === 1) {
      return pieceCounts.findIndex(count => count > 0);
    }
    
    return null;
  }
};