import GridContainer from './components/GridContainer';
import GridControls from './components/GridControls';
import PatternPicker from './components/PatternPicker';
import PatternExport from './components/PatternExport';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-950">
      <div className="flex-1 relative">
        <GridContainer />
        <PatternPicker />
        <PatternExport />
      </div>
      <GridControls />
    </main>
  );
}
