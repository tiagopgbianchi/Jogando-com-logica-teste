export type Player = 1 | 2; // 1 = white, 2 = black

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
}

export interface PieceType {
  player: Player;
  isKing: boolean;
}