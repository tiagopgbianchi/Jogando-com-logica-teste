import "../CSS/SobreContato.css";
function Contato() {
    return <div className="contato">
      <h2>Contato</h2>
      <h3 style={{ fontSize: "20px", marginBottom: "4 0px"}}>
        Se você quiser entrar em contato com a gente, pode usar o nosso e-mail ou Instagram abaixo — ou, se preferir, envie seu feedback preenchendo o formulário logo abaixo!
      </h3>
      <p>
        <strong>Email:</strong> jogandocomlogica@gmail.com<br />
        <strong>Instagram:</strong>{" "}
        <a href="https://instagram.com/jogandocomlogica" target="_blank">
          @jogandocomlogica
        </a>
      </p>

      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSc3EG0F9zWgaMV9wXa8MAIVKCvnfZDMSy-cIm7o5-JV9pkt0w/viewform?embedded=true"
        width="100%"
        height="800"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="Formulário de Feedback"
      >
        Carregando…
      </iframe>
    </div>

}

export default Contato;