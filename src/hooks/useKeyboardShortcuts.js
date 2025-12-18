import { useEffect, useCallback } from "react";
import useCanvasStore from "../store/canvasStore";

export default function useKeyboardShortcuts() {
  const {
    selectedStickerIds,
    stickers,
    toggleLaptopSelector,
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

  const handleKeyDown = useCallback(
    (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;
      const selectedId = selectedStickerIds[0];

      switch (e.key.toLowerCase()) {
        case "s":
          if (!ctrlKey) {
            e.preventDefault();
            document.querySelector('input[type="file"]')?.click();
          }
          break;

        case "l":
          if (!ctrlKey) {
            e.preventDefault();
            toggleLaptopSelector();
          }
          break;

        case "r":
          if (!ctrlKey) {
            e.preventDefault();
            randomizeLayout();
          } else {
            e.preventDefault();
            resetCanvas();
          }
          break;

        case "g":
          if (!e.shiftKey) {
            e.preventDefault();
            toggleSnap();
          } else {
            e.preventDefault();
            toggleGrid();
          }
          break;

        case "z":
          if (ctrlKey) {
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
          }
          break;

        case "y":
          if (ctrlKey) {
            e.preventDefault();
            redo();
          }
          break;

        case "delete":
        case "backspace":
          if (selectedStickerIds.length > 0) {
            e.preventDefault();
            deleteSelected();
          }
          break;

        case "d":
          if (ctrlKey && selectedId) {
            e.preventDefault();
            duplicateSticker(selectedId);
          }
          break;

        case "a":
          if (ctrlKey) {
            e.preventDefault();
            selectAll();
          }
          break;

        case "escape":
          e.preventDefault();
          clearSelection();
          break;

        case "[":
          if (selectedId) {
            e.preventDefault();
            if (e.shiftKey) {
              sendToBack(selectedId);
            } else {
              sendBackward(selectedId);
            }
          }
          break;

        case "]":
          if (selectedId) {
            e.preventDefault();
            if (e.shiftKey) {
              bringToFront(selectedId);
            } else {
              bringForward(selectedId);
            }
          }
          break;

        case "+":
        case "=":
          e.preventDefault();
          zoomIn();
          break;

        case "-":
          e.preventDefault();
          zoomOut();
          break;

        case "0":
          e.preventDefault();
          resetZoom();
          break;

        case "arrowup":
        case "arrowdown":
        case "arrowleft":
        case "arrowright":
          if (selectedId) {
            e.preventDefault();
            const sticker = stickers.find((s) => s.id === selectedId);
            if (sticker && !sticker.locked) {
              const nudge = e.shiftKey ? 10 : 1;
              const updates = {};

              switch (e.key.toLowerCase()) {
                case "arrowup":
                  updates.top = sticker.top - nudge;
                  break;
                case "arrowdown":
                  updates.top = sticker.top + nudge;
                  break;
                case "arrowleft":
                  updates.left = sticker.left - nudge;
                  break;
                case "arrowright":
                  updates.left = sticker.left + nudge;
                  break;
              }

              updateStickerWithHistory(selectedId, updates);
            }
          }
          break;

        case "e":
          if (ctrlKey) {
            e.preventDefault();
            toggleExportPanel();
          }
          break;

        default:
          break;
      }
    },
    [
      selectedStickerIds,
      stickers,
      toggleLaptopSelector,
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
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
