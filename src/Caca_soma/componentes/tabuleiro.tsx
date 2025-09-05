import { useState } from "react";
import "../styles/design.css"

interface prop {
  mudarClicar: () => void;
  mudarJogar: () => void;
  jogar: boolean;
}

function Tabuleiro({ jogar, mudarClicar, mudarJogar }: prop) {
  const [somaClick, setSomaClick] = useState(0);
  // 10x10 matrix filled with false
  const [board, setBoard] = useState(
    Array.from({ length: 10 }, () => Array(10).fill(false))
  );

  const toggleCell = (row: number, col: number, valor: number) => {
    if (board[row][col] == false && jogar) {
      if (somaClick > 0) {
        setSomaClick(0);
        mudarClicar();
        mudarJogar();
      } else {
        setSomaClick(valor);
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

  return (
    <div className="board">
      {board.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <div
            key={`${rIdx}-${cIdx}`}
            className="celula"
            style={{ backgroundColor: cell ? "skyblue" : "white" }}
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
