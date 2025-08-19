import { useRef, useState, useEffect } from "react";

interface properties {
  mudarJogar: () => void;
  clicar: boolean;
}
const NumGenerator = () => {
  return Math.floor(Math.random() * 200);
};

function Girar({ mudarJogar, clicar }: properties) {
  const [displayedNumber, setDisplayedNumber] = useState(0);
  const interval = useRef<number | null>(null);
  const stop = useRef<number | null>(null);

  useEffect(() => {
    if (clicar == false) {
      interval.current = setInterval(() => {
        const num = NumGenerator();
        setDisplayedNumber(num);
      }, 50);

      // Stop animation and fix number
      stop.current = setTimeout(() => {
        if (interval.current) clearInterval(interval.current);
        const finalNum = NumGenerator();
        setDisplayedNumber(finalNum);
        mudarJogar();
      }, 2000);
      return () => {
        if (interval.current) clearInterval(interval.current);
        if (stop.current) clearTimeout(stop.current);
      };
    }
  }, [clicar]);
  return displayedNumber;
}

export default Girar;
