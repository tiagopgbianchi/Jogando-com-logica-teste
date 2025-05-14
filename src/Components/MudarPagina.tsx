import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../CSS/MudarPagina.css";
function MudarPagina() {
  const [mostrar, setmostrar] = useState(false);
  const navigate = useNavigate();
  const mudar_pagina = (pagina: string) => {
    navigate(`/${pagina}`);
  };
  return (
    <>
      <button onClick={() => setmostrar(!mostrar)}> Menu </button>
      {mostrar && (
        <div>
          <button
            className="botao-personalizado"
            onClick={() => mudar_pagina("")}
          >
            Casa
          </button>
          <button
            className="botao-personalizado"
            onClick={() => mudar_pagina("jogos")}
          >
            {" "}
            Jogos
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
      )}
    </>
  );
}

export default MudarPagina;
