import "../CSS/Jogos.css";
import GameButton from "../Components/gameButton";

function Jogos() {
  return (
    <div className="jogosPg">
      <h2>Jogos:</h2>
      <GameButton
        pagina="jogoStop"
        label="Stop Matemático"
        imageSrc="../public/vite.svg"
      />
    </div>
  );
}

export default Jogos;
