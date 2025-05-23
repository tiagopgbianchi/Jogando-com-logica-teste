import { useState } from "react";
import JogarStop from "./ButJogarStop";
import "./Stop.css";

function JogoStop() {
  const [showRules, setShowRules] = useState(false);

  const toggleRules = () => setShowRules(prev => !prev);

  return (
    <div className="regras">
      <JogarStop />
      
      <h2 className="toggleButton" onClick={toggleRules}>
        Regras do Stop Matemático {showRules ? "▲" : "▼"}
      </h2>

      {showRules && (
  <div className="boxRegrasOverlay" onClick={toggleRules}>
    <div className="boxRegras" onClick={(e) => e.stopPropagation()}>
      <ul>
        <li>
          <strong>O número mágico vai aparecer na tela:</strong><br />
          O número mágico será usado para todas as contas do jogo.
        </li>
        <li>
          <strong>Várias contas vão aparecer:</strong><br />
          Você vai ver contas como <code>+4</code>, <code>-2</code>, <code>×3</code>, <code>÷2</code>, e deve resolver todas usando o número que apareceu.<br />
        </li>
    
        <li>
          <strong>Temporizador! </strong><br />
          Você tem um tempo para responder o máximo que conseguir. Quando o tempo acabar, o jogo termina.
        </li>
        <li>
          <strong>Veja sua pontuação:</strong><br />
          No final, o jogo mostra quantas você acertou e sua pontuação!
        </li>
      </ul>
    </div>
  </div>
)}
    </div>
  );
}

export default JogoStop;