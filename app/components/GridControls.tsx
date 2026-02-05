'use client';

import { useSelector, useDispatch } from 'react-redux';
import { 
  getGeneration, 
  getIsRunning, 
  getSpeed,
  getMode,
  stepGrid, 
  toggleRunning, 
  resetGrid, 
  clearGrid,
  setSpeed,
} from '@/lib/state/grid-dux';

export default function GridControls() {
  const dispatch = useDispatch();
  const generation = useSelector(getGeneration);
  const isRunning = useSelector(getIsRunning);
  const speed = useSelector(getSpeed);
  const mode = useSelector(getMode);

  const handleStep = () => dispatch(stepGrid());
  const handlePlayPause = () => dispatch(toggleRunning());
  const handleReset = () => dispatch(resetGrid());
  const handleClear = () => dispatch(clearGrid());
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSpeed({ speed: parseInt(e.target.value, 10) }));
  };
  const handleResetView = () => {
    // Call the global reset function set by GridCanvas
    if ((window as any).__resetGridViewport) {
      (window as any).__resetGridViewport();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        {/* Playback Controls */}
        <button
          onClick={handleStep}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          disabled={isRunning}
          aria-label="Step one generation"
        >
          Step
        </button>

        <button
          onClick={handlePlayPause}
          className={`px-4 py-2 rounded ${
            mode === 'lifeGarden'
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
          disabled={mode === 'lifeGarden'}
          aria-label={isRunning ? 'Pause simulation' : 'Play simulation'}
          title={mode === 'lifeGarden' ? 'Play is disabled in Life Garden mode' : ''}
        >
          {isRunning ? 'Pause' : 'Play'}
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          aria-label="Reset grid"
        >
          Reset
        </button>

        <button
          onClick={handleClear}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
          aria-label="Clear all cells"
        >
          Clear
        </button>

        <button
          onClick={handleResetView}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
          aria-label="Reset viewport zoom and pan"
        >
          Reset View
        </button>

        {/* Speed Control */}
        <div className="flex items-center gap-2 ml-4">
          <label htmlFor="speed-slider" className="text-gray-300 text-sm">
            Speed:
          </label>
          <input
            id="speed-slider"
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={handleSpeedChange}
            className="w-24"
            aria-label="Simulation speed"
          />
          <span className="text-gray-300 text-sm font-mono w-8">{speed}</span>
        </div>

        {/* Generation Counter */}
        <div className="ml-auto text-gray-300">
          Generation: <span className="font-mono font-bold">{generation}</span>
        </div>
      </div>
    </div>
  );
}
