export const defaultPuzzle = {
  id: 'starter',
  bounds: { width: 60, height: 60 },
  seedLimit: 8,
  initialCells: [
    { x: 10, y: 10 },
    { x: 11, y: 10 },
    { x: 10, y: 11 },
    { x: 11, y: 11 },
    { x: 20, y: 19 },
    { x: 20, y: 20 },
    { x: 20, y: 21 },
  ],
  goalTiles: [{ x: 24, y: 20 }],
  obstacles: [
    { x: 22, y: 18 },
    { x: 22, y: 19 },
    { x: 22, y: 21 },
    { x: 22, y: 22 },
  ],
};

const puzzleTwo = {
  id: 'channel',
  bounds: { width: 60, height: 60 },
  seedLimit: 7,
  initialCells: [
    { x: 13, y: 14 },
    { x: 14, y: 14 },
    { x: 15, y: 14 },
    { x: 14, y: 13 },
    { x: 14, y: 15 },
  ],
  goalTiles: [{ x: 20, y: 14 }],
  obstacles: [
    { x: 17, y: 12 },
    { x: 17, y: 13 },
    { x: 17, y: 15 },
    { x: 17, y: 16 },
  ],
};

const puzzleThree = {
  id: 'fork',
  bounds: { width: 60, height: 60 },
  seedLimit: 6,
  initialCells: [
    { x: 30, y: 30 },
    { x: 31, y: 30 },
    { x: 30, y: 31 },
    { x: 31, y: 31 },
    { x: 35, y: 28 },
    { x: 35, y: 29 },
    { x: 35, y: 30 },
  ],
  goalTiles: [{ x: 40, y: 30 }],
  obstacles: [
    { x: 37, y: 27 },
    { x: 37, y: 28 },
    { x: 37, y: 31 },
    { x: 37, y: 32 },
  ],
};

export const puzzleSequence = [defaultPuzzle, puzzleTwo, puzzleThree];

const puzzleLibrary = puzzleSequence.reduce((acc, puzzle) => {
  acc[puzzle.id] = puzzle;
  return acc;
}, {});

export const getPuzzleById = (puzzleId = defaultPuzzle.id) =>
  puzzleLibrary[puzzleId] || defaultPuzzle;

export const getPuzzleByIndex = (puzzleIndex = 0) =>
  puzzleSequence[puzzleIndex] || defaultPuzzle;

export const getPuzzleCount = () => puzzleSequence.length;
