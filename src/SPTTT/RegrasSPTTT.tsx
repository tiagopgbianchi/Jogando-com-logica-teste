import { useNavigate } from "react-router-dom";
import { useState } from "react";

function RegrasSPTTT(){
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    function jogarSPTTT() {
      navigate("/jogospttt");
  }

    return(
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
        <button className="button" onClick={jogarSPTTT}>
          <span>Jogar</span>
        </button>
        <div className="difPart">
          <div className="difToggle" onClick={() => setIsOpen(!isOpen)}>
            <h2 className="difLabel">Dificuldade</h2>
            {isOpen ? "﹀" : "︿"}
          </div>

          {isOpen && (
            <div className="difMenu">
              <div
                onClick={() => {
                  
                }}
              >
                Fácil
              </div>
              <div
                onClick={() => {
                  
                }}
              >
                Médio
              </div>
              <div
                onClick={() => {
                  
                }}
              >
                Difícil
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
    

export default RegrasSPTTT;