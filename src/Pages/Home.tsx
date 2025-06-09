//import MainMenu from "../Components/mainMenu";
import "../CSS/Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const mudar_pagina = (pagina: string) => {
    navigate(`/${pagina}`);
  };
  return (
    <div className="homePage">
      <div className="imagens">
        <img src="public/imagemXadrez.png" className="imagemXadrez" />
        <img src="public/imagemCubo.png" className="imagemCubo" />
      </div>
      <div className="logo">
        <picture>
          <source
            srcSet="public/logoEscritaVertical.png"
            media="(orientation: portrait)"
          />
          <img
            src="public/logoEscritaHorizontal5.png"
            className="logoTexto"
            alt="Logo"
          />
        </picture>
      </div>
      <div className="buttonsHome">
        <button className="buttonJogar" onClick={() => mudar_pagina("jogos")}>
          {" "}
          Jogar
        </button>
        <div className="buttonRow">
          <button className="buttonSobre" onClick={() => mudar_pagina("sobre")}>
            {" "}
            Sobre
          </button>
          <button
            className="buttonContato"
            onClick={() => mudar_pagina("contato")}
          >
            {" "}
            Contato
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
