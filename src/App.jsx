import TopBar from './components/UI/TopBar';
import ToolRail from './components/ToolRail/ToolRail';
import StickerCanvas from './components/Canvas/StickerCanvas';
import StickerLibrary from './components/Panels/StickerLibrary';
import StickerControls from './components/Panels/StickerControls';
import LaptopSelector from './components/Panels/LaptopSelector';

function App() {
  return (
    <div className="w-full h-screen relative overflow-hidden">
      <TopBar />
      <ToolRail />

      <main className="absolute inset-0 z-0">
        <StickerCanvas />
      </main>

      <div
        className="fixed flex flex-col items-end gap-3 z-30 pointer-events-none"
        style={{ right: '24px', bottom: '24px' }}
      >
        <StickerControls />
        <StickerLibrary />
        <LaptopSelector />
      </div>
    </div>
  );
}

export default App;
