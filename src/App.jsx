import { useEffect, useCallback } from 'react';
import TopBar from './components/TopBar/TopBar';
import ToolRail from './components/ToolRail/ToolRail';
import StickerCanvas from './components/Canvas/StickerCanvas';
import LaptopSelector from './components/Panels/LaptopSelector';
import StickerLibrary from './components/Panels/StickerLibrary';
import StickerControls from './components/Panels/StickerControls';
import ExportPanel from './components/Panels/ExportPanel';
import NotificationStack from './components/Notifications/NotificationStack';
import useCanvasStore from './store/canvasStore';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

function App() {
  const {
    showLaptopSelector,
    showStickerLibrary,
    showExportPanel,
    showStickerControls,
    selectedStickerIds,
    setShowStickerControls,
  } = useCanvasStore();

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  // Show/hide sticker controls based on selection
  useEffect(() => {
    setShowStickerControls(selectedStickerIds.length > 0);
  }, [selectedStickerIds, setShowStickerControls]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Main Canvas */}
      <StickerCanvas />

      {/* Top Bar */}
      <TopBar />

      {/* Tool Rail */}
      <ToolRail />

      {/* Floating Panels */}
      {showLaptopSelector && <LaptopSelector />}
      {showStickerLibrary && <StickerLibrary />}
      {showStickerControls && selectedStickerIds.length > 0 && <StickerControls />}
      {showExportPanel && <ExportPanel />}

      {/* Notifications */}
      <NotificationStack />
    </div>
  );
}

export default App;
