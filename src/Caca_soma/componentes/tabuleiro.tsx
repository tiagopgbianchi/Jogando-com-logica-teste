import { useState, useEffect } from "react";
import styles from "../styles/design.module.css"; // CSS Modules

interface Prop {
  mudarClicar: () => void;
  mudarJogar: () => void;
  mudarRodada: () => void;
  mudarSoma: (y: boolean, x: number) => void;
  addTempo: (x: number) => void;
  soma: number;
  jogar: boolean;
  qualRodada: number;
}

function Tabuleiro({
  jogar,
  mudarClicar,
  mudarJogar,
  mudarRodada,
  mudarSoma,
  soma,
  addTempo,
  qualRodada,
}: Prop) {
  // 10x10 matrix filled with false
  const [board, setBoard] = useState(
    Array.from({ length: 10 }, () => Array(10).fill(false))
  );

  useEffect(() => {
    if (qualRodada === 0) {
      setBoard(Array.from({ length: 10 }, () => Array(10).fill(false)));
    }
  }, [qualRodada]);

  const toggleCell = (row: number, col: number, valor: number) => {
    if (board[row][col] === false && jogar) {
      if (soma > 0) {
        mudarSoma(true, valor);
        mudarClicar();
        mudarJogar();
        mudarRodada();
      } else {
        mudarSoma(false, valor);
      }
    }

    setBoard((prev) =>
      prev.map((r, rIdx) =>
        r.map((cell, cIdx) =>
          rIdx === row && cIdx === col && jogar ? true : cell
        )
      )
    );
  };

  // Paleta de cores para as células clicadas

  return (
    <div className={styles.board}>
      {board.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <div
            key={`${rIdx}-${cIdx}`}
            className={styles.celula}
            style={{
              background:
                cell === false
                  ? "radial-gradient(circle, #404341, #774caf)"
                  : "radial-gradient(circle, #404341, #2e7d32)", // cores variáveis
            }}
            onClick={() => toggleCell(rIdx, cIdx, rIdx * 10 + cIdx + 1)}
          >
            {rIdx * 10 + cIdx + 1}
          </div>
        ))
      )}
    </div>
  );
}

export default Tabuleiro;
