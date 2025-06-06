import "../CSS/Jogos.css";
import GameButton from "../Components/GameButton";

function Jogos() {
  return (
    <div className="jogosPg">
      <h2>Jogos:</h2>
      <GameButton
        pagina="jogoStop"
        label="Stop Matemático"
        imageSrc="public/iconStop.png"
      />
    </div>
  );
}

export default Jogos;
