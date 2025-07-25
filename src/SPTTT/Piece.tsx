interface PieceProps {
  player: "X" | "O";
}

export function Piece({ player }: PieceProps) {
  return (
    <div className={`symbol ${player === "X" ? "x-symbol" : "o-symbol"}`}>
      {player === "X" ? "✖️" : "⭕"}
    </div>
  );
}