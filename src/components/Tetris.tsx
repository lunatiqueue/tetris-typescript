import React, { useState, useEffect, useCallback } from 'react';
import "../styles/styles.css";

const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;

const TETROMINO_NAMES = ['O', 'L', 'J', 'S', 'Z', 'T', 'I'];

const TETROMINOES: Record<string, number[][]> = {
  O: [
    [1, 1],
    [1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
};

type Tetromino = {
  name: string;
  matrix: number[][];
  column: number;
  row: number;
};

const Tetris: React.FC = () => {
  const [playfield, setPlayfield] = useState<number[][]>(
    Array.from({ length: PLAYFIELD_ROWS }, () => new Array(PLAYFIELD_COLUMNS).fill(0))
  );
  const [tetromino, setTetromino] = useState<Tetromino | null>(null);

  const generateTetromino = useCallback(() => {
    const name = TETROMINO_NAMES[Math.floor(Math.random() * TETROMINO_NAMES.length)];
    const matrix = TETROMINOES[name];
    setTetromino({
      name,
      matrix,
      column: Math.floor(PLAYFIELD_COLUMNS / 2 - matrix.length / 2),
      row: 0,
    });
  }, []);

  useEffect(() => {
    generateTetromino();
  }, [generateTetromino]);

  const moveTetromino = (direction: 'left' | 'right' | 'down') => {
    if (!tetromino) return;

    setTetromino((prev) => {
      if (!prev) return null;
      let { row, column } = prev;

      switch (direction) {
        case 'left':
          column -= 1;
          break;
        case 'right':
          column += 1;
          break;
        case 'down':
          row += 1;
          break;
      }

      return { ...prev, row, column };
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          moveTetromino('left');
          break;
        case 'ArrowRight':
          moveTetromino('right');
          break;
        case 'ArrowDown':
          moveTetromino('down');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tetromino]);

  const drawPlayfield = () =>
    playfield.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        {row.map((cell, columnIndex) => (
          <div key={columnIndex} className={`cell ${cell ? 'filled' : ''}`}></div>
        ))}
      </div>
    ));

  return (
    <div className="tetris-container">
      <div className="playfield">{drawPlayfield()}</div>
    </div>
  );
};

export default Tetris;