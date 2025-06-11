import StopPage from "./Stop/PageStop";
/*import StopJogo from "./Stop/JogoStop";*/
import Home from "./Pages/Home";
import Jogos from "./Pages/Jogos";
import Sobre from "./Pages/Sobre";
import Contato from "./Pages/Contato";
import JogoStop from "./Stop/RegrasStop";
import PaginaDamas from "./Damas/PaginaDamas";
import "./App.css";
import { Routes, Route, useLocation, Link } from "react-router-dom";

function BackButton() {
  const location = useLocation();

  // Don't show on homepage
  if (location.pathname === "/") return null;

  return (
    <Link to="/">
      <button className="back-button">
        <img src={`${import.meta.env.BASE_URL}homeButton.png`} className="homeButton" />
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
      </Routes>
    </main>
  );
}

export default App;
