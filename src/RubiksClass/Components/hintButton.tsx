import React, { useState } from "react";
import styles from "./Hint.module.css";

interface HintProps {
  title: string;
  hint1: React.ReactNode;
  hint2?: React.ReactNode;
  hint3?: React.ReactNode;
  hint4?: React.ReactNode;
  hint5?: React.ReactNode;
  hint6?: React.ReactNode;
  hint7?: React.ReactNode;
  hint8?: React.ReactNode;
  hint9?: React.ReactNode;
  hint10?: React.ReactNode;
}

const Hint: React.FC<HintProps> = ({
  title,
  hint1,
  hint2,
  hint3,
  hint4,
  hint5,
  hint6,
  hint7,
  hint8,
  hint9,
  hint10,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentHint, setCurrentHint] = useState(1);

  // Collect all provided hints
  const hints = [
    hint1,
    hint2,
    hint3,
    hint4,
    hint5,
    hint6,
    hint7,
    hint8,
    hint9,
    hint10,
  ].filter((hint): hint is React.ReactNode => hint !== undefined);

  const totalHints = hints.length;

  const showNextHint = () => {
    if (currentHint < totalHints) {
      setCurrentHint(currentHint + 1);
    }
  };

  const showPreviousHint = () => {
    if (currentHint > 1) {
      setCurrentHint(currentHint - 1);
    }
  };

  const closeHints = () => {
    setIsOpen(false);
    setCurrentHint(1);
  };

  return (
    <div className={styles.hintContainer}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={styles.hintToggle}
      >
        💡 Dicas
      </button>

      {isOpen && (
        <div className={styles.hintModal}>
          <div className={styles.hintHeader}>
            <h3>{title}</h3>
            <button onClick={closeHints} className={styles.closeButton}>
              ×
            </button>
          </div>
          
          <div className={styles.hintContent}>
            {hints[currentHint - 1]}
          </div>
          
          <div className={styles.hintNavigation}>
            <button 
              onClick={showPreviousHint}
              disabled={currentHint === 1}
              className={styles.navButton}
            >
              Anterior
            </button>
            
            <span className={styles.hintCounter}>
              Dica {currentHint} de {totalHints}
            </span>
            
            <button 
              onClick={showNextHint}
              disabled={currentHint === totalHints}
              className={styles.navButton}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hint;