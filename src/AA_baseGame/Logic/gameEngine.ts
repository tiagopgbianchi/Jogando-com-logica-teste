import { 
  GameState, 
  Position, 
  Piece, 
  PieceDefinition, 
  GameConfig, 
  TurnAction,
  WinConditionRule 
} from "./types";

// Core game engine class
export class GameEngine {
  
  // Helper: Get piece definition
  private getPieceDefinition(type: string, state: GameState): PieceDefinition {
    return state.config.pieces.find((p: PieceDefinition) => p.type === type)!;
  }

  // Basic movement validation
  isValidMove(state: GameState, from: Position, to: Position, piece: Piece): boolean {
    // Check bounds
    if (!this.isPositionInBounds(state, to)) return false;
    
    // Can't move to same position
    if (from.row === to.row && from.col === to.col) return false;
    
    const def = this.getPieceDefinition(piece.type, state);
    
    // Check basic movement rule
    if (!def.movementRule(state, from, to, piece)) return false;
    
    // Check if path is clear (for sliding pieces)
    if (!this.isPathClear(state, from, to, piece)) return false;
    
    // Can't move to square occupied by own piece
    const targetPiece = state.board[to.row][to.col];
    if (targetPiece && targetPiece.owner === piece.owner) return false;
    
    return true;
  }

  // Capture validation
  isValidCapture(state: GameState, from: Position, to: Position, piece: Piece): boolean {
    const def = this.getPieceDefinition(piece.type, state);
    
    if (!def.captureRule) return false;
    
    return def.captureRule(state, from, to, piece) && 
           this.isPathClear(state, from, to, piece);
  }

  // Get all valid moves for a piece
  getValidMoves(state: GameState, from: Position): Position[] {
    const piece = state.board[from.row][from.col];
    if (!piece) return [];

    const moves: Position[] = [];
    
    // Check all possible positions
    for (let r = 0; r < state.config.boardHeight; r++) {
      for (let c = 0; c < state.config.boardWidth; c++) {
        const to = { row: r, col: c };
        
        if (this.isValidMove(state, from, to, piece) || 
            this.isValidCapture(state, from, to, piece)) {
          moves.push(to);
        }
      }
    }
    
    return moves;
  }

  // Get all available actions for current player
  getAvailableActions(state: GameState, position?: Position): TurnAction[] {
    const actions: TurnAction[] = [];
    
    if (position) {
      // Get actions for specific piece
      const piece = state.board[position.row][position.col];
      if (piece && piece.owner === state.currentPlayer) {
        const moves = this.getValidMoves(state, position);
        
        for (const to of moves) {
          const targetPiece = state.board[to.row][to.col];
          
          if (targetPiece && targetPiece.owner !== piece.owner) {
            // Capture action
            actions.push({
              type: "capture",
              from: position,
              to,
              piece,
              capturedPiece: targetPiece
            });
          } else {
            // Move action
            actions.push({
              type: "move",
              from: position,
              to,
              piece
            });
          }
        }
        
        // Check for special moves
        this.addSpecialMoveActions(state, position, piece, actions);
      }
    } else {
      // Get all actions for current player
      for (let row = 0; row < state.config.boardHeight; row++) {
        for (let col = 0; col < state.config.boardWidth; col++) {
          const pos = { row, col };
          const piece = state.board[row][col];
          
          if (piece && piece.owner === state.currentPlayer) {
            actions.push(...this.getAvailableActions(state, pos));
          }
        }
      }
      
      // Add barrier placement actions if applicable
      this.addBarrierActions(state, actions);
    }
    
    return actions;
  }

  // Execute a turn action
  executeAction(state: GameState, action: TurnAction): boolean {
    switch (action.type) {
      case "move":
        return this.executeMove(state, action);
      case "capture":
        return this.executeCapture(state, action);
      case "place":
        return this.executeBarrierPlacement(state, action);
      case "promote":
        return this.executePromotion(state, action);
      case "castle":
        return this.executeCastle(state, action);
      case "enpassant":
        return this.executeEnPassant(state, action);
      default:
        return false;
    }
  }

  // Process end of turn (captures, promotions, win conditions, etc.)
  processTurnEnd(state: GameState): void {
    // Process automatic captures (like surrounding in Passagem)
    this.processAutomaticCaptures(state);
    
    // Process promotions
    this.processPromotions(state);
    
    // Update game state
    this.updateGameState(state);
    
    // Check win condition
    const winner = this.checkWinCondition(state);
    if (winner !== null) {
      state.winner = winner;
      state.gamePhase = "ended";
    }
  }

  // Check all win conditions
  checkWinCondition(state: GameState): number | null {
    // Check custom win conditions first
    if (state.config.winConditions) {
      for (const [name, rule] of Object.entries(state.config.winConditions)) {
        const winner = rule(state);
        if (winner !== null) return winner;
      }
    }
    
    // Check standard win conditions from turnRules
    const rules = state.config.turnRules;
    
    if (rules.winConditions) {
      for (const condition of rules.winConditions) {
        const winner = this.evaluateWinCondition(state, condition);
        if (winner !== null) return winner;
      }
    }
    
    return null;
  }

  // Path validation for sliding pieces
  isPathClear(state: GameState, from: Position, to: Position, piece: Piece): boolean {
    const path = this.getMovementPath(from, to);
    
    // Empty path is always clear
    if (path.length === 0) return true;
    
    // Check each square in the path
    for (const pos of path) {
      const blockingPiece = state.board[pos.row][pos.col];
      if (blockingPiece) {
        const def = this.getPieceDefinition(blockingPiece.type, state);
        // Some pieces might allow jumping over them
        if (def.canBeJumpedOver !== true) {
          return false;
        }
      }
    }
    
    return true;
  }

  // Get movement path between two positions
  getMovementPath(from: Position, to: Position): Position[] {
    const path: Position[] = [];
    const rowStep = Math.sign(to.row - from.row);
    const colStep = Math.sign(to.col - from.col);
    
    let currentRow = from.row + rowStep;
    let currentCol = from.col + colStep;
    
    // Don't include the destination square
    while (currentRow !== to.row || currentCol !== to.col) {
      path.push({ row: currentRow, col: currentCol });
      currentRow += rowStep;
      currentCol += colStep;
    }
    
    return path;
  }

  // Detect automatic captures (like surrounding)
  detectCaptures(state: GameState): Position[] {
    const captures: Position[] = [];
    
    // Check custom capture rules
    if (state.config.captureRules) {
      for (const [name, rule] of Object.entries(state.config.captureRules)) {
        captures.push(...rule(state));
      }
    }
    
    // Default capture detection can be added here
    
    return captures;
  }

  // Process captures
  processCaptures(state: GameState, capturedPositions: Position[]): number {
    let captureCount = 0;
    
    for (const pos of capturedPositions) {
      const piece = state.board[pos.row][pos.col];
      if (piece) {
        // Remove captured piece
        state.board[pos.row][pos.col] = null;
        captureCount++;
        
        // Track captures in game data
        if (!state.gameData) state.gameData = {};
        if (!state.gameData.capturedPieces) {
          state.gameData.capturedPieces = new Array(state.players).fill(0);
        }
        
        // Increment capture count for the player who didn't own the captured piece
        for (let player = 0; player < state.players; player++) {
          if (player !== piece.owner) {
            state.gameData.capturedPieces[player]++;
          }
        }
      }
    }
    
    return captureCount;
  }

  // Clone game state for AI or undo functionality
  cloneGameState(state: GameState): GameState {
    return {
      board: state.board.map(row => row.map(piece => piece ? { ...piece } : null)),
      currentPlayer: state.currentPlayer,
      turnCount: state.turnCount,
      players: state.players,
      config: state.config,
      gameData: state.gameData ? { ...state.gameData } : undefined,
      playerData: state.playerData ? { ...state.playerData } : undefined,
      gamePhase: state.gamePhase,
      winner: state.winner,
      lastMove: state.lastMove ? { ...state.lastMove } : undefined,
      moveHistory: state.moveHistory ? [...state.moveHistory] : undefined
    };
  }

  // Validate game state integrity
  validateGameState(state: GameState): boolean {
    // Check board dimensions
    if (state.board.length !== state.config.boardHeight) return false;
    if (state.board[0].length !== state.config.boardWidth) return false;
    
    // Check player bounds
    if (state.currentPlayer < 0 || state.currentPlayer >= state.players) return false;
    
    // Check piece ownership
    for (let row = 0; row < state.config.boardHeight; row++) {
      for (let col = 0; col < state.config.boardWidth; col++) {
        const piece = state.board[row][col];
        if (piece && (piece.owner < 0 || piece.owner >= state.players)) {
          return false;
        }
      }
    }
    
    return true;
  }

  // Initialize board with enhanced state
  initializeBoard(config: GameConfig): GameState {
    const board: (Piece | null)[][] = Array.from({ length: config.boardHeight }, () =>
      Array.from({ length: config.boardWidth }, () => null)
    );

    if (config.initialSetup) {
      for (const setup of config.initialSetup) {
        const piece: Piece = {
          id: `${setup.type}-${setup.row}-${setup.col}`,
          type: setup.type,
          owner: setup.owner,
          data: setup.data || {},
          hasMoved: false,
          lastMoveNumber: 0
        };
        board[setup.row][setup.col] = piece;
      }
    }

    return {
      board,
      currentPlayer: 0,
      turnCount: 0,
      players: config.players,
      config,
      gameData: {},
      playerData: this.initializePlayerData(config),
      gamePhase: "playing",
      winner: null,
      moveHistory: []
    };
  }

  // Private helper methods
  private isPositionInBounds(state: GameState, pos: Position): boolean {
    return pos.row >= 0 && pos.row < state.config.boardHeight &&
           pos.col >= 0 && pos.col < state.config.boardWidth;
  }

  private addSpecialMoveActions(state: GameState, position: Position, piece: Piece, actions: TurnAction[]): void {
    const def = this.getPieceDefinition(piece.type, state);
    
    if (!def.specialMoves) return;
    
    // Add promotion actions
    if (def.promotionRule) {
      const promotions = def.promotionRule(state, position, piece);
      if (promotions && promotions.length > 0) {
        for (const promoteTo of promotions) {
          actions.push({
            type: "promote",
            from: position,
            to: position,
            piece,
            promoteTo
          });
        }
      }
    }
    
    // Add other special moves (castling, en passant, etc.)
    for (const [moveName, moveRule] of Object.entries(def.specialMoves)) {
      // Implementation would depend on specific special move types
      // This is a framework for extensibility
    }
  }

  private addBarrierActions(state: GameState, actions: TurnAction[]): void {
    const rules = state.config.turnRules;
    
    if (!rules.hasBarriers) return;
    
    const playerData = state.playerData?.[state.currentPlayer];
    if (!playerData || playerData.barriersLeft <= 0) return;
    
    // Add barrier placement actions for empty squares
    for (let row = 0; row < state.config.boardHeight; row++) {
      for (let col = 0; col < state.config.boardWidth; col++) {
        if (!state.board[row][col]) {
          actions.push({
            type: "place",
            to: { row, col },
            data: { pieceType: "barrier", owner: state.currentPlayer }
          });
        }
      }
    }
  }

  private executeMove(state: GameState, action: TurnAction): boolean {
    if (!action.from || !action.to || !action.piece) return false;
    
    // Validate move
    if (!this.isValidMove(state, action.from, action.to, action.piece)) {
      return false;
    }
    
    // Execute move
    state.board[action.to.row][action.to.col] = action.piece;
    state.board[action.from.row][action.from.col] = null;
    
    // Update piece data
    action.piece.hasMoved = true;
    action.piece.lastMoveNumber = state.turnCount;
    
    // Record move
    state.lastMove = action;
    if (!state.moveHistory) state.moveHistory = [];
    state.moveHistory.push(action);
    
    return true;
  }

  private executeCapture(state: GameState, action: TurnAction): boolean {
    if (!action.from || !action.to || !action.piece) return false;
    
    // Validate capture
    if (!this.isValidCapture(state, action.from, action.to, action.piece)) {
      return false;
    }
    
    // Execute capture
    const capturedPiece = state.board[action.to.row][action.to.col];
    state.board[action.to.row][action.to.col] = action.piece;
    state.board[action.from.row][action.from.col] = null;
    
    // Update piece data
    action.piece.hasMoved = true;
    action.piece.lastMoveNumber = state.turnCount;
    
    // Track captures
    if (capturedPiece) {
      if (!state.gameData) state.gameData = {};
      if (!state.gameData.capturedPieces) {
        state.gameData.capturedPieces = new Array(state.players).fill(0);
      }
      state.gameData.capturedPieces[action.piece.owner]++;
    }
    
    // Record move
    state.lastMove = action;
    if (!state.moveHistory) state.moveHistory = [];
    state.moveHistory.push(action);
    
    return true;
  }

  private executeBarrierPlacement(state: GameState, action: TurnAction): boolean {
    // Implementation for barrier placement
    return false; // Placeholder
  }

  private executePromotion(state: GameState, action: TurnAction): boolean {
    // Implementation for piece promotion
    return false; // Placeholder
  }

  private executeCastle(state: GameState, action: TurnAction): boolean {
    // Implementation for castling
    return false; // Placeholder
  }

  private executeEnPassant(state: GameState, action: TurnAction): boolean {
    // Implementation for en passant
    return false; // Placeholder
  }

  private processAutomaticCaptures(state: GameState): void {
    const captures = this.detectCaptures(state);
    if (captures.length > 0) {
      this.processCaptures(state, captures);
    }
  }

  private processPromotions(state: GameState): void {
    // Check for pieces that should be promoted
    for (let row = 0; row < state.config.boardHeight; row++) {
      for (let col = 0; col < state.config.boardWidth; col++) {
        const piece = state.board[row][col];
        if (piece) {
          const def = this.getPieceDefinition(piece.type, state);
          if (def.promotionRule) {
            const promotions = def.promotionRule(state, { row, col }, piece);
            if (promotions && promotions.length > 0) {
              // Auto-promote to first available type (or implement choice mechanism)
              piece.type = promotions[0];
            }
          }
        }
      }
    }
  }

  private updateGameState(state: GameState): void {
    // Switch players
    state.currentPlayer = (state.currentPlayer + 1) % state.players;
    state.turnCount++;
  }

  private evaluateWinCondition(state: GameState, condition: string): number | null {
    // This would map to predefined win conditions
    switch (condition) {
      case "crossing_race":
        return this.checkCrossingRace(state);
      case "capture_count":
        return this.checkCaptureCount(state);
      case "last_piece":
        return this.checkLastPiece(state);
      default:
        return null;
    }
  }

  private checkCrossingRace(state: GameState): number | null {
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
  }

  private checkCaptureCount(state: GameState): number | null {
    const capturesNeeded = state.config.turnRules.capturesToWin || 5;
    if (!state.gameData?.capturedPieces) return null;
    
    for (let player = 0; player < state.players; player++) {
      if (state.gameData.capturedPieces[player] >= capturesNeeded) {
        return player;
      }
    }
    
    return null;
  }

  private checkLastPiece(state: GameState): number | null {
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

  private initializePlayerData(config: GameConfig): Record<number, Record<string, any>> {
    const playerData: Record<number, Record<string, any>> = {};
    
    for (let i = 0; i < config.players; i++) {
      playerData[i] = {
        barriersLeft: config.turnRules.barriersPerPlayer || 0,
        barriersInFirstRow: 0
      };
    }
    
    return playerData;
  }
}

// Legacy function exports for backward compatibility
const engine = new GameEngine();

export function isValidMove(state: GameState, from: Position, to: Position, piece: Piece): boolean {
  return engine.isValidMove(state, from, to, piece);
}

export function isValidCapture(state: GameState, from: Position, to: Position, piece: Piece): boolean {
  return engine.isValidCapture(state, from, to, piece);
}

export function getValidMoves(state: GameState, from: Position): Position[] {
  return engine.getValidMoves(state, from);
}

export function attemptMove(state: GameState, from: Position, to: Position): boolean {
  const piece = state.board[from.row][from.col];
  if (!piece) return false;

  const action: TurnAction = {
    type: state.board[to.row][to.col] ? "capture" : "move",
    from,
    to,
    piece
  };

  const success = engine.executeAction(state, action);
  if (success) {
    engine.processTurnEnd(state);
  }
  
  return success;
}

export function initializeBoard(config: GameConfig): GameState {
  return engine.initializeBoard(config);
}

// New enhanced function exports
export function executeAction(state: GameState, action: TurnAction): boolean {
  const success = engine.executeAction(state, action);
  if (success) {
    engine.processTurnEnd(state);
  }
  return success;
}

export function getAvailableActions(state: GameState, position?: Position): TurnAction[] {
  return engine.getAvailableActions(state, position);
}

export function checkWinCondition(state: GameState): number | null {
  return engine.checkWinCondition(state);
}

export function cloneGameState(state: GameState): GameState {
  return engine.cloneGameState(state);
}

export function validateGameState(state: GameState): boolean {
  return engine.validateGameState(state);
}

export function detectCaptures(state: GameState): Position[] {
  return engine.detectCaptures(state);
}

export function processCaptures(state: GameState, capturedPositions: Position[]): number {
  return engine.processCaptures(state, capturedPositions);
}

export function isPathClear(state: GameState, from: Position, to: Position, piece: Piece): boolean {
  return engine.isPathClear(state, from, to, piece);
}

export function getMovementPath(from: Position, to: Position): Position[] {
  return engine.getMovementPath(from, to);
}