import { PieceType } from "../types";

interface PieceProps {
  codigo: (x: number, y: number, piece: PieceType) => void;
  piece: PieceType;
  posi_x: number;
  posi_y: number;
  selected?: boolean;
  mustCapture?: boolean;
}

function Piece({ codigo, piece, posi_x, posi_y, selected, mustCapture }: PieceProps) {
  const handleClick = () => {
    codigo(posi_x, posi_y, piece);
  };

  let className = "piece";
  if (selected) {
    className += piece.player === 1 ? " selected-white" : " selected-black";
  }
  if (mustCapture) {
    className += piece.player === 1 ? " must-capture-white" : " must-capture-black";
  }
  if (piece.isKing) {
    className += piece.player === 1 ? " king-white" : " king-black";
  }

  const imgSrc = piece.player === 1
    ? `${import.meta.env.BASE_URL}circulo_branco.png`
    : `${import.meta.env.BASE_URL}circulo_preto.png`;

  return (
    <button onClick={handleClick} className={className}>
      <img
        src={imgSrc}
        alt={piece.isKing ? "King piece" : "Checker piece"}
        width={50}
      />
    </button>
  );
}

export default Piece;
