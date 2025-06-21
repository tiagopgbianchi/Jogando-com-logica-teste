import { useState } from "react";
import "./SPTTT.css";
import { XComponent } from "./Xcomponent";
import { OComponent } from "./Ocomponent";
const [activeBoard, setActiveBoard] = useState<number | null>(null);



//BOARD
type Player = "X" | "O" | null;
type MiniBoard = Player[];
type UltimateBoard = MiniBoard[];

function SPTTT() {
  const [boards, setBoards] = useState<UltimateBoard>(
    Array.from({ length: 9 }, () => Array(9).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");

  const handleClick = (boardIndex: number, cellIndex: number) => {
  if (boards[boardIndex][cellIndex] !== null) return;
  if (activeBoard !== null && activeBoard !== boardIndex) return;

  const newBoards: UltimateBoard = boards.map((board, bIdx) =>
    bIdx === boardIndex
      ? board.map((cell, cIdx) =>
          cIdx === cellIndex ? currentPlayer : cell
        )
      : board
  );

  setBoards(newBoards);
  setCurrentPlayer(currentPlayer === "X" ? "O" : "X");

  // Movement mechanic: next active board = cellIndex just played
  const nextBoard = cellIndex;
  const targetBoardHasMoves = newBoards[nextBoard].some(cell => cell === null);

  setActiveBoard(targetBoardHasMoves ? nextBoard : null);
};

  return (
    <div className="jogo-SPTTT">
      <h1>Ultimate Tic-Tac-Toe Board</h1>
      <div className="board-wrap">
        <div className="big-board">
          {boards.map((board, boardIndex) => (
            <div key={boardIndex} className="small-board">
              {board.map((cell, cellIndex) => (
                <button
                  key={cellIndex}
                  className="casa"
                  onClick={() => handleClick(boardIndex, cellIndex)}
                >
                  {cell === "X" && <XComponent />}
                  {cell === "O" && <OComponent />}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SPTTT;
