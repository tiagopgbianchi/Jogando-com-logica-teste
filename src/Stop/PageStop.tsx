import { useState, useEffect, useRef } from "react";
import "./Stop.css";
import StopJogo from "./JogoStop";

const NumGenerator = () => {
  return Math.floor(Math.random() * 6) + 4;
};

function StopPage() {
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [displayedNumber, setDisplayedNumber] = useState<number>(4);
  const [showGame, setShowGame] = useState(false);
  const [showNumber, setShowNumber] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0); // Triggers re-run

  // Use browser-safe types
  const animationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = () => {
    // Reset states
    setShowGame(false);
    setShowNumber(true);
    setDisplayedNumber(4);
    setRandomNumber(null);

    // Start rolling animation
    animationIntervalRef.current = setInterval(() => {
      const num = NumGenerator();
      setDisplayedNumber(num);
    }, 50);

    // Stop animation and fix number
    stopTimeoutRef.current = setTimeout(() => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
      const finalNum = NumGenerator();
      setDisplayedNumber(finalNum);
      setRandomNumber(finalNum);
    }, 2000);

    // Show game after delay
    gameTimeoutRef.current = setTimeout(() => {
      setShowNumber(false);
      setShowGame(true);
    }, 3500);
  };

  useEffect(() => {
    startGame();

    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
      if (gameTimeoutRef.current) clearTimeout(gameTimeoutRef.current);
    };
  }, [resetTrigger]); // re-run when resetTrigger changes

  const handleReset = () => {
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <div>
      {showNumber && (
        <div>
          <h2 className="sort">O número mágico é</h2>
          <p className="numero">{displayedNumber}</p>
        </div>
      )}

      {showGame && randomNumber !== null && <StopJogo randomNumber={randomNumber} />}

      <button onClick={handleReset} className="reset-button">
        Reiniciar Jogo
      </button>
    </div>
  );
}

export default StopPage;