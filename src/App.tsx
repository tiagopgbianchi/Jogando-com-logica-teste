import StopPage from "./Stop/PageStop";
/*import StopJogo from "./Stop/JogoStop";*/
import Home from "./Main/Pages/Home";
import Jogos from "./Main/Pages/Jogos";
import Sobre from "./Main/Pages/Sobre";
import Contato from "./Main/Pages/Contato";
import JogoStop from "./Stop/RegrasStop";
import PaginaDamas from "./Damas/Pages/PaginaDamas";
import Teste from "./Main/Pages/Teste";
import SPTTT from "./SPTTT/RegrasSPTTT";
import JogoSPTTT from "./SPTTT/SPTTT";
import Pagina_Soma from "./Caca_soma/Pagina_principal";
import "./App.css";
import { Routes, Route, useLocation, Link } from "react-router-dom";

function BackButton() {
  const location = useLocation();

  // Don't show on homepage
  if (location.pathname === "/") return null;

  return (
    <Link to="/">
      <button className="back-button">
        <img
          src={`${import.meta.env.BASE_URL}homeButton.png`}
          className="homeButton"
        />
      </button>
    </Link>
  );
}

function App() {
  return (
    <main>
      <BackButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jogos" element={<Jogos />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/jogoStop" element={<JogoStop />} />
        <Route path="/stoppage" element={<StopPage />} />
        <Route path="/damas" element={<PaginaDamas />} />
        <Route path="/teste" element={<Teste />} />
        <Route path="/spttt" element={<SPTTT />} />
        <Route path="/jogospttt" element={<JogoSPTTT />} />
        <Route path="/cacaSoma" element={<Pagina_Soma />} />
      </Routes>
    </main>
  );
}

export default App;
