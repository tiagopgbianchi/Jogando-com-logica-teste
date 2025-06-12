import { useState, useEffect } from "react";
import "./Stop.css";
import "./JogoStop.css";
import CaixaStop from "./CaixaStop";
import { difficulties } from "./Difficulties";

type JogoStopProps = {
  randomNumber: number;
  difficulty: "d1" | "d2" | "d3";
};

function StopJogo({ randomNumber, difficulty}: JogoStopProps) {
  
  function getValidNumber(
    randomNumber: number,
    conta: string,
    options: number[]
  ): number {
    let validOptions = options;

    if (conta === "÷") {
      validOptions = options.filter((n) => n !== 0 && randomNumber % n === 0);
    } else if (conta === "-") {
      validOptions = options.filter((n) => randomNumber - n >= 0);
    }

    if (validOptions.length === 0) return 1; // fallback
    const index = Math.floor(Math.random() * validOptions.length);
    return validOptions[index];
  }
  const { possibleNumbersByBox, contasPorBox } = difficulties[difficulty as "d1" | "d2" | "d3"];
  const [acertos, setAcertos] = useState(0);
  const [caixasData, setCaixasData] = useState<
    { numero: number; conta: string; checar: boolean }[]
  >([]);

  const [count, setCount] = useState(0);
  const [showGame] = useState(true);
  const [pararJogo, setPararJogo] = useState(false);

  useEffect(() => {
    const newCaixasData = possibleNumbersByBox.map((arr, index) => {
      const conta = contasPorBox[index];
      const numero = getValidNumber(randomNumber, conta, arr);
      return {
        numero,
        conta,
        checar: false,
      };
    });
    setCaixasData(newCaixasData);
  }, [randomNumber]);

  useEffect(() => {
    if (!showGame || pararJogo) return;

    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [showGame, pararJogo]);

  return (
    <div className="jogoStop">
      {!pararJogo && <h2>{count}</h2>}

      <div className="numMagico">
        <span className="randomNumber">{randomNumber}</span>
        {!pararJogo ? (
          <button className="pararJogo" onClick={() => setPararJogo(true)}>
            STOP
          </button>
        ) : (
          <div className="finalResultado">
            ⏱ Tempo final: {count} segundos
            <br />✅ Acertos: {acertos}
          </div>
        )}
      </div>

      <div className="tabelaWrap">
        <div className="tabela">
          {caixasData.map((data, i) => (
            <CaixaStop
              key={`caixa-${i}`}
              numero_base={randomNumber}
              numero={data.numero}
              conta={data.conta}
              checar={pararJogo}
              registrarAcerto={() => setAcertos((prev) => prev + 1)}
            />
          ))}
        </div>
      </div>

      
    </div>
  );
}

export default StopJogo;
