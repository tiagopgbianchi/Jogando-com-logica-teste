import JogarStop from "../Components/JogarStop";
import "../CSS/Stop.css";
function jogoStop(){
    return (
        <div className="regras">
  <h2> Como jogar o Stop Matemático</h2>
    <JogarStop></JogarStop>
  <ul>
    <li>
      <strong>Um número vai aparecer na tela:</strong><br />
      Esse número será usado para todas as contas do jogo.
    </li>

    <li>
      <strong>Várias contas vão aparecer:</strong><br />
      Você vai ver contas como <code>+4</code>, <code>-2</code>, <code>×3</code>, <code>÷2</code>, e deve resolver todas usando o número que apareceu.<br />
      Por exemplo, se o número for <strong>6</strong>:<br />
      <ul>
        <li><code>6 + 4 = 10</code></li>
        <li><code>6 × 3 = 18</code></li>
      </ul>
    </li>

    <li>
      <strong>Tudo na mesma tela:</strong><br />
      As contas vão aparecer todas juntas, e você pode responder na ordem que quiser.
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
    )
}

export default jogoStop