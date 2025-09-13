import styles from "./Winner.module.css";
import { Piece } from "./Piece";

export function WinnerOverlay({ winner, onRestart }: { winner: "X" | "O" | "tie"; onRestart: () => void }) {
  return (
    <div className={styles['winner-overlay']}>
      <div className={styles['winner-box']}>
        {winner === "tie" ? (
          <h2>Empate!</h2>
        ) : (
          <>
            <h2>Ganhador:</h2>
            <Piece player={winner} />
          </>
        )}
        <button onClick={onRestart}>Jogar de novo</button>
      </div>
    </div>
  );
}
