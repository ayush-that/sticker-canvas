import React, { useState } from 'react';
import { Download, Image, FileImage, Loader2 } from 'lucide-react';
import FloatingPanel from '../UI/FloatingPanel';
import useCanvasStore from '../../store/canvasStore';

const FORMAT_OPTIONS = [
  { id: 'png', label: 'PNG', icon: Image, description: 'Best quality, supports transparency' },
  { id: 'jpeg', label: 'JPEG', icon: FileImage, description: 'Smaller file size' },
  { id: 'webp', label: 'WebP', icon: FileImage, description: 'Modern format, good compression' },
];

const QUALITY_OPTIONS = [
  { id: '1x', label: '1x', multiplier: 1, description: 'Standard quality' },
  { id: '2x', label: '2x', multiplier: 2, description: 'High quality' },
  { id: '4x', label: '4x', multiplier: 4, description: 'Ultra high quality' },
];

export default function ExportPanel() {
  const { toggleExportPanel, addNotification } = useCanvasStore();
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState('2x');
  const [includeBackground, setIncludeBackground] = useState(true);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    addNotification({
      message: 'Preparing export...',
      type: 'info',
    });

    try {
      // Get the canvas element
      const canvasElement = document.querySelector('#sticker-canvas canvas');
      if (!canvasElement) {
        throw new Error('Canvas not found');
      }

      // Get the fabric canvas instance from window
      const fabricCanvas = window.__fabricCanvas;
      if (!fabricCanvas) {
        throw new Error('Canvas instance not found');
      }

      const multiplier = QUALITY_OPTIONS.find(q => q.id === quality)?.multiplier || 2;

      // Export the canvas
      const dataURL = fabricCanvas.toDataURL({
        format: format === 'jpeg' ? 'jpeg' : 'png',
        quality: format === 'jpeg' ? 0.9 : 1,
        multiplier,
      });

      // Create download link
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 10);
      link.download = `my-laptop-stickers-${timestamp}.${format}`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addNotification({
        message: 'Export successful!',
        type: 'success',
      });
      toggleExportPanel();
    } catch (error) {
      console.error('Export failed:', error);
      addNotification({
        message: 'Export failed. Please try again.',
        type: 'error',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <FloatingPanel
      title="Export Canvas"
      onClose={toggleExportPanel}
      position="top-right"
      width={320}
    >
      <div className="space-y-4">
        {/* Format Selection */}
        <div className="space-y-2">
          <span className="text-sm text-text-secondary">Format</span>
          <div className="flex gap-2">
            {FORMAT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setFormat(option.id)}
                className={`
                  flex-1 p-3 rounded-md text-center
                  border transition-colors duration-fast
                  ${format === option.id
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-white'
                  }
                `}
              >
                <option.icon size={20} className="mx-auto mb-1" />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quality Selection */}
        <div className="space-y-2">
          <span className="text-sm text-text-secondary">Quality</span>
          <div className="flex gap-2">
            {QUALITY_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setQuality(option.id)}
                className={`
                  flex-1 p-2 rounded-md text-center
                  border transition-colors duration-fast
                  ${quality === option.id
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-white'
                  }
                `}
              >
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-text-muted block mt-0.5">
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Background Toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeBackground}
            onChange={(e) => setIncludeBackground(e.target.checked)}
            className="
              w-4 h-4 rounded border-border-medium
              bg-surface checked:bg-accent
              focus:ring-accent focus:ring-offset-0
            "
          />
          <span className="text-sm text-text-secondary">
            Include canvas background
          </span>
        </label>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="
            w-full flex items-center justify-center gap-2 p-3 rounded-md
            bg-accent text-text-inverse font-semibold
            hover:bg-accent-hover hover:shadow-glow
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-fast
          "
        >
          {exporting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download size={18} />
              <span>Download {format.toUpperCase()}</span>
            </>
          )}
        </button>
      </div>
    </FloatingPanel>
  );
}
