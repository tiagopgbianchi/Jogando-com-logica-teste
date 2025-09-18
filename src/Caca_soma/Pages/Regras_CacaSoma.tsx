import { useState } from "react";
import styles from "../styles/regras.module.css";
import { useNavigate } from "react-router-dom";

type MandatoryCapture = true | false;

function CacaSomaRegras() {
  const navigate = useNavigate();
  
  const [showDetailedRules, setShowDetailedRules] = useState(false);
  function jogarStop() {
    navigate("/cacaSoma" );
  }
  
  return (
    <div className={styles.regrasPage}>
      {/* Left Side - Rules */}
      <div className={styles.boxBorder}>
        <div className={styles.boxRegras}>
          
          <ul className={styles.regras}>
            <li>
              <h3>Um número vai ser sorteado</h3>
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
              <h3>Regra 2: Ganhe os tabuleiros pequenos</h3>
            </li>
            <li>
              <h3>Regra 3: A jogada decide o próximo tabuleiro</h3>
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
              <h3>Regra 4: Ganhe o jogo final</h3>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Game Controls */}
      <div className={styles.botoes}>
        <button className={styles.button} onClick={jogarStop}>
          <span>Jogar</span>
        </button>
        

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

export default CacaSomaRegras;
