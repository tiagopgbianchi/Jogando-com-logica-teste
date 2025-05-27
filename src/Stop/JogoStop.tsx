import { useState, useEffect } from "react";
import "./Stop.css";
import "./JogoStop.css";
import CaixaStop from "./CaixaStop";

type JogoStopProps = {
  randomNumber: number;
};

function StopJogo({ randomNumber }: JogoStopProps) {
  const possibleNumbersByBox = [
    [5, 6, 7, 8, 9, 10],
    [4, 5, 6, 7, 8, 9],
    [10, 100],
    [2],
    [1, 2, 3, 4],
    [2, 3, 5],
    [20, 30, 40],
    [0, 1, 10],
    [0, 1, 2, 3],
    [15, 16, 17, 18, 19, 20, 21, 22, 23],
  ];

  const contasPorBox = ["+", "-", "+", "x", "+", "÷", "+", "x", "-", "+"];

  function getValidNumber(randomNumber: number, conta: string, options: number[]): number {
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

  const [caixasData, setCaixasData] = useState<
    { numero: number; conta: string; checar: boolean }[]
  >([]);

  const [count, setCount] = useState(0);
  const [showGame, setShowGame] = useState(true);
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
    <div className="regras">
      <h2>{count}</h2>
      <div className="tabela">
        <div className="cell row-header">{randomNumber}</div>
        {caixasData.map((data, i) => (
          <CaixaStop
            key={`caixa-${i}`}
            numero_base={randomNumber}
            numero={data.numero}
            conta={data.conta}
            checar={pararJogo}
          />
        ))}
      </div>
      <button onClick={() => setPararJogo(true)}>STOP</button>
      {pararJogo && <h1>Tempo Final: {count} segundos</h1>}
    </div>
  );
}

export default StopJogo;