'use client';

import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  getCells, 
  getBounds, 
  setCells, 
  getBirthCandidates, 
  getMode,
  getGoalTiles,
  getObstacles,
  getRunState,
  applyPlayerBirth,
} from '@/lib/state/grid-dux';
import GridCanvas from './GridCanvas';

interface Cell {
  x: number;
  y: number;
}

export default function GridContainer() {
  const dispatch = useDispatch();
  const cells = useSelector(getCells);
  const bounds = useSelector(getBounds);
  const birthCandidates = useSelector(getBirthCandidates);
  const mode = useSelector(getMode);
  const goalTiles = useSelector(getGoalTiles);
  const obstacles = useSelector(getObstacles);
  const runState = useSelector(getRunState);

  const handleCellClick = useCallback((cell: Cell, isAlive: boolean) => {
    let newCells: Cell[];
    
    if (isAlive) {
      // Remove cell (erase)
      newCells = cells.filter(c => !(c.x === cell.x && c.y === cell.y));
    } else {
      // Add cell (paint)
      newCells = [...cells, cell];
    }
    
    dispatch(setCells({ cells: newCells }));
  }, [cells, dispatch]);

  const handleDragPaint = useCallback((draggedCells: Cell[], mode: 'draw' | 'erase') => {
    let newCells = [...cells];
    
    if (mode === 'draw') {
      // Add cells that don't already exist
      draggedCells.forEach(cell => {
        const exists = newCells.some(c => c.x === cell.x && c.y === cell.y);
        if (!exists) {
          newCells.push(cell);
        }
      });
    } else {
      // Remove cells
      const cellsToRemove = new Set(draggedCells.map(c => `${c.x},${c.y}`));
      newCells = newCells.filter(c => !cellsToRemove.has(`${c.x},${c.y}`));
    }
    
    dispatch(setCells({ cells: newCells }));
  }, [cells, dispatch]);

  const handleBirthCandidateClick = useCallback((cell: Cell) => {
    if (runState === 'won') {
      return;
    }
    dispatch(applyPlayerBirth({ cell }));
  }, [dispatch, runState]);

  return (
    <GridCanvas 
      cells={cells} 
      bounds={bounds}
      birthCandidates={birthCandidates}
      goalTiles={goalTiles}
      obstacles={obstacles}
      mode={mode}
      runState={runState}
      onCellClick={handleCellClick}
      onDragPaint={handleDragPaint}
      onBirthCandidateClick={handleBirthCandidateClick}
    />
  );
}
