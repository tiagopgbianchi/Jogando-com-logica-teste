import { useEffect, useState } from "react";

interface caixaStopProp {
  numero_base: number;
  numero: number;
  conta: string;
  checar: boolean;
}

function CaixaStop(props: caixaStopProp) {


  const [, setCerto] = useState(false);
  const [valorInput, setValorInput] = useState("");
  const [color, setColor] = useState("");
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
    setColor("verde");
  } else {
    setCerto(false);
    setColor("vermelho");
  }
}, [props.checar]);

  return (
    <div>
      <span>  {props.conta}{props.numero}</span>
      <form className={`cell ${color}`} onSubmit={handleSubmit}>
        <input
          className="input-cell"
          type="number"
          value={valorInput}
          onChange={handleChange}
        ></input>
      </form>
    </div>
  );
}

export default CaixaStop;
