import Board from "../Components/Board";
import { useLocation } from "react-router-dom";
function PaginaDamas() {
  const location = useLocation();
  const { MandatoryCapture } = location.state;
  return (
    <div className="game-container">
      

      <Board mandatoryCapture={MandatoryCapture} />
    </div>
  );
}

export default PaginaDamas;
