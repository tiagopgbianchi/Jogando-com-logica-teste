import { useEffect, useState } from "react";

interface caixaStopProp {
  numero_base: number;
  numero: number;
  conta: string;
  checar: boolean;
  registrarAcerto: () => void;
}

function CaixaStop(props: caixaStopProp) {
  const [certo, setCerto] = useState<boolean | null>(null); // true, false, or null
  const [respostaCorreta, setRespostaCorreta] = useState<number | null>(null);
  const [valorInput, setValorInput] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValorInput(event.target.value);
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (!props.checar) return;

    let resultado: number;
    switch (props.conta) {
      case "+":
        resultado = props.numero_base + props.numero;
        break;
      case "-":
        resultado = props.numero_base - props.numero;
        break;
      case "x":
        resultado = props.numero_base * props.numero;
        break;
      case "÷":
        resultado = props.numero_base / props.numero;
        break;
      default:
        resultado = NaN;
    }

    if (Number(valorInput) === resultado) {
      setCerto(true);
      props.registrarAcerto();
    } else {
      setCerto(false);
      setRespostaCorreta(resultado);
    }
  }, [props.checar]);

  return (
    <div>
      <div className="header">
        {" "}
        {props.conta}
        {props.numero}
      </div>
      <form className="cell" onSubmit={handleSubmit}>
        <input
          className="input-cell"
          type="number"
          value={valorInput}
          onChange={handleChange}
        ></input>
      </form>
      {props.checar && (
        <div className="feedback">
          {certo === true && <span className="checkmark">✔️</span>}
          {certo === false && (
            <>
              <span className="xmark">❌</span>
              <div className="correction">Correct: {respostaCorreta}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CaixaStop;
