import { useEffect, useState } from "react";
interface Prop {
  numero_base: number;
  numero: number;
  conta: string;
  checar: boolean;
}
function CaixaStop(props: Prop) {
  const [certo, setCerto] = useState(false);
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
    const resultado = eval(
      `${props.numero_base} ${props.conta} ${props.numero}`
    );
    console.log(resultado);
    console.log(Number(valorInput));
    if (Number(valorInput) === resultado) setCerto(true);
    if (certo) setColor("verde");
    else setColor("vermelho");
  }, [props.checar, color]);

  return (
    <form className={`cell ${color}`} onSubmit={handleSubmit}>
      <input
        className="input-cell"
        type="number"
        value={valorInput}
        onChange={handleChange}
      ></input>
    </form>
  );
}

export default CaixaStop;
