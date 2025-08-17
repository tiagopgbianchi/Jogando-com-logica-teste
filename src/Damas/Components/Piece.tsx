import { PieceType } from "../types";
import styles from "../styles/board.module.css";
import clsx from 'clsx';

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

  const classNames = clsx(
    styles.piece,
    selected && (piece.player === 1 ? styles["selected-white"] : styles["selected-black"]),
    mustCapture && (piece.player === 1 ? styles["must-capture-white"] : styles["must-capture-black"]),
    piece.isKing && (piece.player === 1 ? styles["king-white"] : styles["king-black"])
  );

  const imgSrc = piece.player === 1
    ? `${import.meta.env.BASE_URL}circulo_branco.png`
    : `${import.meta.env.BASE_URL}circulo_preto.png`;

  return (
    <button onClick={handleClick} className={classNames}>
      <img
        src={imgSrc}
        alt={piece.isKing ? "King piece" : "Checker piece"}
        width={50}
      />
    </button>
  );
}

export default Piece;
