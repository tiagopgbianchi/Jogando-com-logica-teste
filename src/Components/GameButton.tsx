import { useNavigate } from "react-router-dom";

interface GameButtonProps {
  pagina: string;
  label: string;
  imageSrc?: string;
}

function GameButton({ pagina, label, imageSrc }: GameButtonProps) {
  const navigate = useNavigate();

  const entrarJogo = () => {
    navigate(`/${pagina}`);
  };

  return (
    <button onClick={entrarJogo} className="game-button">
      {imageSrc && <img src={imageSrc} className="game-icon" />}
      <span className="game-label">{label}</span>
    </button>
  );
}

export default GameButton;
