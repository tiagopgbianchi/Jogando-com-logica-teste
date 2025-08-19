import { useState, useEffect, useRef } from "react";

function Timer() {
  const [inicio, setInicio] = useState<number | null>(null);
  const [tempo, setTempo] = useState<number | null>(null); // tempo final armazenado
  const [tempoAtual, setTempoAtual] = useState<number>(0); // tempo em tempo real
  const intervalRef = useRef<number | null>(null);

  // Iniciar o timer
  const iniciar = () => {
    setInicio(Date.now());
    setTempo(null);
    setTempoAtual(0);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setTempoAtual(Date.now() - (inicio ?? Date.now()));
    }, 100);
  };

  // Parar o timer
  const parar = () => {
    if (inicio) {
      const tempoPassado = Date.now() - inicio;
      setTempo(tempoPassado);
      setInicio(null);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  // Limpar o intervalo quando desmontar o componente
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div>
      <button onClick={iniciar}>Iniciar</button>
      <button onClick={parar}>Parar</button>

      {inicio && <p>Tempo atual: {(tempoAtual / 1000).toFixed(2)} segundos</p>}

      {tempo !== null && (
        <p>Tempo final armazenado: {(tempo / 1000).toFixed(2)} segundos</p>
      )}
    </div>
  );
}

export default Timer;
