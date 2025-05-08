import MainMenu from "../Components/mainMenu";
const projetoLogo = "../public/Logo png (2).png";
import "../App.css";

function Home() {
  return (
    <>
      <div>
        <img src={projetoLogo} className="logo react" alt="React logo" />
      </div>
      <h1>Jogando com Lógica</h1>
      <MainMenu />
      <p className="read-the-docs">Dont click</p>
    </>
  );
}

export default Home;
