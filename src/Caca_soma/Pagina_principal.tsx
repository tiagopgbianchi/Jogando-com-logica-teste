import Tabuleiro from "./componentes/tabuleiro";
import Girar from "./componentes/sorteio";
import Iniciar from "./componentes/iniciar";
import { useState } from "react";
import "./design.css";

function Caca_soma() {
  const [jogar, setJogar] = useState(false);
  const [clicar, setClicar] = useState(true);
  const mudarClicar = () => {
    setClicar(!clicar);
  };
  const mudarJogar = () => {
    setJogar(!jogar);
  };

  const [pontu_1, setPontu_1] = useState(0);
  const [pontu_2, setPontu2] = useState(0);
  const addPontu = (aumento: number) => {
    setPontu_1(pontu_1 + aumento);
  };
  return (
    <div className="container">
      <div>
        <div className="num-pontu-1">{pontu_1}</div>
        <div className="num-pontu-2">{pontu_2}</div>
      </div>
      <Tabuleiro
        addPontu={addPontu}
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
          <Iniciar mudarClicar={mudarClicar} clicar={clicar} />
        </div>
      </div>
    </div>
  );
}

export default Caca_soma;
