import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';

export function useExport(fabricCanvasRef) {

  const handleExport = (format = 'png', quality = 0.8) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Deselect everything first
    canvas.discardActiveObject();
    canvas.requestRenderAll();

    // Convert to Data URL
    // We can use fabric's toDataURL with multiplier for quality
    // Note: fabric.js export handles all objects on canvas including the laptop image if it's an object.

    try {
        const dataURL = canvas.toDataURL({
            format: format,
            quality: quality,
            multiplier: quality > 1 ? quality : 2, // High quality export by default (2x)
            enableRetinaScaling: true
        });

        // Convert to blob and download
        // Or just download dataURL
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `stickercanvas-${timestamp}.${format}`;

        // Helper to download
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (e) {
        console.error("Export failed", e);
    }
  };

  return {
    handleExport
  };
}
