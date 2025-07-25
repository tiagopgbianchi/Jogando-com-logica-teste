import { useState } from "react";
import Board from "../Components/Board";

function PaginaDamas() {
  const [mandatoryCapture, setMandatoryCapture] = useState(true);

  return (
    <div className="game-container">
      <label style={{ display: "block", textAlign: "center", marginBottom: 10 }}>
        <input
          type="checkbox"
          checked={mandatoryCapture}
          onChange={() => setMandatoryCapture((prev) => !prev)}
        />
        &nbsp;Mandatory Captures
      </label>

      <Board mandatoryCapture={mandatoryCapture} />
    </div>
  );
}

export default PaginaDamas;
