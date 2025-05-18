import Home from "./Pages/Home";
import Jogos from "./Pages/Jogos";
import Sobre from "./Pages/Sobre";
import Contato from "./Pages/Contato";
import JogoStop from "./Pages/jogoStop";
import MudarPagina from "./Components/MudarPagina";
//import "./CSS/App.css";
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
      </Routes>
    </main>
  );
}

export default App;
