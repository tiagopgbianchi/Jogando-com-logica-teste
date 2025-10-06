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
  const [quantos, setQuantos] = useState(0);

  const mudarRodada = () => setQualRodada(qualRodada + 1);
  const mudarClicar = () => setClicar(!clicar);
  const mudarJogar = () => setJogar(!jogar);
  const mudarSorteado = (x: number) => setSorteado(x);
  const mudarSoma = (x: number) => setSoma(soma + x);

  const [pontu_1, setPontu_1] = useState(0);
  const [pontu_2, setPontu_2] = useState(0);
  const addPontu = (qual: boolean) => {
    if (qual) setPontu_1(pontu_1 + 1);
    else setPontu_2(pontu_2 + 1);
  };

  const [tempo_1, setTempo_1] = useState(0.0);
  const [tempo_2, setTempo_2] = useState(0.0);
  const [liveTime, setLiveTime] = useState(0.0);

  const handleTimeUpdate = (tempo: number) => {
    setLiveTime(tempo);
  };

  const addTempo = (aumento: number, currentSoma?: number) => {
    const somaToCheck = currentSoma !== undefined ? currentSoma : soma;
    if (qualRodada % 2 !== 0) {
      if (somaToCheck === sorteado) setTempo_1(aumento);
      else setTempo_1(10000);
    } else {
      if (somaToCheck === sorteado) setTempo_2(aumento);
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
        }, 2000);

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
      <div className={styles.leftPanel}>
        <div className={styles.gameControlsPanel}>
          <div className={styles.sorteContainer}>
            <div className={styles.textoSorte}>Número sorteado</div>
            <div className={styles.numSorte}>
              <Girar
                rodada={qualRodada}
                mudarSorteado={mudarSorteado}
                clicar={clicar}
                mudarJogar={mudarJogar}
              />
            </div>
          </div>

          <div className={styles.botaoIni}>
            <Iniciar
              mudarClicar={mudarClicar}
              clicar={clicar}
              mudarRodada={mudarRodada}
            />
          </div>
        </div>

        <div className={styles.scorePanel}>
          <div className={styles.scoreHeader}>PLACAR</div>

          <div className={styles.playersRow}>
            <div className={styles.playerSection}>
              <div className={styles.playerLabel}>Jogador 1</div>
              <div className={styles.playerInfoRow}>
                <div className={styles.playerInfo}>
                  <span className={styles.infoLabel}>Pontos:</span>
                  <span className={styles.numPontu2}>{pontu_1}</span>
                </div>
                <div className={styles.playerInfo}>
                  <span className={styles.infoLabel}>Tempo:</span>
                  <span className={styles.numTempo}>
                    {qualRodada % 2 === 0 && jogar
                      ? `${liveTime.toFixed(1)}s`
                      : tempo_1 === 10000
                      ? "X"
                      : tempo_1 > 0
                      ? `${tempo_1}s`
                      : "0.0s"}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.playerSection}>
              <div className={styles.playerLabel}>Jogador 2</div>
              <div className={styles.playerInfoRow}>
                <div className={styles.playerInfo}>
                  <span className={styles.infoLabel}>Pontos:</span>
                  <span className={styles.numPontu1}>{pontu_2}</span>
                </div>
                <div className={styles.playerInfo}>
                  <span className={styles.infoLabel}>Tempo:</span>
                  <span className={styles.numTempo}>
                    {qualRodada % 2 !== 0 && jogar
                      ? `${liveTime.toFixed(1)}s`
                      : tempo_2 === 10000
                      ? "X"
                      : tempo_2 > 0
                      ? `${tempo_2}s`
                      : "0.0s"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {qualRodada === 10 && (
            <button className={styles.button} onClick={reiniciar}>
              REINICIAR
            </button>
          )}
        </div>
      </div>

      <div className={styles.gameBoard}>
        <Tabuleiro
          addTempo={addTempo}
          mudarClicar={mudarClicar}
          jogar={jogar}
          mudarJogar={mudarJogar}
          mudarRodada={mudarRodada}
          mudarSoma={mudarSoma}
          soma={soma}
          qualRodada={qualRodada}
          setQuantos={setQuantos}
          quantos={quantos}
          sorteado={sorteado}
          onTimeUpdate={handleTimeUpdate}
          //styles={styles} // se quiser passar styles para Tabuleiro
        />
      </div>
    </div>
  );
}

export default Caca_soma;
