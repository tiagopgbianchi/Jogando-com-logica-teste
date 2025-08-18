import { useState } from "react";
import "../design.css";

interface prop {
  addPontu: () => void;
  mudarClicar: () => void;
  clicar: boolean;
}

function Tabuleiro({ clicar, mudarClicar, addPontu }: prop) {
  const [somaClick, setSomaClick] = useState(0);
  // 10x10 matrix filled with false
  const [board, setBoard] = useState(
    Array.from({ length: 10 }, () => Array(10).fill(false))
  );

  const toggleCell = (row: number, col: number, valor: number) => {
    if (board[row][col] == false && clicar) {
      if (somaClick > 0) {
        setSomaClick(0);
        addPontu();
        mudarClicar();
      } else {
        setSomaClick(valor);
      }
    }

    setBoard((prev) =>
      prev.map((r, rIdx) =>
        r.map((cell, cIdx) =>
          rIdx === row && cIdx === col && clicar ? true : cell
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
