import { useState, useEffect } from 'react';
import StopJogo from '../Components/StopJogo';

function StopPage() {
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [showGame, setShowGame] = useState(false);
  const [showNumber, setShowNumber] = useState(true);

  useEffect(() => {
    const num = Math.floor(Math.random() * 6) + 4; 
    setRandomNumber(num);

    // After 2 seconds, hide number and show game
    const timer = setTimeout(() => {
      setShowNumber(false);
      setShowGame(true);
    }, 2000);

    // Cleanup timeout if component unmounts early
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {randomNumber !== null && showNumber && (
        <>
          <h2>Número sorteado:</h2>
          <p style={{ fontSize: '3rem', fontWeight: 'bold' }}>{randomNumber}</p>
        </>
      )}

      {showGame && <StopJogo /*randomNumber={randomNumber!}*/ />}
    </div>
  );
}

export default StopPage;