import { useState } from "react";
import "./Regras.css";
import { useNavigate } from "react-router-dom";

function JogoStop() {
  const navigate = useNavigate();

  function jogarStop() {
    navigate("/stopPage", { state: { difficulty } });
  }
  const [difficulty, setDifficulty] = useState("d2");
  return (
    <div className="regrasPage">
      {/* Left Side - Rules */}
      <div className="boxRegras">
        {/*<h2>Como Jogar Stop Matemático</h2>*/}
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
            <h3>Veja seu tempo e </h3>
          </li>
        </ul>
      </div>

      {/* Right Side - Game Controls */}
      <div className="botoes">
        <button className="button" onClick={jogarStop}>
          <span>Jogar</span>
        </button>
        <div>
          <div>
            <h2>Escolha a Dificuldade:</h2>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="d1">Fácil</option>
              <option value="d2">Médio</option>
              <option value="d3">Difícil</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JogoStop;
