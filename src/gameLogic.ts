export const PLAYFIELD_COLUMNS = 10;
export const PLAYFIELD_ROWS = 20;

export type Tetromino = {
  name: string;
  matrix: number[][];
  row: number;
  column: number;
};

export const TETROMINOES = {
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

export const generatePlayfield = (): number[][] => {
  return Array.from({ length: PLAYFIELD_ROWS }, () =>
    new Array(PLAYFIELD_COLUMNS).fill(0)
  );
};

export const getRandomTetromino = (): Tetromino => {
  const names = Object.keys(TETROMINOES) as (keyof typeof TETROMINOES)[];
  const name = names[Math.floor(Math.random() * names.length)];
  const matrix = TETROMINOES[name];
  const column = Math.floor(PLAYFIELD_COLUMNS / 2 - matrix.length / 2);
  return { name, matrix, row: 0, column };
};

export const moveTetromino = (
  tetromino: Tetromino,
  playfield: number[][],
  direction: "down" | "left" | "right"
) => {
  switch (direction) {
    case "down":
      tetromino.row += 1;
      break;
    case "left": {
      const leftmostFilledColumn = tetromino.matrix.reduce((minCol, row) => {
      const firstOneIndex = row.findIndex(cell => cell === 1);
      return firstOneIndex !== -1 ? Math.min(minCol, firstOneIndex) : minCol;
      }, Infinity);

      tetromino.column = Math.max(tetromino.column - 1, -leftmostFilledColumn);
      break;
    }
    case "right":
      const tetrominoWidth = Math.max(...tetromino.matrix.map(row => row.lastIndexOf(1))) + 1;
      tetromino.column = Math.min(tetromino.column + 1, PLAYFIELD_COLUMNS - tetrominoWidth);
      break;
  }
};

export const rotateTetromino = (tetromino: Tetromino) => {
  const rotatedMatrix = tetromino.matrix[0].map((_, i) =>
    tetromino.matrix.map(row => row[row.length - 1 - i])
  );

  let newColumn = tetromino.column;

  // Prevent rotation from exceeding the right boundary
  const newWidth = rotatedMatrix[0].length;
  if (newColumn + newWidth > PLAYFIELD_COLUMNS) {
    newColumn = PLAYFIELD_COLUMNS - newWidth;
  }

  // Prevent rotation from exceeding the left boundary
  const firstFilledColumn = rotatedMatrix.reduce(
    (minCol, row) => Math.min(minCol, row.findIndex(cell => cell === 1)),
    Infinity
  );

  if (newColumn + firstFilledColumn < 0) {
    newColumn -= newColumn + firstFilledColumn;
  }

  tetromino.matrix = rotatedMatrix;
  tetromino.column = newColumn;
};

export const isValidMove = (tetromino: Tetromino, playfield: number[][]): boolean => {
  return tetromino.matrix.every((row, rowIndex) =>
    row.every((cell, colIndex) => {
      if (!cell) return true;
      const newRow = tetromino.row + rowIndex;
      const newCol = tetromino.column + colIndex;
      return (
        newRow >= 0 &&
        newRow < PLAYFIELD_ROWS &&
        newCol >= 0 &&
        newCol < PLAYFIELD_COLUMNS &&
        playfield[newRow][newCol] === 0
      );
    })
  );
};

export const fixTetromino = (tetromino: Tetromino, playfield: number[][]): number[][] => {
  const newPlayfield = playfield.map((row) => [...row]);
  tetromino.matrix.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        newPlayfield[tetromino.row + rowIndex][tetromino.column + colIndex] = 1;
      }
    });
  });
  return newPlayfield;
};

export const findFilledRows = (playfield: number[][]): number[] => {
  return playfield.reduce<number[]>((filledRows, row, rowIndex) => {
    if (row.every(cell => cell !== 0)) {
      filledRows.push(rowIndex);
    }
    return filledRows;
  }, []);
};

export const removeFilledRows = (playfield: number[][], filledRows: number[]): number[][] => {
  let newPlayfield = playfield.map(row => [...row]); // Copy playfield

  // Mark rows as "D" for animation effect
  filledRows.forEach(row => {
    newPlayfield[row] = new Array(PLAYFIELD_COLUMNS).fill("D" as any);
  });

  // Wait before clearing (simulate delay)
  setTimeout(() => {
    newPlayfield = dropRowsAbove(newPlayfield, filledRows);
  }, 500);

  return newPlayfield;
};

export const dropRowsAbove = (playfield: number[][], filledRows: number[]): number[][] => {
  let newPlayfield = playfield.filter((_, index) => !filledRows.includes(index));

  // Add new empty rows at the top
  while (newPlayfield.length < PLAYFIELD_ROWS) {
    newPlayfield.unshift(new Array(PLAYFIELD_COLUMNS).fill(0));
  }

  return newPlayfield;
};