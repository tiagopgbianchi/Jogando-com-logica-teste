import Tabuleiro from "./componentes/tabuleiro";
import Girar from "./componentes/sorteio";
import { useState } from "react";
import "./design.css";

function Caca_soma() {
  const [clicar, setClicar] = useState(false);
  const mudarClicar = () => {
    setClicar(!clicar);
  };

  const [pontu, setPontu] = useState(0);
  const addPontu = () => {
    setPontu(pontu + 1);
  };
  return (
    <div className="container">
      <div>
        <div className="num-pontu">{pontu}</div>
      </div>
      <Tabuleiro
        addPontu={addPontu}
        mudarClicar={mudarClicar}
        clicar={clicar}
      />
      <div>
        <div className="texto-sorte">Número sorteado</div>
        <div className="num-sorte">
          {<Girar clicar={clicar} mudarClicar={mudarClicar} />}
        </div>
      </div>
    </div>
  );
}

export default Caca_soma;
