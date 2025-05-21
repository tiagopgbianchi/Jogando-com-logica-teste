import { useState, useEffect } from 'react';

function NumGenerator() {
  const [randomNumber, setRandomNumber] = useState<number | null>(null);

  useEffect(() => {
    const num = Math.floor(Math.random() * 6) + 4; 
    setRandomNumber(num);
  }, []);

  return (
    <div>
    <h2>Número sorteado:</h2>
      {randomNumber !== null ? (
        <p style={{ fontSize: '3rem', fontWeight: 'bold' }}>{randomNumber}</p>
      ) : (
        <p>Gerando número...</p>
      )}
    </div>
  );
}

export default NumGenerator;