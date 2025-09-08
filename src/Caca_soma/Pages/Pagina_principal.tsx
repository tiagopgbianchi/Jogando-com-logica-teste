import Tabuleiro from "../componentes/tabuleiro";
import Girar from "../componentes/sorteio";
import Iniciar from "../componentes/iniciar";
import Timer from "../componentes/timer";
import { useEffect, useState } from "react";
import styles from "../styles/design.module.css";

function Caca_soma() {
  const [jogar, setJogar] = useState(false);
  const [clicar, setClicar] = useState(true);
  const [qualRodada, setQualRodada] = useState(0);
  const [sorteado, setSorteado] = useState(0);
  const [soma, setSoma] = useState(0);

  const mudarRodada = () => setQualRodada(qualRodada + 1);
  const mudarClicar = () => setClicar(!clicar);
  const mudarJogar = () => setJogar(!jogar);
  const mudarSorteado = (x: number) => setSorteado(x);
  const mudarSoma = (y: boolean, x: number) => setSoma(soma + x);

  const [pontu_1, setPontu_1] = useState(0);
  const [pontu_2, setPontu_2] = useState(0);
  const addPontu = (qual: boolean) => {
    if (qual) setPontu_1(pontu_1 + 1);
    else setPontu_2(pontu_2 + 1);
  };

  const [tempo_1, setTempo_1] = useState(0.0);
  const [tempo_2, setTempo_2] = useState(0.0);
  const addTempo = (aumento: number) => {
    if (qualRodada % 2 !== 0) {
      if (soma === sorteado) setTempo_1(aumento);
      else setTempo_1(10000);
    } else {
      if (soma === sorteado) setTempo_2(aumento);
      else setTempo_2(10000);
    }
    setSoma(0);
  };

  useEffect(() => {
    if (qualRodada !== 0 && qualRodada % 2 === 0) {
      if (tempo_1 > 0 && tempo_2 > 0) {
        const delay = setTimeout(() => {
          if (tempo_1 !== tempo_2) {
            if (tempo_1 < tempo_2) addPontu(true);
            else addPontu(false);
          }
          setTempo_1(0);
          setTempo_2(0);
        }, 1000);

        return () => clearTimeout(delay);
      }
    }
  }, [tempo_1, tempo_2, qualRodada]);

  const reiniciar = () => {
    setPontu_1(0);
    setPontu_2(0);
    setQualRodada(0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.placarContainer}>
        <div className={styles.numPontu1}>{pontu_1}</div>
        <div className={styles.numPontu2}>{pontu_2}</div>
        <div className={styles.numTempo}>
          {tempo_1 === 10000 ? "X" : tempo_1}
        </div>
        <div className={styles.numTempo}>
          {tempo_2 === 10000 ? "X" : tempo_2}
        </div>
      </div>

      {qualRodada === 10 && (
        <button className={styles.button} onClick={reiniciar}>
          REINICIAR
        </button>
      )}

      <Tabuleiro
        addTempo={addTempo}
        mudarClicar={mudarClicar}
        jogar={jogar}
        mudarJogar={mudarJogar}
        mudarRodada={mudarRodada}
        mudarSoma={mudarSoma}
        soma={soma}
        qualRodada={qualRodada}
        //styles={styles} // se quiser passar styles para Tabuleiro
      />

      <div className={styles.sorteContainer}>
        <div className={styles.textoSorte}>Número sorteado</div>
        <div className={styles.numSorte}>
          <Girar
            mudarSorteado={mudarSorteado}
            clicar={clicar}
            mudarJogar={mudarJogar}
          />
        </div>
        <div className={styles.botaoIni}>
          <Iniciar
            mudarClicar={mudarClicar}
            clicar={clicar}
            mudarRodada={mudarRodada}
          />
        </div>
        <div>
          <Timer jogar={jogar} addTempo={addTempo} />
        </div>
      </div>
    </div>
  );
}

export default Caca_soma;
