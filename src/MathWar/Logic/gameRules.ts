import { gameEngine } from './gameEngine';
import { GameConfig, GameRules, GameState, TurnAction, Position, Piece, WinResult } from './types';
import { GameUtils, MovementPatterns } from './types';

export const gameRules: GameRules = {
  validateMove: (state: GameState, action: TurnAction) => {
  // Helper function for move validation
  const valMove = (state: GameState, piece: Piece, from: Position, to: Position): boolean => {
    // Check if destination is empty
    if (gameEngine.getPieceAt(state, to) !== null) return false;
    
    // Check if dice have been rolled
    if (!state.lastDiceRoll) return false;
    
    // Calculate Manhattan distance
    const distance = Math.abs(to.row - from.row) + Math.abs(to.col - from.col);
    
    // Calculate allowed movement based on (value + dice) / 2
    const diceTotal = state.lastDiceRoll.reduce((sum, num) => sum + num, 0);
    const allowedMovement = Math.floor((piece.value! + diceTotal) / 2);
    
    // Check if move distance is within allowed range
    if (distance > allowedMovement) return false;
    
    // Check energy cost (2 per space)
    const energyCost = distance * 2;
    if (state.remainingEnergy === undefined || state.remainingEnergy < energyCost) return false;
    
    return true;
  }

  // Helper function for capture validation
  const valCapture = (state: GameState, piece: Piece, from: Position, to: Position): boolean => {
    // Add capture validation logic here
    // Check if target is enemy piece
    // Check if piece values allow capture
    // Check adjacency/distance rules
    return true;
  }

  // Check if action has required positions
  if (!action.from || !action.to) return false;

  // Basic validation (bounds, ownership, obstacles)
  if (!gameEngine.isValidBasicMove(state, action.from, action.to)) {
    return false;
  }

  const piece = gameEngine.getPieceAt(state, action.from);
  if (!piece || piece.type !== 'pawn') return false;

  switch (action.type) {
    case 'move':
      return valMove(state, piece, action.from, action.to);
    case 'capture':
      return valCapture(state, piece, action.from, action.to);
    default:
      return false;
  }
},

  executeAction: (state: GameState, action: TurnAction): boolean => {
    if (!gameRules.validateMove(state, action)) {
      return false;
    }

    const piece = state.board[action.from!.row][action.from!.col];
    const rowDiff = action.to!.row - action.from!.row;
    const colDiff = Math.abs(action.to!.col - action.from!.col);

    // Check if this is a capture move (2 square diagonal jump)
    if (Math.abs(rowDiff) === 2 && colDiff === 2) {
      // Calculate middle position (piece being captured)
      const middleRow = action.from!.row + Math.sign(rowDiff);
      const middleCol = action.from!.col + Math.sign(action.to!.col - action.from!.col);
      const capturedPiece = state.board[middleRow][middleCol];

      // Store captured piece information
      action.capturedPiece = capturedPiece || undefined;
      action.type = 'capture';

      // Remove captured piece
      state.board[middleRow][middleCol] = null;
    }

    // Move the piece to destination
    state.board[action.to!.row][action.to!.col] = piece;
    state.board[action.from!.row][action.from!.col] = null;

    return true;
  },

  getAvailableActions: (state: GameState, position?: Position): TurnAction[] => {
    const actions: TurnAction[] = [];

    const getPossibleMovesForPiece = (piecePosition: Position): TurnAction[] => {
      const moves: TurnAction[] = [];
      const piece = state.board[piecePosition.row][piecePosition.col];

      if (!piece || piece.owner !== state.currentPlayer) {
        return moves;
      }

      // Determine forward direction
      const forwardDirection = state.currentPlayer === 0 ? -1 : 1;

      // Check for captures first (2 squares diagonally)
      const capturePositions = [
        { row: piecePosition.row + (forwardDirection * 2), col: piecePosition.col - 2 }, // capture left
        { row: piecePosition.row + (forwardDirection * 2), col: piecePosition.col + 2 } // capture right
      ];

      for (const targetPos of capturePositions) {
        const action: TurnAction = {
          type: 'capture',
          from: piecePosition,
          to: targetPos
        };

        if (gameRules.validateMove(state, action)) {
          moves.push(action);
        }
      }

      // Check for regular moves (1 square diagonally)
      const regularMovePositions = [
        { row: piecePosition.row + forwardDirection, col: piecePosition.col - 1 }, // move left
        { row: piecePosition.row + forwardDirection, col: piecePosition.col + 1 } // move right
      ];

      for (const targetPos of regularMovePositions) {
        const action: TurnAction = {
          type: 'move',
          from: piecePosition,
          to: targetPos
        };

        if (gameRules.validateMove(state, action)) {
          moves.push(action);
        }
      }

      return moves;
    };

    if (position) {
      // Get moves for specific piece
      const piece = state.board[position.row][position.col];
      if (piece && piece.owner === state.currentPlayer) {
        const moves = getPossibleMovesForPiece(position);
        actions.push(...moves);
      }
    } else {
      // Get all possible moves for current player
      for (let row = 0; row < state.config.boardHeight; row++) {
        for (let col = 0; col < state.config.boardWidth; col++) {
          const piece = state.board[row][col];
          if (piece && piece.owner === state.currentPlayer) {
            const moves = getPossibleMovesForPiece({ row, col });
            actions.push(...moves);
          }
        }
      }
    }

    return actions;
  },

  checkWinCondition: (state: GameState): WinResult | null => {
    // Win condition: Current player has no valid moves available
    const availableMoves = gameRules.getAvailableActions(state);
    if (availableMoves.length === 0) {
      const winner = state.currentPlayer === 0 ? 1 : 0;
      return {
        winner,
        reason: `Player ${state.currentPlayer + 1} has no valid moves!`
      };
    }

    return null;
  },
  getActionsForPiece: function (state: GameState, position: Position): unknown {
    throw new Error('Function not implemented.');
  },
  shouldPromotePiece: function (state: GameState, piece: Piece, to: Position): unknown {
    throw new Error('Function not implemented.');
  }
};