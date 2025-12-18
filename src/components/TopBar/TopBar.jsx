import { Download, Share2 } from "lucide-react";
import useCanvasStore from "../../store/canvasStore";

export default function TopBar() {
  const { toggleExportPanel, showExportPanel } = useCanvasStore();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 flex justify-between items-center px-6 z-50">
      {/* Left - Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <rect
              x="6"
              y="8"
              width="20"
              height="14"
              rx="2"
              stroke="#89D888"
              strokeWidth="2"
            />
            <rect x="4" y="22" width="24" height="2" rx="1" fill="#89D888" />
            <circle cx="22" cy="12" r="3" fill="#89D888" />
            <rect
              x="9"
              y="11"
              width="6"
              height="6"
              rx="1"
              fill="#89D888"
              opacity="0.6"
            />
          </svg>
        </div>
        <span className="text-base font-medium text-text-primary font-display">
          StickerCanvas
        </span>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        <button
          className="
            flex items-center gap-2 px-4 py-2 rounded-md
            text-sm font-medium text-text-secondary
            bg-surface border border-border-medium
            hover:bg-surface-hover hover:text-white
            transition-all duration-fast
          "
          title="Share (Coming soon)"
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>
        <button
          onClick={toggleExportPanel}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md
            text-sm font-semibold
            transition-all duration-fast
            ${
              showExportPanel
                ? "bg-accent-hover text-text-inverse shadow-glow"
                : "bg-accent text-text-inverse hover:bg-accent-hover hover:shadow-glow"
            }
          `}
        >
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}
