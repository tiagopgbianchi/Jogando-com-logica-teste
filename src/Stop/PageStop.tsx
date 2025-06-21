import { useState, useEffect, useRef } from "react";
import "./Stop.css";
import StopJogo from "./JogoStop";
import { useLocation } from "react-router-dom";
import { difficulties,DifficultyKey } from "./Difficulties";

function StopPage() {
  const NumGenerator = () => {
    const possible =
      difficulties[difficulty as DifficultyKey].possibleRandomNumbers;
    const index = Math.floor(Math.random() * possible.length);
    return possible[index];
  };
  const location = useLocation();
  const difficulty = (location.state?.difficulty || "d2") as DifficultyKey;
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [displayedNumber, setDisplayedNumber] = useState<number>(4);
  const [showGame, setShowGame] = useState(false);
  const [showNumber, setShowNumber] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0); // Triggers re-run

  // Use browser-safe types
  const animationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
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
      if (animationIntervalRef.current)
        clearInterval(animationIntervalRef.current);
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
      if (animationIntervalRef.current)
        clearInterval(animationIntervalRef.current);
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
        <div className="sortPage">
          <div className="bordaSort">
            <div className="divSort">
              <div className="sort">O número mágico é</div>
              <div className="numeroBox">
                <span className="numero">{displayedNumber}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showGame && randomNumber !== null && (
        <>
          <StopJogo randomNumber={randomNumber} difficulty={difficulty} />
          <button onClick={handleReset} className="reset-button">
            Reiniciar
          </button>
        </>
      )}
    </div>
  );
}

export default StopPage;
