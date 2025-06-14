import React from "react";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Ultimate Tic-Tac-Toe Board</h1>
      <div className="big-board">
        {Array.from({ length: 9 }).map((_, boardIndex) => (
          <div key={boardIndex} className="small-board">
            {Array.from({ length: 9 }).map((_, cellIndex) => (
              <button key={cellIndex} className="cell">
                {/* Empty cell */}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;