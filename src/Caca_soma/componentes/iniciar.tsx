import "../design.css";

interface prop {
  mudarClicar: () => void;
  mudarQualJoga: () => void;
  clicar: boolean;
}
function Iniciar({ mudarClicar, clicar, mudarQualJoga }: prop) {
  return (
    <button
      onClick={() => {
        if (clicar) {
          mudarClicar();
          mudarQualJoga();
        }
      }}
    >
      INICIAR
    </button>
  );
}

export default Iniciar;
