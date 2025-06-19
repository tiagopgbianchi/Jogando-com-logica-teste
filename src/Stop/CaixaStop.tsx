import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

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
      <form className="cellBorder" onSubmit={handleSubmit}>
        <input
          className="input-cell"
          type="number"
          value={valorInput}
          onChange={handleChange}
        ></input>
      </form>
      {props.checar && (
        <div className="feedback">
          {certo === true && (
            <div className="icon-stack">
              <CheckCircle
                className="icon check out"
                strokeWidth={4}
                color="black"
              />

              <CheckCircle
                className="icon check"
                strokeWidth={1.5}
                color="#0fb11d"
              />
            </div>
          )}
          {certo === false && (
            <>
              <div className="icon-stack">
                <XCircle
                  className="icon xmark out"
                  strokeWidth={4}
                  color="black"
                />
                <XCircle className="icon xmark" strokeWidth={1.5} color="#f02121" />
              </div>
              <div className="correction">{respostaCorreta}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CaixaStop;
