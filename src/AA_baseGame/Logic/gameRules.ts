// games/passagem/passagemRules.ts
import { GameRules, GameState, TurnAction, WinResult, Position } from './types';
import { gameEngine } from './gameEngine';

export const passagemRules: GameRules = {
  onGameStart: (state: GameState) => {
    // Initialize game data
    state.gameData.scoringPieces = [0, 0];  // Track scoring pieces per player
  },

  validateMove: (state: GameState, action: TurnAction): boolean => {
    if (action.type !== "move") return false;

    // Basic move validation
    if (!gameEngine.isValidBasicMove(state, action.from!, action.to!)) {
      return false;
    }

    const piece = gameEngine.getPieceAt(state, action.from!);
    if (!piece) return false;

    // Validate king-like movement (1 square in any direction)
    const rowDiff = Math.abs(action.from!.row - action.to!.row);
    const colDiff = Math.abs(action.from!.col - action.to!.col);
    
    if (rowDiff > 1 || colDiff > 1) return false;
    if (rowDiff === 0 && colDiff === 0) return false; // Must actually move

    return true;
  },

  executeAction: (state: GameState, action: TurnAction): boolean => {
    if (action.type !== "move") return false;

    const piece = gameEngine.getPieceAt(state, action.from!);
    if (!piece) return false;

    // Execute the move
    const success = gameEngine.executeBasicMove(state, action);
    if (!success) return false;

    // Check if piece reached scoring row
    const scoringRow = piece.owner === 0 ? 0 : 7; // Player 0 scores at row 0, Player 1 at row 7
    if (action.to!.row === scoringRow) {
      state.gameData.scoringPieces[piece.owner]++;
    }

    return true;
  },

  getAvailableActions: (state: GameState, position?: Position): TurnAction[] => {
    const actions: TurnAction[] = [];
    
    // Get all player pieces
    const playerPieces = gameEngine.getPlayerPieces(state, state.currentPlayer);
    
    for (const { piece, position: piecePos } of playerPieces) {
      // Generate king-like moves (1 square in any direction)
      for (let rowDelta = -1; rowDelta <= 1; rowDelta++) {
        for (let colDelta = -1; colDelta <= 1; colDelta++) {
          if (rowDelta === 0 && colDelta === 0) continue; // Skip staying in place
          
          const to: Position = {
            row: piecePos.row + rowDelta,
            col: piecePos.col + colDelta
          };

          const moveAction: TurnAction = {
            type: "move",
            from: piecePos,
            to,
            piece
          };

          if (passagemRules.validateMove(state, moveAction)) {
            actions.push(moveAction);
          }
        }
      }
    }

    return actions;
  },

  checkWinCondition: (state: GameState): WinResult | null => {
    // Check scoring win condition (4 pieces in opponent's last row)
    for (let player = 0; player < state.players; player++) {
      if (state.gameData.scoringPieces[player] >= 4) {
        return {
          winner: player,
          reason: "Reached opponent's last row with 4 pieces",
          immediate: true
        };
      }
    }

    return null;
  }
};