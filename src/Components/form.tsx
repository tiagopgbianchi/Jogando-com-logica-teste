import { useState } from "react";
import "../CSS/form.css"

export default function CustomFeedbackForm() {
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    comoConheceu: "",
    maisGostou: "",
    melhorar: "",
    jogoBugado: "",
    sugestao: "",
    mensagem: "",
    nota: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulário enviado:", formData);
    // Envio futuro para planilha
  };

  return (
    <div className="form-wrapper">
      <h2 className="form-title">Formulário de Feedback</h2>
      <form onSubmit={handleSubmit} className="feedback-form">

        <div className="topRow">
            <label>
              Nome:
              <input type="text" name="nome" onChange={handleChange} />
            </label>
            <label>
              Idade:
              <input type="number" name="idade" onChange={handleChange}  />
            </label>
        </div>

        <label>
          Como você conheceu o projeto?
          <input name="comoConheceu" onChange={handleChange}  />
        </label>

        <label>
          O que você mais gostou?
          <input name="maisGostou" onChange={handleChange}  />
        </label>

        <label>
          O que poderia melhorar?
          <input name="melhorar" onChange={handleChange} />
        </label>

        <label>
          Tem algum jogo que não está funcionando direito?
          <input name="jogoBugado" onChange={handleChange} />
        </label>

        <label>
          Algo que queira nos falar?
          <input name="mensagem" onChange={handleChange} />
        </label>

        <label>
          Se você fosse dar uma nota para o site de 1 a 10, qual seria?
          <input type="number" name="nota" min="1" max="10" onChange={handleChange}  />
        </label>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}