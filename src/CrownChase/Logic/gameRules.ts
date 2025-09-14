import { GameConfig, GameRules, GameState, TurnAction, Position, Piece, WinResult } from './types';
import { GameUtils, MovementPatterns } from './types';
import { gameEngine } from './gameEngine';

export const gameRules: GameRules = {
validateMove: (state, action) => {
  // Check if action has required positions
  if (!action.from || !action.to) return false;

  // Basic validation (bounds, ownership, obstacles)
  if (!gameEngine.isValidBasicMove(state, action.from, action.to)) {
    return false;
  }

  const piece = gameEngine.getPieceAt(state, action.from);
  if (!piece) return false;

  // First check piece type
  switch (piece.type) {
    case 'pawn':
      // Then check action type for pawns
      switch (action.type) {
        case 'move':
          // Pawn move validation
          break;
        case 'capture':
          // Pawn capture validation
          break;
        default:
          return false;
      }
      break;

    case 'rook':
      // Check action type for rooks
      switch (action.type) {
        case 'move':
          // Rook move validation
          break;
        case 'capture':
          // Rook capture validation
          break;
        default:
          return false;
      }
      break;

    case 'king':
      // Check action type for kings
      switch (action.type) {
        case 'move':
          // King move validation
          break;
        case 'capture':
          // King capture validation
          break;
        default:
          return false;
      }
      break;

    default:
      return false;
  }

  return true; // If all validation passed
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