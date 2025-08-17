import { useState } from "react";
import styles from "./SPTTT.module.css";
import { Piece } from "./Piece";
import { WinnerOverlay } from "./WinnerBox"; // make sure this file exists
import { useLocation } from "react-router-dom";

// BOARD TYPES
type Player = "X" | "O" | null;
type MiniBoard = Player[];
type UltimateBoard = MiniBoard[];


export default function SPTTT() {
  const [boards, setBoards] = useState<UltimateBoard>(
    Array.from({ length: 9 }, () => Array(9).fill(null))
  );
  const [winners, setWinners] = useState<Array<Player>>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [activeBoard, setActiveBoard] = useState<number | null>(null);
  const location = useLocation();
  const { winCondition } = location.state as { winCondition: "line" | "majority" }; // Type assertion to ensure correct type
  const [finalWinner, setFinalWinner] = useState<"X" | "O" | "tie" | null>(null);

  function checkWinner(board: MiniBoard): Player {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6],           // diagonals
    ];

    for (let [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  }

  function checkBigBoardWinner(winners: Array<Player>): Player | "tie" | null {
    if (winCondition === "line") {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
        [0, 4, 8], [2, 4, 6],           // diagonals
      ];

      for (let [a, b, c] of lines) {
        if (
          winners[a] &&
          winners[a] === winners[b] &&
          winners[a] === winners[c]
        ) {
          return winners[a];
        }
      }
    }

    // Majority win
    const count = { X: 0, O: 0 };
    for (const win of winners) {
      if (win === "X") count.X++;
      if (win === "O") count.O++;
    }

    if (count.X + count.O === 9) {
      if (count.X > count.O) return "X";
      if (count.O > count.X) return "O";
      return "tie";
    }

    return null;
  }

  const handleClick = (boardIndex: number, cellIndex: number) => {
    if (boards[boardIndex][cellIndex] !== null) return;
    if (activeBoard !== null && activeBoard !== boardIndex) return;
    if (winners[boardIndex]) return;

    const newBoards: UltimateBoard = boards.map((board, bIdx) =>
      bIdx === boardIndex
        ? board.map((cell, cIdx) =>
            cIdx === cellIndex ? currentPlayer : cell
          )
        : board
    );

    const boardWinner = checkWinner(newBoards[boardIndex]);
    const newWinners = [...winners];
    if (boardWinner) {
      newWinners[boardIndex] = boardWinner;
    }

    setBoards(newBoards);
    setWinners(newWinners);

    const nextBoard = cellIndex;
    const targetBoardHasMoves =
      newBoards[nextBoard].some((cell) => cell === null) &&
      !newWinners[nextBoard];

    setActiveBoard(targetBoardHasMoves ? nextBoard : null);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");

    const bigWinner = checkBigBoardWinner(newWinners);

    if (bigWinner) {
      setTimeout(() => {
        setFinalWinner(bigWinner);
      }, 1000); // delay for animations if needed
    }
  };

  const restartGame = () => {
    setBoards(Array.from({ length: 9 }, () => Array(9).fill(null)));
    setWinners(Array(9).fill(null));
    setCurrentPlayer("X");
    setActiveBoard(null);
    setFinalWinner(null);
  };

  return (
    <div className={styles['jogo-SPTTT']}>
      

      {/* Turn indicator */}
      <div className={styles['turn-indicator']}>
        <span>Turno do jogador:</span>
        <div className={styles['current-player-symbol']}>
          <Piece player={currentPlayer!} />
        </div>
      </div>

      

      <div className={styles['board-wrap']}>
        <div className={styles['big-board']}>
          {boards.map((board, boardIndex) => (
            <div
              key={boardIndex}
              className={`${styles['small-board']} ${
                activeBoard === null || activeBoard === boardIndex
                  ? styles.playable
                  : ""
              } ${winners[boardIndex] ? styles.won : ""}`}
            >
              {winners[boardIndex] && (
                <div className={styles['board-winner']}>
                  <Piece player={winners[boardIndex]!} />
                </div>
              )}
              {board.map((cell, cellIndex) => (
                <button
                  key={cellIndex}
                  className={styles.casa}
                  onClick={() => handleClick(boardIndex, cellIndex)}
                  disabled={!!winners[boardIndex]}
                >
                  {cell && <Piece player={cell} />}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Winner Overlay */}
      {finalWinner && (
        <WinnerOverlay winner={finalWinner} onRestart={restartGame} />
      )}
    </div>
  );
}