// Core types for the Conway's Game of Life engine

export interface Cell {
  x: number;
  y: number;
}

export interface Bounds {
  width: number;
  height: number;
}

export interface GridState {
  cells: Cell[];
  bounds: Bounds;
  generation: number;
}
