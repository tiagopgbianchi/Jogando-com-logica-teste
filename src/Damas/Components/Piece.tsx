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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
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

  const altText = `${piece.player === 1 ? 'White' : 'Black'} ${piece.isKing ? 'king' : 'piece'}`;
  const ariaLabel = `${piece.player === 1 ? 'White' : 'Black'} ${piece.isKing ? 'king' : 'piece'} at position ${String.fromCharCode(65 + posi_y)}${8 - posi_x}`;

  return (
    <button 
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={classNames}
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <img
        src={imgSrc}
        alt={altText}
        width={50}
        height={50}
        loading="lazy"
      />
    </button>
  );
}

export default Piece;