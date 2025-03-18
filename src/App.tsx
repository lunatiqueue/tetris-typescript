import React, { useState } from "react";
import Playfield from "./components/Playfield";
import Controls from "./components/Controls";
import Scoreboard from "./components/Scoreboard";
import "./styles/styles.css";

const App: React.FC = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isPaused, setIsPaused] = useState(true);

  return (
    <div className="tetris-container">
      <Scoreboard score={score} level={level} />
      <Playfield 
        isPaused={isPaused} 
        score={score} 
        setScore={setScore} 
        level={level} 
        setLevel={setLevel} 
      />
      <Controls setIsPaused={setIsPaused} />
    </div>
  );
};

export default App;