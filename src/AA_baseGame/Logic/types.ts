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
}

export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: number;
  turnCount: number;
  players: number;
  config: GameConfig; // added so rules are accessible
}

export type MovementRule = (
  state: GameState,
  from: Position,
  to: Position,
  piece: Piece
) => boolean;

export type CaptureRule = MovementRule;

export interface PieceDefinition {
  type: string;
  movementRule: MovementRule;
  captureRule: CaptureRule;
}

export interface InitialPieceSetup {
  type: string;
  row: number;
  col: number;
  owner: number;
  data?: Record<string, any>;
}

export interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  players: number;
  pieces: PieceDefinition[];
  initialSetup?: InitialPieceSetup[];
  turnRules: {
    movesPerTurn?: number;
    diceBased?: boolean;
    teamBased?: boolean;
  };
}