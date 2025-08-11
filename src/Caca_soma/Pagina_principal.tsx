import Tabuleiro from "./componentes/tabuleiro";
import { useRef, useState, useEffect } from "react";
import "./design.css";

const NumGenerator = () => {
  return Math.floor(Math.random() * 200);
};

function Girar() {
  const [displayedNumber, setDisplayedNumber] = useState(0);
  const interval = useRef<number | null>(null);
  const stop = useRef<number | null>(null);
  useEffect(() => {
    interval.current = setInterval(() => {
      const num = NumGenerator();
      setDisplayedNumber(num);
    }, 50);

    // Stop animation and fix number
    stop.current = setTimeout(() => {
      if (interval.current) clearInterval(interval.current);
      const finalNum = NumGenerator();
      setDisplayedNumber(finalNum);
    }, 2000);
    return () => {
      if (interval.current) clearInterval(interval.current);
      if (stop.current) clearTimeout(stop.current);
    };
  }, []);
  return displayedNumber;
}

function Caca_soma() {
  const [pontu, setPontu] = useState(10);
  return (
    <div className="container">
      <div>
        <div className="num-pontu">{pontu}</div>
      </div>
      <Tabuleiro />
      <div>
        <div className="texto-sorte">Número sorteado</div>
        <div className="num-sorte">{<Girar />}</div>
      </div>
    </div>
  );
}

export default Caca_soma;
