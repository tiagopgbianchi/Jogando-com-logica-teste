import "../CSS/Jogos.css";
import GameButton from "../Components/GameButton";

function Jogos() {
  return (
    <div className="jogosPg">
      <h2>Jogos:</h2>
      <div className="grade_jogos">
        <GameButton
          pagina="jogoStop"
          label="Stop Matemático"
          imageSrc={`${import.meta.env.BASE_URL}iconStop.png`}
        />
        <GameButton
          pagina="damas"
          label="Jogo de Damas"
          imageSrc={`${import.meta.env.BASE_URL}imagem_damas.png`}
        />
        <GameButton
          pagina="teste"
          label="Página Teste"
          imageSrc={`${import.meta.env.BASE_URL}vite.svg`}
        />
        <GameButton
          pagina="spttt"
          label="Super Jogo da Velha"
          imageSrc={`${import.meta.env.BASE_URL}vite.svg`}
        />
      </div>
    </div>
  );
}

export default Jogos;
