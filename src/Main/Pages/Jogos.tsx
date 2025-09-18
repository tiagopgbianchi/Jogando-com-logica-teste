import "../CSS/Jogos.css";
import GameButton from "../Components/GameButton";

function Jogos() {
  return (
    <div className="jogosPg">
      <div className="jogosHeader">
        <h2>Jogos</h2>
      </div>
      <div className="grade_jogos">
        <GameButton
          pagina="jogoStop"
          label="Stop Matemático"
          imageSrc={`${import.meta.env.BASE_URL}iconStop.png`}
        />
        <GameButton
          pagina="mathwarRg"
          label="Guerra Matemática"
          imageSrc={`${import.meta.env.BASE_URL}ComoJogarStop1.png`}
        />
        <GameButton
          pagina="spttt"
          label="Super Jogo da Velha"
          imageSrc={`${import.meta.env.BASE_URL}sptttLogo.png`}
        />
        <GameButton
          pagina="cacasomaRg"
          label="Caça Soma"
          imageSrc={`${import.meta.env.BASE_URL}imagem_damas.png`}
        />
        <GameButton
          pagina="crownchaseRg"
          label="Caça Coroa"
          imageSrc={`${import.meta.env.BASE_URL}imagemXadrez.png`}
        />
        <GameButton
          pagina="dimensions"
          label="Cubo Mágico"
          imageSrc={`${import.meta.env.BASE_URL}3x3.png`}
        />
        <GameButton
          pagina="baseGame"
          label="BAse game"
          imageSrc={`${import.meta.env.BASE_URL}vite.svg`}
        />
        <GameButton
          pagina="damas"
          label="DAMAS"
          imageSrc={`${import.meta.env.BASE_URL}damasLogo.png`}
        />
      </div>
    </div>
  );
}

export default Jogos;