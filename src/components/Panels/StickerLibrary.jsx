import React from 'react';
import { Trash2, Wand2, RotateCcw, Loader2, Plus } from 'lucide-react';
import FloatingPanel from '../UI/FloatingPanel';
import useCanvasStore from '../../store/canvasStore';
import useBackgroundRemoval from '../../hooks/useBackgroundRemoval';

export default function StickerLibrary() {
  const {
    stickerLibrary,
    removeFromLibrary,
    updateLibrarySticker,
    addSticker,
    stickers,
    toggleStickerLibrary,
    addNotification,
  } = useCanvasStore();

  const { processImage, status: bgStatus } = useBackgroundRemoval();

  const handleAddToCanvas = (librarySticker) => {
    const newSticker = {
      id: crypto.randomUUID(),
      libraryId: librarySticker.id,
      src: librarySticker.src,
      originalSrc: librarySticker.originalSrc,
      bgRemoved: librarySticker.bgRemoved,
      left: 200 + Math.random() * 200,
      top: 150 + Math.random() * 150,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      opacity: 1,
      flipX: false,
      flipY: false,
      zIndex: stickers.length,
      locked: false,
    };
    addSticker(newSticker);
    addNotification({
      message: 'Sticker added to canvas',
      type: 'success',
    });
  };

  const handleRemoveBackground = async (sticker) => {
    if (sticker.processing) return;

    updateLibrarySticker(sticker.id, { processing: true });
    addNotification({
      message: 'Removing background...',
      type: 'info',
      duration: 0,
    });

    try {
      const result = await processImage(sticker.originalSrc);
      if (result) {
        const url = URL.createObjectURL(result);
        updateLibrarySticker(sticker.id, {
          src: url,
          bgRemoved: true,
          processing: false,
        });
        addNotification({
          message: 'Background removed successfully',
          type: 'success',
        });
      }
    } catch (error) {
      updateLibrarySticker(sticker.id, { processing: false });
      addNotification({
        message: 'Failed to remove background',
        type: 'error',
      });
    }
  };

  const handleRevertToOriginal = (sticker) => {
    updateLibrarySticker(sticker.id, {
      src: sticker.originalSrc,
      bgRemoved: false,
    });
    addNotification({
      message: 'Reverted to original',
      type: 'info',
    });
  };

  const handleDelete = (sticker) => {
    removeFromLibrary(sticker.id);
    addNotification({
      message: 'Sticker removed from library',
      type: 'info',
    });
  };

  return (
    <FloatingPanel
      title={`Sticker Library (${stickerLibrary.length})`}
      onClose={toggleStickerLibrary}
      position="bottom-right"
      width={320}
    >
      {stickerLibrary.length === 0 ? (
        <div className="text-center py-8 text-text-muted text-sm">
          <p>No stickers yet</p>
          <p className="mt-1">Click the + button to add stickers</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {stickerLibrary.map((sticker) => (
            <div
              key={sticker.id}
              className="group relative aspect-square rounded-md bg-surface border border-border-subtle overflow-hidden"
            >
              {/* Sticker Image */}
              <button
                onClick={() => handleAddToCanvas(sticker)}
                className="w-full h-full p-2 hover:bg-surface-hover transition-colors duration-fast"
                title="Click to add to canvas"
              >
                <img
                  src={sticker.src}
                  alt={sticker.name}
                  className="w-full h-full object-contain"
                />
              </button>

              {/* Processing Overlay */}
              {sticker.processing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 size={20} className="text-accent animate-spin" />
                </div>
              )}

              {/* Add to canvas indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-accent/80 flex items-center justify-center">
                  <Plus size={16} className="text-text-inverse" />
                </div>
              </div>

              {/* Action buttons - shown on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 to-transparent">
                {!sticker.bgRemoved ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveBackground(sticker);
                    }}
                    className="flex-1 p-1 rounded text-xs text-accent hover:bg-accent/20 transition-colors"
                    title="Remove background"
                    disabled={sticker.processing}
                  >
                    <Wand2 size={14} className="mx-auto" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRevertToOriginal(sticker);
                    }}
                    className="flex-1 p-1 rounded text-xs text-text-secondary hover:bg-surface-hover transition-colors"
                    title="Revert to original"
                  >
                    <RotateCcw size={14} className="mx-auto" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(sticker);
                  }}
                  className="flex-1 p-1 rounded text-xs text-red-400 hover:bg-red-400/20 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} className="mx-auto" />
                </button>
              </div>

              {/* BG Removed Badge */}
              {sticker.bgRemoved && !sticker.processing && (
                <div className="absolute top-1 right-1 px-1 py-0.5 rounded text-[10px] bg-accent/20 text-accent">
                  BG
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </FloatingPanel>
  );
}
