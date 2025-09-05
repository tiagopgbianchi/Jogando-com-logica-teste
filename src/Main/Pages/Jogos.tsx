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
          pagina="damasregras"
          label="Base Game"
          imageSrc={`${import.meta.env.BASE_URL}vite.svg`}
        />
        <GameButton
          pagina="spttt"
          label="Super Jogo da Velha"
          imageSrc={`${import.meta.env.BASE_URL}vite.svg`}
        />
        <GameButton
          pagina="cacasomaRg"
          label="Caça Soma"
          imageSrc={`${import.meta.env.BASE_URL}vite.svg`}
        />
        <GameButton
          pagina="crownchaseRg"
          label="Caça Coroa"
          imageSrc={`${import.meta.env.BASE_URL}vite.svg`}
        />
        <GameButton
          pagina="dimensions"
          label="Rubiks Class"
          imageSrc={`${import.meta.env.BASE_URL}imagemCubo.png`}
        />
      </div>
    </div>
  );
}

export default Jogos;
