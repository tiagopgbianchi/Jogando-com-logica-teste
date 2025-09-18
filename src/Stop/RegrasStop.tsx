import { useState } from "react";
import "./Regras.css";
import { useNavigate } from "react-router-dom";

function JogoStop() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  function jogarStop() {
    navigate("/stopPage", { state: { difficulty } });
  }
  const [difficulty, setDifficulty] = useState("d2");

  return (
    <div className="regrasPage">
      {/* Left Side - Rules */}
      <div className="boxBorder">
        <div className="boxRegras">
          <ul className="regras">
            <li>
              <h3>O Número Mágico vai ser sorteado</h3>
              <img
                src={`${import.meta.env.BASE_URL}ComoJogarStop1.png`}
                className="como c1"
              />
            </li>
            <li>
              <img
                src={`${import.meta.env.BASE_URL}ComoJogarStop2.png`}
                className="como c2"
              />
              <h3>Use o Número Mágico para fazer as contas</h3>
            </li>
            <li>
              <h3>Clique no botão STOP quando terminar</h3>
              <div className="c3Box">
                <img
                  src={`${import.meta.env.BASE_URL}ComoJogarStop3.png`}
                  className="como c3"
                />
              </div>
            </li>
            <li>
              <img
                src={`${import.meta.env.BASE_URL}ComoJogarStop4.png`}
                className="como c4"
              />
              <h3>Veja os acertos e seu tempo </h3>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Game Controls */}
      <div className="botoes">
        <button className="button" onClick={jogarStop}>
          <span>Jogar</span>
        </button>
        <div className="difPart">
          <div className="difToggle" onClick={() => setIsOpen(!isOpen)}>
            <h2 className="difLabel">Dificuldade</h2>
            <span className="arrow">{isOpen ? "▼" : "▶"}</span>
          </div>

          {isOpen && (
            <div className="difMenu">
              <div
                className={`difMenuItem ${
                  difficulty === "d1" ? "selected" : ""
                }`}
                onClick={() => {
                  setDifficulty("d1");
       
                }}
              >
                Fácil 1
              </div>
              <div
                className={`difMenuItem ${
                  difficulty === "d2" ? "selected" : ""
                }`}
                onClick={() => {
                  setDifficulty("d2");
      
                }}
              >
                Fácil 2
              </div>
              <div
                className={`difMenuItem ${
                  difficulty === "d3" ? "selected" : ""
                }`}
                onClick={() => {
                  setDifficulty("d3");
           
                }}
              >
                Médio 1
              </div>
              <div
                className={`difMenuItem ${
                  difficulty === "d4" ? "selected" : ""
                }`}
                onClick={() => {
                  setDifficulty("d4");
        
                }}
              >
                Médio 2
              </div>
              <div
                className={`difMenuItem ${
                  difficulty === "d5" ? "selected" : ""
                }`}
                onClick={() => {
                  setDifficulty("d5");
             
                }}
              >
                Difícil 1
              </div>
              <div
                className={`difMenuItem ${
                  difficulty === "d6" ? "selected" : ""
                }`}
                onClick={() => {
                  setDifficulty("d6");
       
                }}
              >
                Difícil 2
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}

export default JogoStop;
