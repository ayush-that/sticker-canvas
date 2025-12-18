import { Share, DownloadSimple, Sticker } from '@phosphor-icons/react';
import useCanvasStore from '../../store/canvasStore';

export default function TopBar() {
  const triggerExport = useCanvasStore(state => state.triggerExport); // We need a way to trigger export from here but execute in Canvas component

  // A better way is to put the export logic in the store or have a shared ref, or use an event bus.
  // Since we already have the ref in StickerCanvas, we can expose a function or use a custom event.
  // Let's use a custom event for simplicity "sticker-canvas:export"

  const handleExportClick = () => {
      window.dispatchEvent(new CustomEvent('sticker-canvas:export'));
  };

  return (
    <header className="top-bar fixed top-0 left-0 right-0 h-14 flex justify-between items-center px-6 bg-transparent z-50 pointer-events-none">
      <div className="top-left flex items-center gap-3 pointer-events-auto">
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-black font-bold">
            <Sticker weight="fill" size={20} />
        </div>
        <span className="app-title text-base font-medium text-text-primary">StickerCanvas</span>
      </div>
      <div className="top-right flex gap-2 pointer-events-auto">
        <button className="share-btn flex items-center gap-1.5 px-4 py-2 rounded-lg bg-bg-surface border border-border-subtle text-text-secondary font-medium text-sm hover:bg-bg-surface-hover hover:text-white transition-all">
          <Share size={16} />
          <span>Share</span>
        </button>
        <button
          className="export-btn flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-primary text-text-inverse font-semibold text-sm border-none cursor-pointer hover:bg-accent-primary-hover hover:shadow-glow transition-all"
          onClick={handleExportClick}
        >
          <DownloadSimple size={16} weight="bold" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}
