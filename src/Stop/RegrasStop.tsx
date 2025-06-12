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
        <h2>Como Jogar Stop Matemático</h2>
        <ul className="regras">
          <li>
            <strong>O número mágico vai aparecer na tela:</strong>
            <br />O número mágico será usado para todas as contas do jogo.
          </li>
          <li>
            <strong>Várias contas vão aparecer:</strong>
            <br />
            Você vai ver contas como <code>+4</code>, <code>-2</code>,{" "}
            <code>×3</code>, <code>÷2</code>, e deve resolver todas usando o
            número que apareceu.
          </li>
          <li>
            <strong>Temporizador!</strong>
            <br />
            Você tem um tempo para responder o máximo que conseguir. Quando o
            tempo acabar, o jogo termina.
          </li>
          <li>
            <strong>Veja sua pontuação:</strong>
            <br />
            No final, o jogo mostra quantas você acertou e sua pontuação!
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
