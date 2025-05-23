import { useState, useEffect } from "react";
import "./Stop.css";
import "./JogoStop.css";
import CaixaStop from "./CaixaStop";
const contas: string[] = ["*", "/", "+", "-"];
const numeros: number[] = [9, 2, 4, 5, 2, 5];
const NumGenerator = () => {
  const num = Math.floor(Math.random() * 6) + 4;
  return num;
};
function StopJogo() {
  const [count, setCount] = useState(60);
  const [displayedNumber, setDisplayedNumber] = useState<number>(4); // initial display
  const [showGame, setShowGame] = useState(false);
  const [pararJogo, setPararJogo] = useState(false);
  let animationInterval: ReturnType<typeof setInterval>;
  let stopTimeout: ReturnType<typeof setTimeout>;

  //sorter número
  useEffect(() => {
    animationInterval = setInterval(() => {
      const num = NumGenerator();
      if (num !== null) {
        setDisplayedNumber(num);
      }
    }, 50);

    stopTimeout = setTimeout(() => {
      clearInterval(animationInterval);
      const finalNum = Math.floor(Math.random() * 6) + 4;
      setDisplayedNumber(finalNum);
      setShowGame(true);
    }, 2000);
    return () => {
      clearInterval(animationInterval);
      clearTimeout(stopTimeout);
    };
  }, []);

  //timer que vai baixando
  useEffect(() => {
    if (!showGame) return;
    if (pararJogo) return;
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000); // 1000ms = 1 second
    if (count <= 0) {
      setPararJogo(true);
    }

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [showGame, pararJogo, count]);

  return (
    <div className="regras">
      <h2> {count} </h2>
      <div className="tabela">
        {/* Primeira linha */}
        <div>&nbsp;</div>
        {numeros.map((num, i) => (
          <div key={`cab-${i}`} className="cell header">
            {"+" + String(num)}
          </div>
        ))}

        {/* Segunda linha */}
        <div className="cell row-header">{displayedNumber}</div>
        {numeros.map((_, i) => (
          <CaixaStop
            numero_base={displayedNumber}
            checar={pararJogo}
            numero={numeros[i]}
            conta={"+"}
          ></CaixaStop>
        ))}
      </div>
      <button onClick={() => setPararJogo(true)}> STOP </button>
      {pararJogo && <h1> asdads</h1>}
    </div>
  );
}

export default StopJogo;
