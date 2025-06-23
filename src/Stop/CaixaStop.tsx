import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

type CaixaStopProps =
  | {
      numero_base: number;
      numero: number;
      conta: string;
      checar: boolean;
      registrarAcerto: () => void;
      isDual?: false;
    }
  | {
      numero_base: number;
      numeros: [number, number]; // <-- two numbers here for the two operations
      contas: [string, string];
      checar: boolean;
      registrarAcerto: () => void;
      isDual: true;
    };

function CaixaStop(props: CaixaStopProps) {
  const [certo, setCerto] = useState<boolean | null>(null);
  const [respostaCorreta, setRespostaCorreta] = useState<number | null>(null);
  const [valorInput, setValorInput] = useState("");

  const isDual = props.isDual === true;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValorInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (!props.checar) return;

    const calculate = (op: string, a: number, b: number) => {
      switch (op) {
        case "+":
          return a + b;
        case "-":
          return a - b;
        case "x":
          return a * b;
        case "÷":
          return a / b;
        default:
          return NaN;
      }
    };

    if (isDual) {
      // Use numeros[0] and numeros[1] separately, each for their operation
      const intermediate = calculate(
        props.contas[0],
        props.numero_base,
        props.numeros[0]
      );
      const finalResult = calculate(
        props.contas[1],
        intermediate,
        props.numeros[1]
      );

      const input = Number(valorInput);
      const acerto = Math.abs(input - finalResult) < 0.0001;

      setCerto(acerto);
      if (acerto) {
        props.registrarAcerto();
      } else {
        setRespostaCorreta(finalResult);
      }
    } else {
      const resultado = calculate(props.conta, props.numero_base, props.numero);
      if (Number(valorInput) === resultado) {
        setCerto(true);
        props.registrarAcerto();
      } else {
        setCerto(false);
        setRespostaCorreta(resultado);
      }
    }
  }, [props.checar]);

  return (
    <div>
      <div className={isDual ? "headerDual" : "header"}>
        {isDual ? (
          <>
            <div>
              {props.contas[0]}
              {props.numeros[0]}
            </div>  <div>
              {props.contas[1]}
              {props.numeros[1]}
            </div>
          </>
        ) : (
          <>
            {props.conta}
            {props.numero}
          </>
        )}
      </div>
      <form className="cellBorder" onSubmit={handleSubmit}>
        <input
          className="input-cell"
          type="number"
          value={valorInput}
          onChange={handleChange}
        />
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
                <XCircle
                  className="icon xmark"
                  strokeWidth={1.5}
                  color="#f02121"
                />
              </div>
              <div className="correction">Correto: {respostaCorreta}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CaixaStop;
