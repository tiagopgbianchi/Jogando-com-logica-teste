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
          pagina="damas"
          label="Jogo de Damas"
          imageSrc={`${import.meta.env.BASE_URL}damasLogo.png`}
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
      </div>
    </div>
  );
}

export default Jogos;