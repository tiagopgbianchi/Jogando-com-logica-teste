import { useNavigate } from "react-router-dom";
import "../CSS/MudarPagina.css";
function MudarPagina() {
  const navigate = useNavigate();
  const mudar_pagina = (pagina: string) => {
    navigate(`/${pagina}`);
  };
  /*const [mostrar, setmostrar] = useState(false);
  <button onClick={() => setmostrar(!mostrar)}> Menu </button>
      {mostrar && ()*/
  return (
    <>
      
        <div className="buttonsHome">
          <button
            className="botao-personalizado"
            onClick={() => mudar_pagina("jogos")}
          >
            {" "}
            Jogar
          </button>
          <button
            className="botao-personalizado"
            onClick={() => mudar_pagina("sobre")}
          >
            {" "}
            Sobre
          </button>
          <button
            className="botao-personalizado"
            onClick={() => mudar_pagina("contato")}
          >
            {" "}
            Contato
          </button>
        </div>
      
    </>
  );
}

export default MudarPagina;
