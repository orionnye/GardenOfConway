import GridContainer from './components/GridContainer';
import GridControls from './components/GridControls';
import PatternPicker from './components/PatternPicker';
import PatternExport from './components/PatternExport';
import ModeToggle from './components/ModeToggle';
import BirthCandidateBanner from './components/BirthCandidateBanner';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-950">
      <header className="fixed top-0 left-0 right-0 z-10 bg-gray-900 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Conway&apos;s Game of Life</h1>
          <ModeToggle />
        </div>
      </header>
      <BirthCandidateBanner />
      <div className="flex-1 relative mt-20">
        <GridContainer />
        <PatternPicker />
        <PatternExport />
      </div>
      <GridControls />
    </main>
  );
}
