import { 
  GameState, 
  Position, 
  Piece, 
  PieceDefinition, 
  GameConfig, 
  TurnAction,
  WinConditionRule,
  ActionContext,
  TurnRuleResult,
  SpecialRuleResult,
  WinResult,
  InitialPieceSetup
} from "./types";

export class GameEngine {
  
  // Initialize a new game state
  initializeBoard(config: GameConfig): GameState {
    const board: (Piece | null)[][] = Array.from({ length: config.boardHeight }, () =>
      Array.from({ length: config.boardWidth }, () => null)
    );

    // Execute setup rules or use direct setup
    let setupPieces: InitialPieceSetup[] = [];
    
    if (config.setupRules && config.setupRules.length > 0) {
      // Use setup rules (for random generation, etc.)
      for (const setupRule of config.setupRules) {
        setupPieces.push(...setupRule.execute(config));
      }
    } else if (config.initialSetup) {
      // Use direct setup
      setupPieces = config.initialSetup;
    }

    // Place pieces on board
    for (const setup of setupPieces) {
      const piece: Piece = {
        id: `${setup.type}-${setup.row}-${setup.col}`,
        type: setup.type,
        owner: setup.owner,
        value: setup.value,
        data: setup.data || {},
        hasMoved: false,
        lastMoveNumber: 0,
        isSpecial: setup.isSpecial
      };
      board[setup.row][setup.col] = piece;
    }

    const initialState: GameState = {
      board,
      currentPlayer: 0,
      turnCount: 0,
      players: config.players,
      config,
      gameData: this.initializeGameData(config),
      playerData: this.initializePlayerData(config),
      gamePhase: "playing",
      winner: null,
      moveHistory: [],
      remainingMoves: config.turnRules.movesPerTurn || 1,
      remainingEnergy: 0
    };

    // Initialize turn-specific data
    this.initializeTurn(initialState);

    return initialState;
  }

  // Initialize turn data (dice rolls, energy, etc.)
  initializeTurn(state: GameState): void {
    const rules = state.config.turnRules;

    // Roll dice if needed
    if (rules.hasDiceRolls) {
      const diceCount = rules.diceCount || 2;
      const diceType = rules.diceType || 5;
      const diceRoll: number[] = [];
      
      for (let i = 0; i < diceCount; i++) {
        diceRoll.push(Math.floor(Math.random() * diceType) + 1);
      }
      
      state.diceRoll = diceRoll;
    }

    // Set remaining moves
    state.remainingMoves = rules.movesPerTurn || 1;

    // Initialize energy for Math War style games
    if (rules.usesEnergySystem) {
      const baseEnergy = rules.energyPerTurn || 0;
      let totalEnergy = baseEnergy;

      // Add dice bonus if applicable
      if (state.diceRoll && state.config.energySystem?.diceBonus) {
        totalEnergy += state.diceRoll.reduce((sum, die) => sum + die, 0);
      }

      state.remainingEnergy = totalEnergy;
    }

    // Check for forced captures (checkers style)
    if (rules.mustCapture) {
      const captureMoves = this.getCaptureMoves(state);
      state.mustCapture = captureMoves.length > 0;
    }

    // Reset turn-specific flags
    state.selectedPiece = undefined;
    state.currentTurnActions = [];
  }

  // Get all available actions for current player
  getAvailableActions(state: GameState, position?: Position): TurnAction[] {
    const actions: TurnAction[] = [];

    // If must capture, only return capture moves
    if (state.mustCapture) {
      return this.getCaptureMoves(state, position);
    }

    // If specific piece selected
    if (position) {
      const piece = state.board[position.row][position.col];
      if (!piece || piece.owner !== state.currentPlayer) {
        return [];
      }

      actions.push(...this.getPieceActions(state, position, piece));
    } else {
      // Get all actions for current player
      for (let row = 0; row < state.config.boardHeight; row++) {
        for (let col = 0; col < state.config.boardWidth; col++) {
          const pos = { row, col };
          const piece = state.board[row][col];
          
          if (piece && piece.owner === state.currentPlayer) {
            actions.push(...this.getPieceActions(state, pos, piece));
          }
        }
      }

      // Add non-movement actions
      actions.push(...this.getSpecialActions(state));
    }

    // Filter by energy/movement constraints
    return this.filterActionsByConstraints(state, actions);
  }

  // Get actions for a specific piece
  getPieceActions(state: GameState, position: Position, piece: Piece): TurnAction[] {
    const actions: TurnAction[] = [];
    const def = this.getPieceDefinition(piece.type, state);

    // Regular moves and captures
    for (let row = 0; row < state.config.boardHeight; row++) {
      for (let col = 0; col < state.config.boardWidth; col++) {
        const to = { row, col };
        
        if (this.isValidMove(state, position, to, piece)) {
          const targetPiece = state.board[to.row][to.col];
          
          if (targetPiece && targetPiece.owner !== piece.owner) {
            // Capture action
            actions.push({
              type: "capture",
              from: position,
              to,
              piece,
              capturedPiece: targetPiece,
              energyCost: this.calculateEnergyCost(state, "capture", position, to)
            });
          } else if (!targetPiece) {
            // Regular move
            actions.push({
              type: "move",
              from: position,
              to,
              piece,
              energyCost: this.calculateEnergyCost(state, "move", position, to)
            });
          }
        }

        // Jump moves (for checkers, Crown Chase)
        if (def.canJump && this.isValidJump(state, position, to, piece)) {
          const jumpAction: TurnAction = {
            type: "jump",
            from: position,
            to,
            piece,
            energyCost: this.calculateEnergyCost(state, "jump", position, to)
          };

          // Check if jump captures
          const capturedPos = this.getJumpCapturePosition(position, to);
          if (capturedPos) {
            const capturedPiece = state.board[capturedPos.row][capturedPos.col];
            if (capturedPiece && this.canCapture(state, piece, capturedPiece)) {
              jumpAction.type = "capture";
              jumpAction.capturedPiece = capturedPiece;
              jumpAction.capturedPosition = capturedPos;
            }
          }

          actions.push(jumpAction);
        }
      }
    }

    // Special abilities
    if (def.specialAbilities) {
      for (const [abilityName, rule] of Object.entries(def.specialAbilities)) {
        const specialAction: TurnAction = {
          type: "special",
          from: position,
          piece,
          data: { ability: abilityName }
        };

        // Validate special ability
        const context: ActionContext = { rulePhase: "validation" };
        const result = rule(state, specialAction, context);
        
        if (result.success) {
          actions.push(specialAction);
        }
      }
    }

    // Promotion actions
    if (this.canPromote(state, position, piece)) {
      const def = this.getPieceDefinition(piece.type, state);
      if (def.promotionTargets) {
        for (const targetType of def.promotionTargets) {
          actions.push({
            type: "promote",
            from: position,
            to: position,
            piece,
            promoteTo: targetType
          });
        }
      }
    }

    return actions;
  }

  // Get special non-movement actions
  getSpecialActions(state: GameState): TurnAction[] {
    const actions: TurnAction[] = [];
    const rules = state.config.turnRules;

    // Skip turn action
    if (rules.canSkipTurn) {
      actions.push({
        type: "skip"
      });
    }

    // Barrier placement
    if (rules.hasBarriers) {
      const playerData = state.playerData?.[state.currentPlayer];
      if (playerData && playerData.barriersLeft > 0) {
        for (let row = 0; row < state.config.boardHeight; row++) {
          for (let col = 0; col < state.config.boardWidth; col++) {
            if (!state.board[row][col] && this.canPlaceBarrier(state, { row, col })) {
              actions.push({
                type: "place",
                to: { row, col },
                placedPiece: {
                  id: `barrier-${row}-${col}`,
                  type: "barrier",
                  owner: state.currentPlayer
                }
              });
            }
          }
        }
      }
    }

    // Dice rolling (if not auto-rolled)
    if (rules.hasDiceRolls && !state.diceRoll) {
      actions.push({
        type: "rollDice"
      });
    }

    // Declare no solution (for Sum Table Game type mechanics)
    if (rules.customRules?.allowNoSolution) {
      actions.push({
        type: "declareNoSolution"
      });
    }

    return actions;
  }

  // Execute a turn action
  executeAction(state: GameState, action: TurnAction): boolean {
    // Validate action first
    if (!this.validateAction(state, action)) {
      return false;
    }

    let success = false;
    const context: ActionContext = { rulePhase: "execution" };

    switch (action.type) {
      case "move":
        success = this.executeMove(state, action, context);
        break;
      case "capture":
        success = this.executeCapture(state, action, context);
        break;
      case "jump":
        success = this.executeJump(state, action, context);
        break;
      case "place":
        success = this.executePlace(state, action, context);
        break;
      case "promote":
        success = this.executePromote(state, action, context);
        break;
      case "skip":
        success = this.executeSkip(state, action, context);
        break;
      case "rollDice":
        success = this.executeRollDice(state, action, context);
        break;
      case "declareNoSolution":
        success = this.executeNoSolution(state, action, context);
        break;
      case "special":
        success = this.executeSpecial(state, action, context);
        break;
      default:
        return false;
    }

    if (success) {
      // Record action
      if (!state.currentTurnActions) state.currentTurnActions = [];
      state.currentTurnActions.push(action);
      
      if (!state.moveHistory) state.moveHistory = [];
      state.moveHistory.push(action);
      
      state.lastMove = action;

      // Process post-action effects
      this.processPostAction(state, action, context);

      // Update energy/moves
      this.updateTurnResources(state, action);

      // Check if turn should end
      if (this.shouldEndTurn(state, action)) {
        this.processTurnEnd(state);
      }
    }

    return success;
  }

  // Validate if an action is legal
  validateAction(state: GameState, action: TurnAction): boolean {
    // Energy check
    if (state.remainingEnergy !== undefined && action.energyCost) {
      if (action.energyCost > state.remainingEnergy) {
        return false;
      }
    }

    // Moves check
    if (state.remainingMoves !== undefined && state.remainingMoves <= 0 && 
        !["skip", "declareNoSolution", "rollDice"].includes(action.type)) {
      return false;
    }

    // Forced capture check
    if (state.mustCapture && !["capture", "jump"].includes(action.type)) {
      return false;
    }

    // Custom validation rules
    const rules = state.config.turnRules.customRules;
    if (rules) {
      for (const [ruleName, rule] of Object.entries(rules)) {
        const result = rule(state, action, { rulePhase: "validation" });
        if (!result.allowed) {
          return false;
        }
      }
    }

    return true;
  }

  // Basic movement validation
  isValidMove(state: GameState, from: Position, to: Position, piece: Piece): boolean {
    // Bounds check
    if (!this.isPositionInBounds(state, to)) return false;
    
    // Same position check
    if (from.row === to.row && from.col === to.col) return false;
    
    // Own piece collision
    const targetPiece = state.board[to.row][to.col];
    if (targetPiece && targetPiece.owner === piece.owner) return false;
    
    const def = this.getPieceDefinition(piece.type, state);
    
    // Movement rule check
    if (!def.movementRule(state, from, to, piece)) return false;
    
    // Path clear check
    if (def.requiresClearPath && !this.isPathClear(state, from, to, piece)) return false;
    
    return true;
  }

  // Jump validation
  isValidJump(state: GameState, from: Position, to: Position, piece: Piece): boolean {
    const def = this.getPieceDefinition(piece.type, state);
    if (!def.canJump || !def.jumpRule) return false;

    return def.jumpRule(state, from, to, piece);
  }

  // Path validation for sliding pieces
  isPathClear(state: GameState, from: Position, to: Position, piece: Piece): boolean {
    const path = this.getMovementPath(from, to);
    
    for (const pos of path) {
      const blockingPiece = state.board[pos.row][pos.col];
      if (blockingPiece) {
        const def = this.getPieceDefinition(blockingPiece.type, state);
        
        // Check if this piece type can be jumped over
        const jumpingDef = this.getPieceDefinition(piece.type, state);
        if (!jumpingDef.canJumpOver?.includes(blockingPiece.type) && !def.canBeJumpedOver) {
          return false;
        }
      }
    }
    
    return true;
  }

  // Execute movement action
  executeMove(state: GameState, action: TurnAction, context: ActionContext): boolean {
    if (!action.from || !action.to || !action.piece) return false;
    
    // Move piece
    state.board[action.to.row][action.to.col] = action.piece;
    state.board[action.from.row][action.from.col] = null;
    
    // Update piece data
    action.piece.hasMoved = true;
    action.piece.lastMoveNumber = state.turnCount;
    
    return true;
  }

  // Execute capture action
  executeCapture(state: GameState, action: TurnAction, context: ActionContext): boolean {
    if (!action.from || !action.to || !action.piece) return false;
    
    const capturedPiece = state.board[action.to.row][action.to.col];
    
    // Perform capture
    state.board[action.to.row][action.to.col] = action.piece;
    state.board[action.from.row][action.from.col] = null;
    
    // Update piece data
    action.piece.hasMoved = true;
    action.piece.lastMoveNumber = state.turnCount;
    
    // Track capture
    if (capturedPiece) {
      this.recordCapture(state, action.piece.owner, capturedPiece);
    }
    
    return true;
  }

  // Execute jump action (checkers-style, Crown Chase)
  executeJump(state: GameState, action: TurnAction, context: ActionContext): boolean {
    if (!action.from || !action.to || !action.piece) return false;
    
    // Move piece
    state.board[action.to.row][action.to.col] = action.piece;
    state.board[action.from.row][action.from.col] = null;
    
    // Handle capture if jumping over enemy
    if (action.capturedPosition && action.capturedPiece) {
      state.board[action.capturedPosition.row][action.capturedPosition.col] = null;
      this.recordCapture(state, action.piece.owner, action.capturedPiece);
    }
    
    // Update piece data
    action.piece.hasMoved = true;
    action.piece.lastMoveNumber = state.turnCount;
    
    // Check for multi-jump (checkers)
    if (state.config.turnRules.canChainCaptures) {
      const additionalJumps = this.getCaptureMoves(state, action.to);
      if (additionalJumps.length > 0) {
        state.captureChain = [action.to];
        state.mustCapture = true;
      }
    }
    
    return true;
  }

  // Execute barrier placement
  executePlace(state: GameState, action: TurnAction, context: ActionContext): boolean {
    if (!action.to || !action.placedPiece) return false;
    
    // Place barrier
    state.board[action.to.row][action.to.col] = action.placedPiece;
    
    // Update player data
    const playerData = state.playerData?.[state.currentPlayer];
    if (playerData && playerData.barriersLeft > 0) {
      playerData.barriersLeft--;
      
      // Track barriers in first row for Passagem rules
      if (action.to.row === (state.currentPlayer === 0 ? state.config.boardHeight - 1 : 0)) {
        playerData.barriersInFirstRow = (playerData.barriersInFirstRow || 0) + 1;
      }
    }
    
    return true;
  }

  // Execute promotion
  executePromote(state: GameState, action: TurnAction, context: ActionContext): boolean {
    if (!action.from || !action.piece || !action.promoteTo) return false;
    
    // Change piece type
    action.piece.type = action.promoteTo;
    action.piece.isPromoted = true;
    
    // Update board reference
    state.board[action.from.row][action.from.col] = action.piece;
    
    return true;
  }

  // Execute skip turn
  executeSkip(state: GameState, action: TurnAction, context: ActionContext): boolean {
    // Skip is always valid if allowed
    return true;
  }

  // Execute dice roll
  executeRollDice(state: GameState, action: TurnAction, context: ActionContext): boolean {
    const rules = state.config.turnRules;
    if (!rules.hasDiceRolls) return false;
    
    const diceCount = rules.diceCount || 2;
    const diceType = rules.diceType || 6;
    const diceRoll: number[] = [];
    
    for (let i = 0; i < diceCount; i++) {
      diceRoll.push(Math.floor(Math.random() * diceType) + 1);
    }
    
    state.diceRoll = diceRoll;
    action.diceRoll = diceRoll;
    
    // Update energy if using energy system
    if (rules.usesEnergySystem && state.selectedPiece) {
      const piece = state.board[state.selectedPiece.row][state.selectedPiece.col];
      if (piece) {
        const diceTotal = diceRoll.reduce((sum, die) => sum + die, 0);
        const pieceValue = piece.value || 0;
        state.remainingEnergy = diceTotal + pieceValue;
      }
    }
    
    return true;
  }

  // Execute special ability
  executeSpecial(state: GameState, action: TurnAction, context: ActionContext): boolean {
    if (!action.piece || !action.data?.ability) return false;
    
    const def = this.getPieceDefinition(action.piece.type, state);
    const ability = def.specialAbilities?.[action.data.ability];
    
    if (!ability) return false;
    
    const result = ability(state, action, context);
    return result.success;
  }

  // Execute no solution declaration
  executeNoSolution(state: GameState, action: TurnAction, context: ActionContext): boolean {
    // Implementation depends on specific game rules
    // This is a placeholder for games like Sum Table Game
    return true;
  }

  // Process end of turn
  processTurnEnd(state: GameState): void {
    // Process automatic captures (surrounding in Passagem)
    this.processAutomaticCaptures(state);
    
    // Process promotions
    this.processAutomaticPromotions(state);
    
    // Check win conditions
    const winResult = this.checkWinCondition(state);
    if (winResult) {
      state.winner = winResult.winner;
      state.gamePhase = "ended";
      return;
    }
    
    // Switch players
    state.currentPlayer = (state.currentPlayer + 1) % state.players;
    state.turnCount++;
    
    // Reset turn data
    state.currentTurnActions = [];
    state.mustCapture = false;
    state.captureChain = undefined;
    state.selectedPiece = undefined;
    
    // Initialize next turn
    this.initializeTurn(state);
  }

  // Check all win conditions
  checkWinCondition(state: GameState): WinResult | null {
    // Check custom win conditions
    if (state.config.winConditions) {
      for (const [name, condition] of Object.entries(state.config.winConditions)) {
        const result = condition(state);
        if (result) return result;
      }
    }
    
    // Check standard win conditions based on turn rules
    const rules = state.config.turnRules;
    
    if (rules.winConditions) {
      for (const conditionName of rules.winConditions) {
        const result = this.evaluateStandardWinCondition(state, conditionName);
        if (result) return result;
      }
    }
    
    return null;
  }

  // Helper methods
  private getPieceDefinition(type: string, state: GameState): PieceDefinition {
    const def = state.config.pieces.find(p => p.type === type);
    if (!def) {
      throw new Error(`Piece type ${type} not found in configuration`);
    }
    return def;
  }

  private isPositionInBounds(state: GameState, pos: Position): boolean {
    return pos.row >= 0 && pos.row < state.config.boardHeight &&
           pos.col >= 0 && pos.col < state.config.boardWidth;
  }

  private getMovementPath(from: Position, to: Position): Position[] {
    const path: Position[] = [];
    const rowStep = Math.sign(to.row - from.row);
    const colStep = Math.sign(to.col - from.col);
    
    let currentRow = from.row + rowStep;
    let currentCol = from.col + colStep;
    
    while (currentRow !== to.row || currentCol !== to.col) {
      path.push({ row: currentRow, col: currentCol });
      currentRow += rowStep;
      currentCol += colStep;
    }
    
    return path;
  }

  private calculateEnergyCost(state: GameState, actionType: string, from?: Position, to?: Position): number | undefined {
    if (!state.config.turnRules.usesEnergySystem) return undefined;
    
    const energyConfig = state.config.energySystem;
    if (!energyConfig?.enabled) return 0;
    
    let cost = 0;
    
    if (actionType === "move" && from && to) {
      const distance = Math.abs(from.row - to.row) + Math.abs(from.col - to.col);
      cost = distance * (energyConfig.movementCost || 2);
    } else if (actionType === "capture") {
      cost = energyConfig.captureCost || 2;
      if (from && to) {
        const distance = Math.abs(from.row - to.row) + Math.abs(from.col - to.col);
        cost += distance * (energyConfig.movementCost || 2);
      }
    }
    
    return cost;
  }

  private canCapture(state: GameState, capturingPiece: Piece, targetPiece: Piece): boolean {
    if (capturingPiece.owner === targetPiece.owner) return false;
    
    const def = this.getPieceDefinition(capturingPiece.type, state);
    
    // Some pieces can only capture specific types (Crown Chase Jumper -> King only)
    if (def.specialAbilities?.restrictedCapture) {
      // Implementation would depend on specific rules
      return targetPiece.type === "king";
    }
    
    return true;
  }

  private canPromote(state: GameState, position: Position, piece: Piece): boolean {
    const def = this.getPieceDefinition(piece.type, state);
    if (!def.canPromote || !def.promotionRule) return false;
    
    const result = def.promotionRule(state, { type: "promote", from: position, piece }, { rulePhase: "validation" });
    return result.success;
  }

  private canPlaceBarrier(state: GameState, position: Position): boolean {
    const rules = state.config.turnRules;
    const playerData = state.playerData?.[state.currentPlayer];
    
    if (!rules.hasBarriers || !playerData || playerData.barriersLeft <= 0) {
      return false;
    }
    
    // Check first row restriction (Passagem rule)
    const isFirstRow = position.row === (state.currentPlayer === 0 ? state.config.boardHeight - 1 : 0);
    if (isFirstRow) {
      const maxInFirstRow = rules.maxBarriersInFirstRow || 3;
      const currentInFirstRow = playerData.barriersInFirstRow || 0;
      if (currentInFirstRow >= maxInFirstRow) {
        return false;
      }
    }
    
    return true;
  }

  private getCaptureMoves(state: GameState, fromPosition?: Position): TurnAction[] {
    const captureMoves: TurnAction[] = [];
    
    if (fromPosition) {
      // Get captures for specific piece
      const piece = state.board[fromPosition.row][fromPosition.col];
      if (piece && piece.owner === state.currentPlayer) {
        const actions = this.getPieceActions(state, fromPosition, piece);
        captureMoves.push(...actions.filter(a => a.type === "capture" || a.type === "jump"));
      }
    } else {
      // Get all capture moves for current player
      for (let row = 0; row < state.config.boardHeight; row++) {
        for (let col = 0; col < state.config.boardWidth; col++) {
          const pos = { row, col };
          const piece = state.board[row][col];
          
          if (piece && piece.owner === state.currentPlayer) {
            const actions = this.getPieceActions(state, pos, piece);
            captureMoves.push(...actions.filter(a => a.type === "capture" || a.type === "jump"));
          }
        }
      }
    }
    
    return captureMoves;
  }

  private getJumpCapturePosition(from: Position, to: Position): Position | null {
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    
    // Only for 2-square jumps
    if (Math.abs(rowDiff) === 2 || Math.abs(colDiff) === 2) {
      return {
        row: from.row + Math.sign(rowDiff),
        col: from.col + Math.sign(colDiff)
      };
    }
    
    return null;
  }

  private recordCapture(state: GameState, capturingPlayer: number, capturedPiece: Piece): void {
    if (!state.gameData) state.gameData = {};
    if (!state.gameData.capturedPieces) {
      state.gameData.capturedPieces = new Array(state.players).fill(0);
    }
    
    state.gameData.capturedPieces[capturingPlayer]++;
  }

  private processAutomaticCaptures(state: GameState): void {
    // Implementation for surrounding captures (Passagem)
    if (state.config.captureRules) {
      for (const [name, rule] of Object.entries(state.config.captureRules)) {
        const result = rule(state, { type: "special" }, { rulePhase: "afterEffects" });
        if (result.success && result.additionalActions) {
          for (const action of result.additionalActions) {
            this.executeAction(state, action);
          }
        }
      }
    }
  }

  private processAutomaticPromotions(state: GameState): void {
    // Check for automatic promotions (checkers reaching end)
    for (let row = 0; row < state.config.boardHeight; row++) {
      for (let col = 0; col < state.config.boardWidth; col++) {
        const piece = state.board[row][col];
        if (piece) {
          const def = this.getPieceDefinition(piece.type, state);
          if (def.canPromote && def.promotionRule) {
            const result = def.promotionRule(state, { type: "promote", from: { row, col }, piece }, { rulePhase: "afterEffects" });
            if (result.success && def.promotionTargets) {
              // Auto-promote to first available type
              piece.type = def.promotionTargets[0];
              piece.isPromoted = true;
            }
          }
        }
      }
    }
  }

  private evaluateStandardWinCondition(state: GameState, conditionName: string): WinResult | null {
    switch (conditionName) {
      case "captureKing":
        return this.checkCaptureTarget(state, "king");
      case "captureCaptain":
        return this.checkCaptureTarget(state, "captain");
      case "crossingRace":
        return this.checkCrossingRace(state);
      case "captureCount":
        return this.checkCaptureCount(state);
      case "lastStanding":
        return this.checkLastStanding(state);
      case "mostPieces":
        return this.checkMostPieces(state);
      default:
        return null;
    }
  }

  private checkCaptureTarget(state: GameState, targetType: string): WinResult | null {
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
  }

  private checkCrossingRace(state: GameState): WinResult | null {
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
      
      if (scored >= piecesToWin) {
        return {
          winner: player,
          reason: `Scored ${piecesToWin} pieces`,
          gameEnd: true
        };
      }
    }
    return null;
  }

  private checkCaptureCount(state: GameState): WinResult | null {
    const capturesToWin = state.config.turnRules.capturesToWin || 5;
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
  }

  private checkLastStanding(state: GameState): WinResult | null {
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

  private checkMostPieces(state: GameState): WinResult | null {
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
        winner: -1,
        reason: "Tied on piece count",
        gameEnd: true
      };
    }
  }

  private shouldEndTurn(state: GameState, action: TurnAction): boolean {
    const rules = state.config.turnRules;
    
    // Turn ends immediately on skip
    if (action.type === "skip") return true;
    
    // Turn ends if no moves/energy remaining
    if (state.remainingMoves !== undefined && state.remainingMoves <= 0) return true;
    if (state.remainingEnergy !== undefined && state.remainingEnergy <= 0) return true;
    
    // Turn ends if must use all moves and all used
    if (rules.mustUseAllMoves && state.remainingMoves === 0) return true;
    
    // Turn continues if in capture chain
    if (state.captureChain && state.captureChain.length > 0) return false;
    
    return false;
  }

  private updateTurnResources(state: GameState, action: TurnAction): void {
    // Update remaining moves
    if (state.remainingMoves !== undefined && !["rollDice", "declareNoSolution"].includes(action.type)) {
      state.remainingMoves--;
    }
    
    // Update remaining energy
    if (state.remainingEnergy !== undefined && action.energyCost !== undefined) {
      state.remainingEnergy -= action.energyCost;
    }
  }

  private filterActionsByConstraints(state: GameState, actions: TurnAction[]): TurnAction[] {
    return actions.filter(action => {
      // Energy constraint
      if (state.remainingEnergy !== undefined && action.energyCost !== undefined) {
        if (action.energyCost > state.remainingEnergy) return false;
      }
      
      // Move constraint
      if (state.remainingMoves !== undefined && state.remainingMoves <= 0 &&
          !["skip", "declareNoSolution", "rollDice"].includes(action.type)) {
        return false;
      }
      
      return true;
    });
  }

  private processPostAction(state: GameState, action: TurnAction, context: ActionContext): void {
    // Process game-specific post-action rules
    context.rulePhase = "afterEffects";
    
    if (state.config.turnRules.customRules) {
      for (const [name, rule] of Object.entries(state.config.turnRules.customRules)) {
        rule(state, action, context);
      }
    }
  }

  private initializeGameData(config: GameConfig): Record<string, any> {
    const gameData: Record<string, any> = {};
    
    // Initialize capture tracking
    gameData.capturedPieces = new Array(config.players).fill(0);
    
    // Initialize scoring if needed
    if (config.scoringSystem?.enabled) {
      gameData.scores = new Array(config.players).fill(0);
    }
    
    return gameData;
  }

  private initializePlayerData(config: GameConfig): Record<number, Record<string, any>> {
    const playerData: Record<number, Record<string, any>> = {};
    
    for (let i = 0; i < config.players; i++) {
      playerData[i] = {
        barriersLeft: config.turnRules.barriersPerPlayer || 0,
        barriersInFirstRow: 0,
        score: 0,
        capturedPieces: 0
      };
      
      // Game-specific initialization
      if (config.name === "Math War") {
        playerData[i].selectedPieceValue = 0;
      }
    }
    
    return playerData;
  }
}

// Legacy function exports for backward compatibility
const engine = new GameEngine();

export function initializeBoard(config: GameConfig): GameState {
  return engine.initializeBoard(config);
}

export function getAvailableActions(state: GameState, position?: Position): TurnAction[] {
  return engine.getAvailableActions(state, position);
}

export function executeAction(state: GameState, action: TurnAction): boolean {
  return engine.executeAction(state, action);
}

export function isValidMove(state: GameState, from: Position, to: Position, piece: Piece): boolean {
  return engine.isValidMove(state, from, to, piece);
}

export function checkWinCondition(state: GameState): WinResult | null {
  return engine.checkWinCondition(state);
}

export function validateAction(state: GameState, action: TurnAction): boolean {
  return engine.validateAction(state, action);
}

// Utility functions
export function cloneGameState(state: GameState): GameState {
  return {
    board: state.board.map(row => row.map(piece => piece ? { ...piece } : null)),
    currentPlayer: state.currentPlayer,
    turnCount: state.turnCount,
    players: state.players,
    config: state.config,
    gameData: state.gameData ? { ...state.gameData } : undefined,
    playerData: state.playerData ? JSON.parse(JSON.stringify(state.playerData)) : undefined,
    gamePhase: state.gamePhase,
    winner: state.winner,
    lastMove: state.lastMove ? { ...state.lastMove } : undefined,
    moveHistory: state.moveHistory ? [...state.moveHistory] : undefined,
    currentTurnActions: state.currentTurnActions ? [...state.currentTurnActions] : undefined,
    remainingMoves: state.remainingMoves,
    remainingEnergy: state.remainingEnergy,
    diceRoll: state.diceRoll ? [...state.diceRoll] : undefined,
    selectedPiece: state.selectedPiece ? { ...state.selectedPiece } : undefined,
    mustCapture: state.mustCapture,
    captureChain: state.captureChain ? [...state.captureChain] : undefined,
    pendingPromotions: state.pendingPromotions ? [...state.pendingPromotions] : undefined
  };
}

export function validateGameState(state: GameState): boolean {
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

export function getMovementPath(from: Position, to: Position): Position[] {
  const path: Position[] = [];
  const rowStep = Math.sign(to.row - from.row);
  const colStep = Math.sign(to.col - from.col);
  
  let currentRow = from.row + rowStep;
  let currentCol = from.col + colStep;
  
  while (currentRow !== to.row || currentCol !== to.col) {
    path.push({ row: currentRow, col: currentCol });
    currentRow += rowStep;
    currentCol += colStep;
  }
  
  return path;
}

export function getPieceValue(piece: Piece, gameConfig: GameConfig): number {
  if (gameConfig.name === "Math War" && piece.value !== undefined) {
    return piece.value;
  }
  
  // Default piece values for other games
  const values: Record<string, number> = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 100,
    captain: 100
  };
  
  return values[piece.type] || 1;
}

export function formatGameResult(state: GameState): string {
  if (state.winner === null || state.winner === undefined) {
    return "Game in progress";
  }
  
  if (state.winner === -1) {
    return "Game ended in a draw";
  }
  
  return `Player ${state.winner + 1} wins!`;
}

export function getGameStatistics(state: GameState): Record<string, any> {
  const stats: Record<string, any> = {
    turnCount: state.turnCount,
    moveCount: state.moveHistory?.length || 0,
    gamePhase: state.gamePhase,
    winner: state.winner
  };
  
  // Piece counts
  const pieceCounts = new Array(state.players).fill(0);
  for (let row = 0; row < state.config.boardHeight; row++) {
    for (let col = 0; col < state.config.boardWidth; col++) {
      const piece = state.board[row][col];
      if (piece && piece.type !== "barrier") {
        pieceCounts[piece.owner]++;
      }
    }
  }
  stats.pieceCounts = pieceCounts;
  
  // Captures
  if (state.gameData?.capturedPieces) {
    stats.capturedPieces = state.gameData.capturedPieces;
  }
  
  return stats;
}