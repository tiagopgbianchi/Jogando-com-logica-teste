import Tabuleiro from "./componentes/tabuleiro";
import Girar from "./componentes/sorteio";
import Iniciar from "./componentes/iniciar";
import Timer from "./componentes/timer";
import { useState } from "react";
import "./design.css";

function Caca_soma() {
  const [jogar, setJogar] = useState(false);
  const [clicar, setClicar] = useState(true);
  const [qualJoga, setQualJoga] = useState(false);
  const mudarQualJoga = () => {
    setQualJoga(!qualJoga);
  };
  const mudarClicar = () => {
    setClicar(!clicar);
  };
  const mudarJogar = () => {
    setJogar(!jogar);
  };

  const [pontu_1, setPontu_1] = useState(0.0);
  const [pontu_2, setPontu_2] = useState(0.0);
  const addPontu = (aumento: number) => {
    if (qualJoga) setPontu_1(pontu_1 + aumento);
    else setPontu_2(pontu_2 + aumento);
  };
  return (
    <div className="container">
      <div>
        <div className="num-pontu-1">{pontu_1.toFixed(1)}</div>
        <div className="num-pontu-2">{pontu_2.toFixed(1)}</div>
      </div>
      <Tabuleiro
        mudarClicar={mudarClicar}
        jogar={jogar}
        mudarJogar={mudarJogar}
      />
      <div>
        <div className="texto-sorte">Número sorteado</div>
        <div className="num-sorte">
          {<Girar clicar={clicar} mudarJogar={mudarJogar} />}
        </div>
        <div className="botao-ini">
          <Iniciar
            mudarClicar={mudarClicar}
            clicar={clicar}
            mudarQualJoga={mudarQualJoga}
          />
        </div>
        <div>
          <Timer jogar={jogar} addPontu={addPontu} />
        </div>
      </div>
    </div>
  );
}

export default Caca_soma;
