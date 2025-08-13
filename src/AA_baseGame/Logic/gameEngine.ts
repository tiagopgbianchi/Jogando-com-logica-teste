import { GameState, Position, Piece, PieceDefinition, GameConfig } from "./types";

function getPieceDefinition(type: string, state: GameState): PieceDefinition {
  return state.config.pieces.find((p: PieceDefinition) => p.type === type)!;
}

export function isValidMove(state: GameState, from: Position, to: Position, piece: Piece): boolean {
  const def = getPieceDefinition(piece.type, state);
  return def.movementRule(state, from, to, piece);
}

export function isValidCapture(state: GameState, from: Position, to: Position, piece: Piece): boolean {
  const def = getPieceDefinition(piece.type, state);
  return def.captureRule(state, from, to, piece);
}

export function getValidMoves(state: GameState, from: Position): Position[] {
  const piece = state.board[from.row][from.col];
  if (!piece) return [];

  const moves: Position[] = [];
  for (let r = 0; r < state.board.length; r++) {
    for (let c = 0; c < state.board[0].length; c++) {
      const pos = { row: r, col: c };
      if (isValidMove(state, from, pos, piece) || isValidCapture(state, from, pos, piece)) {
        moves.push(pos);
      }
    }
  }
  return moves;
}

export function attemptMove(state: GameState, from: Position, to: Position): boolean {
  const piece = state.board[from.row][from.col];
  if (!piece) return false;

  if (isValidCapture(state, from, to, piece) || isValidMove(state, from, to, piece)) {
    state.board[to.row][to.col] = piece;
    state.board[from.row][from.col] = null;
    return true;
  }
  return false;
}

export function initializeBoard(config: GameConfig): GameState {
  const board: (Piece | null)[][] = Array.from({ length: config.boardHeight }, () =>
    Array.from({ length: config.boardWidth }, () => null)
  );

  if (config.initialSetup) {
    for (const setup of config.initialSetup) {
      const piece: Piece = {
        id: `${setup.type}-${setup.row}-${setup.col}`,
        type: setup.type,
        owner: setup.owner,
        data: setup.data || {}
      };
      board[setup.row][setup.col] = piece;
    }
  }

  return {
    board,
    currentPlayer: 0,
    turnCount: 0,
    players: config.players,
    config
  };
}