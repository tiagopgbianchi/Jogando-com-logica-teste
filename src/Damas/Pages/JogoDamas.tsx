import Board from "../Components/Board";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/board.module.css";

function PaginaDamas() {
  const location = useLocation();
  const navigate = useNavigate();
  const { MandatoryCapture } = location.state || { MandatoryCapture: false };

  const handleBackToMenu = () => {
    navigate("/regras-damas");
  };

  return (
    <div className={styles['game-page']}>
      {/* Back to menu button */}
      <button 
        onClick={handleBackToMenu}
        className={styles['back-button']}
      >
        ← Voltar ao Menu
      </button>

      <Board mandatoryCapture={MandatoryCapture} />
    </div>
  );
}

export default PaginaDamas;