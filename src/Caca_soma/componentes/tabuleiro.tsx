import { useState } from "react";
import "../design.css";

function Tabuleiro() {
  // 10x10 matrix filled with false
  const [board, setBoard] = useState(
    Array.from({ length: 10 }, () => Array(10).fill(false))
  );

  const toggleCell = (row: number, col: number) => {
    setBoard((prev) =>
      prev.map((r, rIdx) =>
        r.map((cell, cIdx) => (rIdx === row && cIdx === col ? !cell : cell))
      )
    );
  };

  return (
    <div className="board">
      {board.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <div
            key={`${rIdx}-${cIdx}`}
            className="cell"
            style={{ backgroundColor: cell ? "skyblue" : "white" }}
            onClick={() => toggleCell(rIdx, cIdx)}
          >
            {rIdx * 10 + cIdx + 1}
          </div>
        ))
      )}
    </div>
  );
}

export default Tabuleiro;
