import { useState } from "react";
import styles from "./RegrasSPTTT.module.css";
import { useNavigate } from "react-router-dom";

type WinCondition = "line" | "majority";

function JogoStop() {
  const navigate = useNavigate();
  const [winCondition, setWinCondition] = useState<WinCondition>("line");
  const [showDetailedRules, setShowDetailedRules] = useState(false);

  function jogarStop() {
    navigate("/jogospttt", { state: { winCondition } });
  }

  return (
    <div className={styles.regrasPage}>
      {/* Left Side - Rules */}
      <div className={styles.boxBorder}>
        <div className={styles.boxRegras}>
          <ul className={styles.regras}>
            <li>
              <h3>O jogo tem 9 jogos da velha pequenos</h3>
              <img
                src={`${import.meta.env.BASE_URL}ComoJogarStop1.png`}
                className={`${styles.como} ${styles.c1}`}
              />
            </li>
            <li>
              <img
                src={`${import.meta.env.BASE_URL}ComoJogarStop2.png`}
                className={`${styles.como} ${styles.c2}`}
              />
              <h3>Sua jogada decide onde a próxima jogada vai ser</h3>
            </li>
            <li>
              <h3>Ganhe os jogos da velha pequenos para ganhar</h3>
              <div className={styles.c3Box}>
                <img
                  src={`${import.meta.env.BASE_URL}ComoJogarStop3.png`}
                  className={`${styles.como} ${styles.c3}`}
                />
              </div>
            </li>
            <li>
              <img
                src={`${import.meta.env.BASE_URL}ComoJogarStop4.png`}
                className={`${styles.como} ${styles.c4}`}
              />
              <h3>Escolha como ganhar - Clássico ou Pontos</h3>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Game Controls */}
      <div className={styles.botoes}>
        <button className={styles.button} onClick={jogarStop}>
          <span>Jogar</span>
        </button>

        {/* Win mode selector */}
        <div className={styles['mode-select-rules']}>
          <label>
            <input
              type="radio"
              name="winMode"
              value="line"
              checked={winCondition === "line"}
              onChange={() => setWinCondition("line")}
            />
            Clássico (3 em linha)
          </label>
          <label>
            <input
              type="radio"
              name="winMode"
              value="majority"
              checked={winCondition === "majority"}
              onChange={() => setWinCondition("majority")}
            />
            Maioria dos Tabuleiros
          </label>
        </div>                      
      </div>
      <button 
  className={styles.detailedRulesButton}
  onClick={() => setShowDetailedRules(true)}
>
  Regras Completas
</button>
{showDetailedRules && (
  <div className={styles.modalOverlay} onClick={() => setShowDetailedRules(false)}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button 
        className={styles.closeButton}
        onClick={() => setShowDetailedRules(false)}
      >
        X
      </button>
      
      <div className={styles.detailedRules}>
        <h2>Regras Completas do Super Jogo da Velha</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed similique facere quos blanditiis ut ex, laborum natus, quis nostrum recusandae molestias aliquid perspiciatis. Fugiat animi aliquam consectetur nulla in laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed similique facere quos blanditiis ut ex, laborum natus, quis nostrum recusandae molestias aliquid perspiciatis. Fugiat animi aliquam consectetur nulla in laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed similique facere quos blanditiis ut ex, laborum natus, quis nostrum recusandae molestias aliquid perspiciatis. Fugiat animi aliquam consectetur nulla in laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed similique facere quos blanditiis ut ex, laborum natus, quis nostrum recusandae molestias aliquid perspiciatis. Fugiat animi aliquam consectetur nulla in laborum.</p>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default JogoStop;