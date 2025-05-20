import StopPage from "./Pages/StopPage";
import Home from "./Pages/Home";
import Jogos from "./Pages/Jogos";
import Sobre from "./Pages/Sobre";
import Contato from "./Pages/Contato";
import JogoStop from "./Pages/JogoStop";
import MudarPagina from "./Components/MudarPagina";
import "./App.css";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <main>
      <MudarPagina />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jogos" element={<Jogos />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/jogoStop" element={<JogoStop />} />
        <Route path="/stoppage" element={<StopPage />} />
      </Routes>
    </main>
  );
}

export default App;
