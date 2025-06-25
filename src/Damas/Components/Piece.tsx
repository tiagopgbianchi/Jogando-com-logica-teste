interface PieceProps {
  codigo: (x: number, y: number, z: number) => void;
  image: number;
  posi_x: number;
  posi_y: number;
  selected?: boolean; // NEW
}

function Piece({ codigo, image, posi_x, posi_y, selected }: PieceProps) {
  const handleClick = () => {
    codigo(posi_x, posi_y, image);
  };

  return (
    <button
      onClick={handleClick}
      className={selected ? "piece selected" : "piece"}
    >
      <img
        src={
          image === 1
            ? `${import.meta.env.BASE_URL}circulo_branco.png`
            : `${import.meta.env.BASE_URL}circulo_preto.png`
        }
        alt="Checker piece"
        width={50}
      />
    </button>
  );
}

export default Piece;
