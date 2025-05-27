import { useState, useEffect } from "react";
import "./Stop.css";
import "./JogoStop.css";
import CaixaStop from "./CaixaStop";

type JogoStopProps = {
  randomNumber: number;
};



const numeros: number[] = [9, 5, 4, 5, 2, 5];








function oldStopJogo({ randomNumber }: JogoStopProps) {
  const [count, setCount] = useState(0); // Timer starts at 0
  const [showGame, setShowGame] = useState(true); // Game starts immediately visible
  const [pararJogo, setPararJogo] = useState(false);

  useEffect(() => {
    if (!showGame || pararJogo) return;

    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1); // Count up
    }, 1000);

    return () => clearInterval(interval); // Clean up interval on unmount or change
  }, [showGame, pararJogo]);

  return (
    <div className="regras">
      <h2>{count}</h2>
      <div className="tabela">
        {/* First row - header */}
        <div>&nbsp;</div>

        {/*{numeros.map((num, i) => (
          <div key={`cab-${i}`} className="cell header">
            {"+" + String(num)}
          </div>
        ))}*/}

        {/* Second row - content */}
        <div className="cell row-header">{randomNumber}</div>
        {numeros.map((num, i) => (
          <CaixaStop
            key={`caixa-${i}`}
            numero_base={randomNumber}
            checar={pararJogo}
            numero={num}
            conta={"+"}
          />
        ))}
      </div>

      <button onClick={() => setPararJogo(true)}>STOP</button>

      {pararJogo && <h1>Tempo Final: {count} segundos</h1>}
    </div>
  );
}

export default oldStopJogo;