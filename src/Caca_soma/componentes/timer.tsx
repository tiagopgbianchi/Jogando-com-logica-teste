import { useState, useEffect, useRef } from "react";

interface prop {
  jogar: boolean;
  addTempo: (x: number, currentSoma?: number) => void;
  soma: number;
  onTimeUpdate?: (tempo: number) => void; // Add callback for time updates
}
function Timer({ jogar, addTempo, soma, onTimeUpdate }: prop) {
  const [tempo, setTempo] = useState(0); // tempo final armazenado
  const [tempoAtual, setTempoAtual] = useState<number>(0); // tempo em tempo real
  const intervalRef = useRef<number | null>(null);
  const inicioRef = useRef<number | null>(null); // ref para guardar o início

  // Iniciar o timer
  const iniciar = () => {
    inicioRef.current = Date.now(); // guarda o início
    setTempo(0);
    setTempoAtual(0);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      if (inicioRef.current) {
        const currentTime = Date.now() - inicioRef.current;
        setTempoAtual(currentTime);
        if (onTimeUpdate) {
          onTimeUpdate(currentTime / 1000); // Pass time in seconds
        }
      }
    }, 100);
  };

  // Parar o timer
  const parar = () => {
    if (inicioRef.current) {
      const tempoPassado = Date.now() - inicioRef.current;
      setTempo(tempoPassado);
      addTempo(tempoPassado / 1000, soma); // Pass soma value when calling addTempo
      inicioRef.current = null;

      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  // Limpar o intervalo quando desmontar o componente
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (jogar) {
      iniciar();
    } else {
      parar();
    }
  }, [jogar]);

  return (
    <div style={{ display: 'none' }}>
      {/* Hidden timer display - time now shown in score box */}
    </div>
  );
}

export default Timer;
