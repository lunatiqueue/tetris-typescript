import React from "react";

interface ControlsProps {
  setIsPaused: (pause: boolean) => void;
}

const Controls: React.FC<ControlsProps> = ({ setIsPaused }) => {
  return (
    <div className="control">
      <button onClick={() => setIsPaused(false)} className="btn start">Start</button>
      <button onClick={() => setIsPaused(true)} className="btn pause">Pause</button>
    </div>
  );
};

export default Controls;