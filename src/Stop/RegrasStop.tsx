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
            {isOpen ? <div className="downArrow">-</div> : <div className="upArrow">+</div>}
          </div>

          {isOpen && (
            <div className="difMenu">
              <div
                onClick={() => {
                  setDifficulty("d1");
                  setIsOpen(false);
                }}
              >
                Muito Fácil
              </div>
              <div
                onClick={() => {
                  setDifficulty("d2");
                  setIsOpen(false);
                }}
              >
                Facil
              </div>
              <div
                onClick={() => {
                  setDifficulty("d3");
                  setIsOpen(false);
                }}
              >
                Medio
              </div>
              <div
                onClick={() => {
                  setDifficulty("d4");
                  setIsOpen(false);
                }}
              >
                Difícil
              </div>
              <div
                onClick={() => {
                  setDifficulty("d5");
                  setIsOpen(false);
                }}
              >
                Muito Difícil
              </div>
              <div
                onClick={() => {
                  setDifficulty("d6");
                  setIsOpen(false);
                }}
              >
                Impossivel
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JogoStop;
