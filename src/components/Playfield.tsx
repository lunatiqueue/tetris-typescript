import React, { useEffect, useState } from "react";
import {
  generatePlayfield,
  getRandomTetromino,
  moveTetromino,
  rotateTetromino,
  isValidMove,
  fixTetromino,
  Tetromino,
  findFilledRows,
  removeFilledRows,
  dropRowsAbove,
} from "../gameLogic";

interface PlayfieldProps {
  isPaused: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
}

const Playfield: React.FC<PlayfieldProps> = ({ isPaused, score, setScore, level, setLevel }) => {
  const [playfield, setPlayfield] = useState(generatePlayfield());
  const [tetromino, setTetromino] = useState<Tetromino>(getRandomTetromino());
  const [linesCleared, setLinesCleared] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false); // Track if the game is running

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isPaused || gameOver) return;

      const newTetromino = { ...tetromino };

      switch (e.key) {
        case "ArrowDown":
          moveTetromino(newTetromino, playfield, "down");
          break;
        case "ArrowLeft":
          moveTetromino(newTetromino, playfield, "left");
          break;
        case "ArrowRight":
          moveTetromino(newTetromino, playfield, "right");
          break;
        case "ArrowUp":
          rotateTetromino(newTetromino);
          break;
        case " ":
          let dropTetromino = { ...tetromino };
          while (isValidMove({ ...dropTetromino, row: dropTetromino.row + 1 }, playfield)) {
            dropTetromino.row += 1;
          }
          setTetromino(dropTetromino);
          setTimeout(() => handleTetrominoLanding(dropTetromino), 50);
          return;
      }

      if (isValidMove(newTetromino, playfield)) {
        setTetromino(newTetromino);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [tetromino, playfield, isPaused, gameOver]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const speed = 1000 - level * 50;
    const interval = setInterval(() => {
      setTetromino(prevTetromino => {
        const newTetromino = { ...prevTetromino };
        moveTetromino(newTetromino, playfield, "down");

        if (isValidMove(newTetromino, playfield)) {
          return newTetromino;
        } else {
          handleTetrominoLanding(prevTetromino);
          return prevTetromino;
        }
      });
    }, speed);

    return () => clearInterval(interval);
  }, [playfield, isPaused, level, gameOver]);

  const handleTetrominoLanding = (landingTetromino: Tetromino = tetromino) => {
    let updatedPlayfield = fixTetromino(landingTetromino, playfield);
    const filledRows = findFilledRows(updatedPlayfield);

    if (filledRows.length > 0) {
      setPlayfield(removeFilledRows(updatedPlayfield, filledRows));

      setTimeout(() => {
        setPlayfield(prevPlayfield => dropRowsAbove(prevPlayfield, filledRows));
        const pointsTable = [0, 10, 25, 75, 100];
        setScore(prevScore => prevScore + pointsTable[filledRows.length]);

        setLinesCleared(prev => {
          const newLinesCleared = prev + filledRows.length;
          if (newLinesCleared >= level * 10) {
            setLevel(prevLevel => prevLevel + 1);
          }
          return newLinesCleared;
        });
      }, 500);
    } else {
      setPlayfield(updatedPlayfield);
    }

    const newTetromino = getRandomTetromino();
    if (!isValidMove(newTetromino, updatedPlayfield)) {
      setGameOver(true);
    } else {
      setTetromino(newTetromino);
    }
  };

  const restartGame = () => {
    setGameOver(false);
    setLevel(1);
    setLinesCleared(0);
    setScore(0);
    setPlayfield(generatePlayfield());
    setTetromino(getRandomTetromino());
    setIsRunning(false);
  };

  const renderPlayfield = () => {
    return playfield.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const isTetrominoCell = tetromino.matrix.some((tetrominoRow, tetrominoRowIndex) =>
          tetrominoRow.some(
            (cell, tetrominoColIndex) =>
              cell &&
              rowIndex === tetromino.row + tetrominoRowIndex &&
              colIndex === tetromino.column + tetrominoColIndex
          )
        );

        return (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`cell ${isTetrominoCell ? tetromino.name : cell ? "F" : ""}`}
          ></div>
        );
      })
    );
  };

  return (
    <>
      <div className="tetris">
        {renderPlayfield()}
      </div>

      <div className={`modal ${gameOver ? "visible" : ""}`}>
        <div className="sticker">
          <p className="over">Game over!</p>
          <p className="result">Your result is</p>
          <span id="result">{score}</span>
          <button className="btn restart" onClick={restartGame}>
            Restart
          </button>
        </div>
      </div>
    </>
  );
};

export default Playfield;
