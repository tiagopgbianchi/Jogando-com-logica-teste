import JogarStop from "./ButJogarStop";
import "./Regras.css";

function JogoStop() {
  return (
    <div className="regrasPage">
      {/* Left Side - Rules */}
      <div className="boxRegras">
        <h2>Como Jogar Stop Matemático</h2>
        <ul  className='regras'>
          <li>
            <strong>O número mágico vai aparecer na tela:</strong><br />
            O número mágico será usado para todas as contas do jogo.
          </li>
          <li>
            <strong>Várias contas vão aparecer:</strong><br />
            Você vai ver contas como <code>+4</code>, <code>-2</code>, <code>×3</code>, <code>÷2</code>, e deve resolver todas usando o número que apareceu.
          </li>
          <li>
            <strong>Temporizador!</strong><br />
            Você tem um tempo para responder o máximo que conseguir. Quando o tempo acabar, o jogo termina.
          </li>
          <li>
            <strong>Veja sua pontuação:</strong><br />
            No final, o jogo mostra quantas você acertou e sua pontuação!
          </li>
        </ul>
      </div>

      {/* Right Side - Game Controls */}
      <div className="botoes">
        <JogarStop />
        <p className="difficultyPlaceholder">[Escolha a dificuldade - em breve]</p>
      </div>
    </div>
  );
}

export default JogoStop;