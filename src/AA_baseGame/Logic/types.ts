// Core position and piece interfaces
export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  id: string;
  type: string;
  owner: number;
  value?: number; // For Math War piece values
  data?: Record<string, any>;
  hasMoved?: boolean;
  lastMoveNumber?: number;
  isKing?: boolean; // For checkers promotion
  isPromoted?: boolean; // Generic promotion flag
  isSpecial?: boolean;
}

// Enhanced game state with flexible data tracking
export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: number;
  turnCount: number;
  players: number;
  config: GameConfig;
  
  // Flexible game data
  gameData?: Record<string, any>;
  playerData?: Record<number, Record<string, any>>;
  
  // Game flow
  gamePhase?: string;
  winner?: number | null;
  lastMove?: TurnAction;
  moveHistory?: TurnAction[];
  
  // Turn management
  currentTurnActions?: TurnAction[];
  remainingMoves?: number;
  remainingEnergy?: number; // For Math War
  diceRoll?: number[]; // For dice-based games
  selectedPiece?: Position; // Currently selected piece
  
  // Special states
  mustCapture?: boolean; // For checkers forced captures
  captureChain?: Position[]; // For multi-captures
  pendingPromotions?: Position[]; // Pieces awaiting promotion
}

// Comprehensive turn action system
export interface TurnAction {
  type: "move" | "capture" | "place" | "promote" | "jump" | "multiCapture" | 
        "rollDice" | "selectPiece" | "declareNoSolution" | "skip" | "castle" | 
        "enPassant" | "special";
  
  // Basic action data
  from?: Position;
  to?: Position;
  piece?: Piece;
  capturedPiece?: Piece;
  capturedPosition?: Position;
  
  // Extended action data
  energyCost?: number; // For Math War
  captureChain?: Position[]; // For multi-captures
  promoteTo?: string;
  diceRoll?: number[];
  placedPiece?: Piece;
  
  // Flexible additional data
  data?: Record<string, any>;
  
  // Action validation
  isValid?: boolean;
  validationErrors?: string[];
}

// Rule function types with enhanced context
export type MovementRule = (
  state: GameState,
  from: Position,
  to: Position,
  piece: Piece,
  context?: ActionContext
) => boolean;

export type CaptureRule = (
  state: GameState,
  from: Position,
  to: Position,
  piece: Piece,
  context?: ActionContext
) => boolean;

export type WinConditionRule = (
  state: GameState,
  context?: ActionContext
) => WinResult | null;

export type TurnRule = (
  state: GameState,
  action: TurnAction,
  context?: ActionContext
) => TurnRuleResult;

export type SpecialRule = (
  state: GameState,
  action: TurnAction,
  context?: ActionContext
) => SpecialRuleResult;

// Context for rule execution
export interface ActionContext {
  availableActions?: TurnAction[];
  gameHistory?: GameState[];
  timeRemaining?: number;
  playerChoices?: Record<string, any>;
  rulePhase?: "validation" | "execution" | "afterEffects";
}

// Rule result types
export interface WinResult {
  winner: number;
  reason: string;
  gameEnd: boolean;
}

export interface TurnRuleResult {
  allowed: boolean;
  modifiedAction?: TurnAction;
  sideEffects?: TurnAction[];
  energyCost?: number;
  errors?: string[];
}

export interface SpecialRuleResult {
  success: boolean;
  modifiedState?: Partial<GameState>;
  additionalActions?: TurnAction[];
  data?: Record<string, any>;
}

// Enhanced piece definition with rule flexibility
export interface PieceDefinition {
  type: string;
  
  // Basic movement and capture
  movementRule: MovementRule;
  captureRule?: CaptureRule;
  
  // Advanced capabilities
  canJump?: boolean;
  jumpRule?: MovementRule;
  canPromote?: boolean;
  promotionRule?: SpecialRule;
  promotionTargets?: string[];
  
  // Path and blocking
  requiresClearPath?: boolean;
  canJumpOver?: string[]; // Types of pieces this can jump over
  blocksMovement?: boolean;
  canBeJumpedOver?: boolean;
  
  // Special abilities
  specialAbilities?: Record<string, SpecialRule>;
  canCastWithTypes?: string[]; // For castling
  hasEnPassant?: boolean;
  
  // Game-specific properties
  hasValue?: boolean; // For Math War
  valueRange?: [number, number];
  isImmobileWhenScored?: boolean; // For Passagem
  maxMovesPerTurn?: number;
  
  // Visual and metadata
  displayName?: string;
  description?: string;
}

// Flexible turn rules system
export interface TurnRules {
  // Basic turn structure
  movesPerTurn?: number;
  actionsPerTurn?: number;
  energyPerTurn?: number; // Base energy before dice/piece bonuses
  
  // Turn requirements
  mustMoveAllPieces?: boolean;
  canSkipTurn?: boolean;
  mustUseAllMoves?: boolean; // Kings Path requirement
  mustCapture?: boolean; // Checkers forced captures
  
  // Multi-action turns
  canChainCaptures?: boolean; // Checkers multi-captures
  canMoveMultiplePieces?: boolean;
  canUndoInTurn?: boolean;
  
  // Special mechanics
  hasDiceRolls?: boolean;
  diceCount?: number;
  diceType?: number; // d6, d5, etc.
  usesEnergySystem?: boolean; // Math War
  hasBarriers?: boolean;
  barriersPerPlayer?: number;
  maxBarriersInFirstRow?: number;
  
  // Time management
  timePerTurn?: number; // seconds
  totalGameTime?: number;
  
  // Win conditions
  winConditions?: string[];
  piecesToWin?: number;
  capturesToWin?: number;
  scoringRows?: number[]; // Which rows count for scoring
  
  // Special rules
  customRules?: Record<string, TurnRule>;
}

// Initial setup with enhanced flexibility
export interface InitialPieceSetup {
  type: string;
  row: number;
  col: number;
  owner: number;
  value?: number;
  data?: Record<string, any>;
  isSpecial?: boolean; // Captain, King, etc.
}

export interface SetupRule {
  name: string;
  description?: string;
  execute: (config: GameConfig) => InitialPieceSetup[];
}

// Game configuration with modular rules
export interface GameConfig {
  // Board setup
  boardWidth: number;
  boardHeight: number;
  players: number;
  
  // Piece definitions
  pieces: PieceDefinition[];
  initialSetup?: InitialPieceSetup[];
  setupRules?: SetupRule[]; // For complex setup like random values
  
  // Game flow
  turnRules: TurnRules;
  winConditions?: Record<string, WinConditionRule>;
  
  // Special mechanics
  captureRules?: Record<string, SpecialRule>;
  movementModifiers?: Record<string, MovementRule>;
  boardModifiers?: Record<string, SpecialRule>; // Barriers, special squares
  
  // Game-specific systems
  energySystem?: EnergySystemConfig;
  promotionSystem?: PromotionSystemConfig;
  captureSystem?: CaptureSystemConfig;
  scoringSystem?: ScoringSystemConfig;
  
  // Metadata
  name: string;
  description?: string;
  difficulty?: "easy" | "medium" | "hard";
  estimatedTime?: number; // minutes
  categories?: string[]; // "strategy", "math", "logic"
}

// Specialized system configs
export interface EnergySystemConfig {
  enabled: boolean;
  baseEnergy?: number;
  diceBonus?: boolean;
  pieceValueBonus?: boolean;
  movementCost?: number;
  captureCost?: number;
  canSaveEnergy?: boolean;
}

export interface PromotionSystemConfig {
  enabled: boolean;
  autoPromote?: boolean;
  requiresChoice?: boolean;
  promotionRows?: number[];
  promotionRules?: Record<string, SpecialRule>;
}

export interface CaptureSystemConfig {
  enabled: boolean;
  type: "replacement" | "jumping" | "surrounding" | "custom";
  forcedCaptures?: boolean;
  multiCaptures?: boolean;
  captureChains?: boolean;
  customRules?: Record<string, CaptureRule>;
}

export interface ScoringSystemConfig {
  enabled: boolean;
  type: "crossing" | "capture" | "survival" | "points" | "custom";
  scoringRows?: number[];
  pointsPerPiece?: number;
  bonusRules?: Record<string, SpecialRule>;
}

// Pre-built movement patterns
export const MovementPatterns = {
  // Basic patterns
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

  Queen: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    return MovementPatterns.Rook(state, from, to, piece) || 
           MovementPatterns.Bishop(state, from, to, piece);
  },

  Knight: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  },

  // Pawn with direction awareness
  Pawn: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    const direction = piece.owner === 0 ? -1 : 1;
    const startRow = piece.owner === 0 ? state.config.boardHeight - 2 : 1;
    
    if (from.col === to.col) {
      // One square forward
      if (to.row === from.row + direction && !state.board[to.row][to.col]) {
        return true;
      }
      // Two squares forward from start
      if (!piece.hasMoved && from.row === startRow && 
          to.row === from.row + 2 * direction && !state.board[to.row][to.col]) {
        return true;
      }
    }
    return false;
  },

  // Orthogonal only (for Passagem, Math War)
  Orthogonal: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    return (from.row === to.row) !== (from.col === to.col); // XOR - exactly one must be equal
  },

  // Single step orthogonal (for Crown Chase Jumper movement)
  OrthogonalOne: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  },

  // Checkers diagonal movement
  CheckersDiagonal: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    const rowDiff = to.row - from.row;
    const colDiff = Math.abs(to.col - from.col);
    
    // Regular piece moves forward, king moves any direction
    if (piece.isKing) {
      return Math.abs(rowDiff) === 1 && colDiff === 1;
    } else {
      const direction = piece.owner === 0 ? -1 : 1;
      return rowDiff === direction && colDiff === 1;
    }
  },

  // Jump pattern for Crown Chase Jumper
  JumpOverOne: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    
    // Must be exactly 2 squares orthogonally
    if ((Math.abs(rowDiff) === 2 && colDiff === 0) || 
        (rowDiff === 0 && Math.abs(colDiff) === 2)) {
      
      const middleRow = from.row + Math.sign(rowDiff);
      const middleCol = from.col + Math.sign(colDiff);
      const middlePiece = state.board[middleRow][middleCol];
      
      // Must jump over a piece, land on empty or enemy king
      if (middlePiece) {
        const targetPiece = state.board[to.row][to.col];
        return !targetPiece || (targetPiece.type === "king" && targetPiece.owner !== piece.owner);
      }
    }
    return false;
  }
};

// Pre-built capture patterns
export const CapturePatterns = {
  // Standard replacement capture
  Standard: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    const targetPiece = state.board[to.row][to.col];
    return targetPiece !== null && targetPiece.owner !== piece.owner;
  },

  // Pawn diagonal capture
  PawnCapture: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    const direction = piece.owner === 0 ? -1 : 1;
    const targetPiece = state.board[to.row][to.col];
    
    return to.row === from.row + direction && 
           Math.abs(to.col - from.col) === 1 && 
           targetPiece !== null && 
           targetPiece.owner !== piece.owner;
  },

  // Checkers jump capture
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
  },

  // Crown Chase Jumper can only capture kings
  JumperKingOnly: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    if (MovementPatterns.JumpOverOne(state, from, to, piece)) {
      const targetPiece = state.board[to.row][to.col];
      return targetPiece?.type === "king" && targetPiece.owner !== piece.owner;
    }
    return false;
  },

  // No direct capture (pieces can't capture by moving onto them)
  None: (state: GameState, from: Position, to: Position, piece: Piece): boolean => {
    return false;
  }
};

// Pre-built win conditions
export const WinConditions = {
  // Capture specific piece type (Chess king, Crown Chase king)
  CaptureTarget: (targetType: string) => (state: GameState): WinResult | null => {
    for (let player = 0; player < state.players; player++) {
      let hasTarget = false;
      
      for (let row = 0; row < state.config.boardHeight; row++) {
        for (let col = 0; col < state.config.boardWidth; col++) {
          const piece = state.board[row][col];
          if (piece && piece.type === targetType && piece.owner === player) {
            hasTarget = true;
            break;
          }
        }
        if (hasTarget) break;
      }
      
      if (!hasTarget) {
        const winner = (player + 1) % state.players;
        return {
          winner,
          reason: `Captured opponent's ${targetType}`,
          gameEnd: true
        };
      }
    }
    return null;
  },

  // Cross board with N pieces (Passagem)
  CrossingRace: (piecesToWin: number) => (state: GameState): WinResult | null => {
    for (let player = 0; player < state.players; player++) {
      const goalRow = player === 0 ? 0 : state.config.boardHeight - 1;
      let scored = 0;
      
      for (let col = 0; col < state.config.boardWidth; col++) {
        const piece = state.board[goalRow][col];
        if (piece && piece.owner === player && piece.type !== "barrier") {
          scored++;
        }
      }
      
      if (scored >= piecesToWin) {
        return {
          winner: player,
          reason: `Scored ${piecesToWin} pieces`,
          gameEnd: true
        };
      }
    }
    return null;
  },

  // Capture N enemy pieces
  CaptureCount: (capturesToWin: number) => (state: GameState): WinResult | null => {
    if (!state.gameData?.capturedPieces) return null;
    
    for (let player = 0; player < state.players; player++) {
      if (state.gameData.capturedPieces[player] >= capturesToWin) {
        return {
          winner: player,
          reason: `Captured ${capturesToWin} pieces`,
          gameEnd: true
        };
      }
    }
    return null;
  },

  // Most pieces when time runs out
  MostPieces: (state: GameState): WinResult | null => {
    if (state.gamePhase !== "timeUp") return null;
    
    const pieceCounts = new Array(state.players).fill(0);
    
    for (let row = 0; row < state.config.boardHeight; row++) {
      for (let col = 0; col < state.config.boardWidth; col++) {
        const piece = state.board[row][col];
        if (piece && piece.type !== "barrier") {
          pieceCounts[piece.owner]++;
        }
      }
    }
    
    const maxPieces = Math.max(...pieceCounts);
    const winners = pieceCounts.map((count, player) => ({ count, player }))
                              .filter(p => p.count === maxPieces);
    
    if (winners.length === 1) {
      return {
        winner: winners[0].player,
        reason: `Most pieces remaining (${maxPieces})`,
        gameEnd: true
      };
    } else {
      return {
        winner: -1, // Draw
        reason: "Tied on piece count",
        gameEnd: true
      };
    }
  },

  // Last player with pieces (elimination)
  LastStanding: (state: GameState): WinResult | null => {
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
      const winner = pieceCounts.findIndex(count => count > 0);
      return {
        winner,
        reason: "Last player standing",
        gameEnd: true
      };
    }
    
    return null;
  }
};