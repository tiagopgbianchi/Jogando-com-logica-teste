import "../CSS/Jogos.css";
import GameButton from "../Components/GameButton";

function Jogos() {
  return (
    <div className="jogosPg">
      <h2>Jogos:</h2>
<<<<<<< Updated upstream
      <div className="grade_jogos">
        <GameButton
          pagina="jogoStop"
          label="Stop Matemático"
          imageSrc="public/iconStop.png"
        />
        <GameButton
          pagina="damas"
          label="Jogo de Damas"
          imageSrc="public/imagem_damas.png"
        />
      </div>
=======
      <GameButton
        pagina="jogoStop"
        label="Stop Matemático"
        imageSrc={`${import.meta.env.BASE_URL}iconStop.png`}
      />
>>>>>>> Stashed changes
    </div>
  );
}

export default Jogos;
