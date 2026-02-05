'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMode, setMode } from '@/lib/state/grid-dux';

const STORAGE_KEY = 'conway-game-mode';

export default function ModeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector(getMode);

  // Load mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem(STORAGE_KEY);
    if (savedMode === 'classic' || savedMode === 'lifeGarden') {
      dispatch(setMode({ mode: savedMode }));
    }
  }, [dispatch]);

  // Save mode to localStorage when it changes
  useEffect(() => {
    if (mode) {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  }, [mode]);

  const handleModeChange = (newMode: 'classic' | 'lifeGarden') => {
    dispatch(setMode({ mode: newMode }));
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-sm mr-2">Mode:</span>
      <button
        onClick={() => handleModeChange('classic')}
        className={`px-4 py-2 rounded transition-colors ${
          mode === 'classic'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        aria-label="Classic mode"
        aria-pressed={mode === 'classic'}
      >
        Classic
      </button>
      <button
        onClick={() => handleModeChange('lifeGarden')}
        className={`px-4 py-2 rounded transition-colors ${
          mode === 'lifeGarden'
            ? 'bg-green-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        aria-label="Life Garden mode"
        aria-pressed={mode === 'lifeGarden'}
      >
        Life Garden
      </button>
    </div>
  );
}
