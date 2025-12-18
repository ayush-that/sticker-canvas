import { useEffect, useCallback } from 'react';
import useCanvasStore from '../store/canvasStore';

export default function useKeyboardShortcuts() {
  const {
    selectedStickerIds,
    stickers,
    toggleLaptopSelector,
    toggleStickerLibrary,
    toggleGrid,
    toggleSnap,
    toggleExportPanel,
    undo,
    redo,
    randomizeLayout,
    resetCanvas,
    deleteSelected,
    duplicateSticker,
    selectAll,
    clearSelection,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    zoomIn,
    zoomOut,
    resetZoom,
    updateStickerWithHistory,
  } = useCanvasStore();

  const handleKeyDown = useCallback((e) => {
    // Ignore if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

    // Get first selected sticker for single-sticker operations
    const selectedId = selectedStickerIds[0];

    switch (e.key.toLowerCase()) {
      // Add sticker
      case 's':
        if (!ctrlKey) {
          e.preventDefault();
          document.querySelector('input[type="file"]')?.click();
        }
        break;

      // Change laptop
      case 'l':
        if (!ctrlKey) {
          e.preventDefault();
          toggleLaptopSelector();
        }
        break;

      // Randomize
      case 'r':
        if (!ctrlKey) {
          e.preventDefault();
          randomizeLayout();
        } else {
          e.preventDefault();
          resetCanvas();
        }
        break;

      // Toggle snap
      case 'g':
        if (!e.shiftKey) {
          e.preventDefault();
          toggleSnap();
        } else {
          e.preventDefault();
          toggleGrid();
        }
        break;

      // Undo/Redo
      case 'z':
        if (ctrlKey) {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        }
        break;

      // Redo (alternative)
      case 'y':
        if (ctrlKey) {
          e.preventDefault();
          redo();
        }
        break;

      // Delete
      case 'delete':
      case 'backspace':
        if (selectedStickerIds.length > 0) {
          e.preventDefault();
          deleteSelected();
        }
        break;

      // Duplicate
      case 'd':
        if (ctrlKey && selectedId) {
          e.preventDefault();
          duplicateSticker(selectedId);
        }
        break;

      // Select all
      case 'a':
        if (ctrlKey) {
          e.preventDefault();
          selectAll();
        }
        break;

      // Escape - deselect
      case 'escape':
        e.preventDefault();
        clearSelection();
        break;

      // Layer controls
      case '[':
        if (selectedId) {
          e.preventDefault();
          if (e.shiftKey) {
            sendToBack(selectedId);
          } else {
            sendBackward(selectedId);
          }
        }
        break;

      case ']':
        if (selectedId) {
          e.preventDefault();
          if (e.shiftKey) {
            bringToFront(selectedId);
          } else {
            bringForward(selectedId);
          }
        }
        break;

      // Zoom
      case '+':
      case '=':
        e.preventDefault();
        zoomIn();
        break;

      case '-':
        e.preventDefault();
        zoomOut();
        break;

      case '0':
        e.preventDefault();
        resetZoom();
        break;

      // Arrow keys - nudge
      case 'arrowup':
      case 'arrowdown':
      case 'arrowleft':
      case 'arrowright':
        if (selectedId) {
          e.preventDefault();
          const sticker = stickers.find((s) => s.id === selectedId);
          if (sticker && !sticker.locked) {
            const nudge = e.shiftKey ? 10 : 1;
            const updates = {};

            switch (e.key.toLowerCase()) {
              case 'arrowup':
                updates.top = sticker.top - nudge;
                break;
              case 'arrowdown':
                updates.top = sticker.top + nudge;
                break;
              case 'arrowleft':
                updates.left = sticker.left - nudge;
                break;
              case 'arrowright':
                updates.left = sticker.left + nudge;
                break;
            }

            updateStickerWithHistory(selectedId, updates);
          }
        }
        break;

      // Export
      case 'e':
        if (ctrlKey) {
          e.preventDefault();
          toggleExportPanel();
        }
        break;

      default:
        break;
    }
  }, [
    selectedStickerIds,
    stickers,
    toggleLaptopSelector,
    toggleStickerLibrary,
    toggleGrid,
    toggleSnap,
    toggleExportPanel,
    undo,
    redo,
    randomizeLayout,
    resetCanvas,
    deleteSelected,
    duplicateSticker,
    selectAll,
    clearSelection,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    zoomIn,
    zoomOut,
    resetZoom,
    updateStickerWithHistory,
  ]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
