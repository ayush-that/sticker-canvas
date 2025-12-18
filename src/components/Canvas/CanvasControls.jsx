import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import useCanvasStore from "../../store/canvasStore";

export default function CanvasControls() {
  const { zoom, zoomIn, zoomOut, resetZoom } = useCanvasStore();

  const zoomPercentage = Math.round(zoom * 100);

  return (
    <div
      className="
        fixed bottom-6 right-6 z-30
        flex items-center gap-1 p-1.5
        rounded-lg glass-surface
      "
    >
      <button
        onClick={zoomOut}
        disabled={zoom <= 0.25}
        className="
          w-8 h-8 rounded-md
          flex items-center justify-center
          text-text-secondary hover:text-white hover:bg-surface-hover
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-fast
        "
        title="Zoom Out (-)"
        aria-label="Zoom Out"
      >
        <ZoomOut size={16} />
      </button>

      <button
        onClick={resetZoom}
        className="
          px-2 h-8 rounded-md min-w-[50px]
          flex items-center justify-center
          text-sm text-text-muted hover:text-white hover:bg-surface-hover
          font-mono
          transition-colors duration-fast
        "
        title="Reset Zoom (0)"
        aria-label="Reset Zoom"
      >
        {zoomPercentage}%
      </button>

      <button
        onClick={zoomIn}
        disabled={zoom >= 4}
        className="
          w-8 h-8 rounded-md
          flex items-center justify-center
          text-text-secondary hover:text-white hover:bg-surface-hover
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-fast
        "
        title="Zoom In (+)"
        aria-label="Zoom In"
      >
        <ZoomIn size={16} />
      </button>

      <div className="w-px h-5 bg-border-medium mx-1" />

      <button
        onClick={resetZoom}
        className="
          w-8 h-8 rounded-md
          flex items-center justify-center
          text-text-secondary hover:text-white hover:bg-surface-hover
          transition-colors duration-fast
        "
        title="Fit to Screen (Ctrl+0)"
        aria-label="Fit to Screen"
      >
        <Maximize2 size={16} />
      </button>
    </div>
  );
}
