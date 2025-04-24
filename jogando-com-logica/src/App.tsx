import MainMenu from "./mainMenu";
const projetoLogo = "./public/Logo png (2).png";
import "./App.css";

function App() {
  

  return (
    <>
      <div>
          <img src={projetoLogo} className="logo react" alt="React logo" />
      </div>
      <h1>Jogando com Lógica</h1>
      <MainMenu />
      <p className="read-the-docs">
        Dont click
      </p>
    </>
  );
}

export default App;
