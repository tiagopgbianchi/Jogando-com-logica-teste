import "../design.css";

interface prop {
  mudarClicar: () => void;
  clicar: boolean;
}
function Iniciar({ mudarClicar, clicar }: prop) {
  return (
    <button
      onClick={() => {
        clicar ? mudarClicar() : null;
      }}
    >
      INICIAR
    </button>
  );
}

export default Iniciar;
