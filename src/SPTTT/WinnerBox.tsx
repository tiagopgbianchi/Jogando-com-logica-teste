import styles from "./Winner.module.css";
import { Piece } from "./Piece";

export function WinnerOverlay({ winner, onRestart }: { winner: "X" | "O" | "tie"; onRestart: () => void }) {
  return (
    <div className={styles['winner-overlay']}>
      <div className={styles['winner-box']}>
        {winner === "tie" ? (
          <h2>It's a Tie!</h2>
        ) : (
          <>
            <h2>Winner:</h2>
            <Piece player={winner} />
          </>
        )}
        <button onClick={onRestart}>Restart</button>
      </div>
    </div>
  );
}
