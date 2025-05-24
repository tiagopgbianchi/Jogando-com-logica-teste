import { useState, useEffect } from "react";
import "./Stop.css";
import StopJogo from "./JogoStop";
const NumGenerator = () => {
  const num = Math.floor(Math.random() * 6) + 4;
  return num;
};
function StopPage() {
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [displayedNumber, setDisplayedNumber] = useState<number>(4); // initial display
  const [showGame, setShowGame] = useState(false);
  const [showNumber, setShowNumber] = useState(true);

  useEffect(() => {
    let animationInterval: ReturnType<typeof setInterval>;
    let stopTimeout: ReturnType<typeof setTimeout>;
    let gameTimeout: ReturnType<typeof setTimeout>;

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
      setRandomNumber(finalNum);
    }, 2000);

    gameTimeout = setTimeout(() => {
      setShowNumber(false);
      setShowGame(true);
    }, 3500);

    return () => {
      clearInterval(animationInterval);
      clearTimeout(stopTimeout);
      clearTimeout(gameTimeout);
    };
  }, []);

  return (
    <div>
      {showNumber && (
        <div>
          <h2 className="sort">O número mágico é</h2>
          <p className="numero">{displayedNumber}</p>
        </div>
      )}

      {showGame && <StopJogo randomNumber={randomNumber!} />}
    </div>
  );
}

export default StopPage;
