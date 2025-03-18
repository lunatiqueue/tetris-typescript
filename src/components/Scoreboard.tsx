import React from "react";

interface ScoreboardProps {
  score: number;
  level: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, level }) => {
  return (
    <div className="control">
      <p className="label">Level: <span className="level">{level}</span></p>
      <p className="label">Score: <span className="score">{score}</span></p>
    </div>
  );
};

export default Scoreboard;