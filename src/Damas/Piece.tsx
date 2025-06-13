interface PieceProps {
  codigo: (x: number, y: number, z: number) => void;
  image: number;
  posi_x: number;
  posi_y: number;
}

function Piece(Props: PieceProps) {
  const handleClick = () => {
    Props.codigo(Props.posi_x, Props.posi_y, Props.image);
  };
  return (
    <button
      onClick={handleClick}
      style={{ border: "none", background: "transparent", padding: 0 }}
    >
      <img
        src={
          Props.image === 1
            ? "../public/circulo_branco.png"
            : "../public/circulo_preto.png"
        }
        alt="A description"
        width={50}
      />
    </button>
  );
}

export default Piece;
