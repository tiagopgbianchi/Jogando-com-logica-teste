import { useState } from "react";

const MainMenu = () => {
  const [count, setCount] = useState(0); 

  return (
    <div className="card">
      <button onClick={() => setCount((count) => count + 1)}>
        Click me click me -- you clicked this many times -- &gt; {count}
      </button>
      <p>
        This website is being made
      </p>
    </div>
  );
};

export default MainMenu;