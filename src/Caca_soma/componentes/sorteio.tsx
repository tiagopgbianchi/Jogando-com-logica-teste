import { useRef, useState, useEffect } from "react";

interface Properties {
  mudarJogar: () => void;
  clicar: boolean;
  mudarSorteado: (x: number) => void;
  rodada: number;
}

function Girar({ mudarJogar, clicar, mudarSorteado, rodada }: Properties) {
  const [displayedNumber, setDisplayedNumber] = useState(0);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const stop = useRef<ReturnType<typeof setTimeout> | null>(null);

  const NumGenerator = () => {
    return Math.floor(
      Math.random() * (150 - rodada * 3 + 3) + (rodada * 3 + 3)
    );
  };

  useEffect(() => {
    if (clicar === false) {
      interval.current = setInterval(() => {
        const num = NumGenerator();
        setDisplayedNumber(num);
      }, 50);

      // Stop animation and fix number
      stop.current = setTimeout(() => {
        if (interval.current) clearInterval(interval.current);
        const finalNum = NumGenerator();
        setDisplayedNumber(finalNum);
        mudarSorteado(finalNum);
        mudarJogar();
      }, 2000);

      return () => {
        if (interval.current) clearInterval(interval.current);
        if (stop.current) clearTimeout(stop.current);
      };
    }
  }, [clicar]);

  return <div>{displayedNumber}</div>;
}

export default Girar;
