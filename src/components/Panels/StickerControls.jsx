import { Trash, Copy, Lock, LockOpen, Stack, ArrowUUpLeft, ArrowsOutSimple, MagicWand } from '@phosphor-icons/react';
import useCanvasStore from '../../store/canvasStore';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useBackgroundRemoval } from '../../hooks/useBackgroundRemoval';

export default function StickerControls() {
  const selectedStickerIds = useCanvasStore(state => state.selectedStickerIds);
  const stickers = useCanvasStore(state => state.stickers);
  const updateSticker = useCanvasStore(state => state.updateSticker);
  const removeSticker = useCanvasStore(state => state.removeSticker);

  const [activeSticker, setActiveSticker] = useState(null);

  const { processImage, status, progress } = useBackgroundRemoval();

  useEffect(() => {
    if (selectedStickerIds.length === 1) {
        const s = stickers.find(s => s.id === selectedStickerIds[0]);
        setActiveSticker(s);
    } else {
        setActiveSticker(null);
    }
  }, [selectedStickerIds, stickers]);

  const handleRemoveBackground = async () => {
      if (!activeSticker) return;
      try {
          const resultBlob = await processImage(activeSticker.originalSrc || activeSticker.src);
          const newUrl = URL.createObjectURL(resultBlob);
          updateSticker(activeSticker.id, {
              src: newUrl,
              bgRemoved: true
          });
      } catch (e) {
          console.error("Failed to remove bg", e);
      }
  };

  if (!activeSticker) return null;

  return (
    <div className="w-64 rounded-xl bg-bg-elevated/90 backdrop-blur-md border border-border-subtle shadow-elevated p-3 pointer-events-auto flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-text-muted uppercase tracking-wider font-medium">
            <span>Sticker Properties</span>
            <div className="flex gap-1">
                <button className="p-1 hover:text-white transition-colors" title="Duplicate">
                    <Copy size={14} />
                </button>
                <button
                    className="p-1 hover:text-red-400 transition-colors"
                    title="Delete"
                    onClick={() => removeSticker(activeSticker.id)}
                >
                    <Trash size={14} />
                </button>
            </div>
        </div>

        <button
            className={clsx(
                "flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all",
                activeSticker.bgRemoved ? "bg-white/5 text-text-muted" : "bg-accent-primary text-text-inverse hover:bg-accent-primary-hover",
                status === 'loading' || status === 'processing' ? "opacity-70 cursor-wait" : ""
            )}
            onClick={handleRemoveBackground}
            disabled={status === 'loading' || status === 'processing'}
        >
            <MagicWand size={16} weight="fill" />
            {status === 'processing' ? `Processing ${progress}%` : (activeSticker.bgRemoved ? "Background Removed" : "Remove Background")}
        </button>

        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-text-secondary">
                    <span>Opacity</span>
                    <span>{Math.round((activeSticker.opacity || 1) * 100)}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={(activeSticker.opacity || 1) * 100}
                    onChange={(e) => updateSticker(activeSticker.id, { opacity: parseInt(e.target.value) / 100 })}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-primary"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-text-secondary">
                    <span>Scale</span>
                    <span>{Math.round((activeSticker.scaleX || 0.5) * 100)}%</span>
                </div>
                <input
                    type="range"
                    min="10"
                    max="200"
                    value={(activeSticker.scaleX || 0.5) * 100}
                    onChange={(e) => updateSticker(activeSticker.id, { scaleX: parseInt(e.target.value) / 100, scaleY: parseInt(e.target.value) / 100 })}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-primary"
                />
            </div>

             <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-text-secondary">
                    <span>Rotation</span>
                    <span>{Math.round(activeSticker.angle || 0)}°</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="360"
                    value={activeSticker.angle || 0}
                    onChange={(e) => updateSticker(activeSticker.id, { angle: parseInt(e.target.value) })}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-primary"
                />
            </div>
        </div>

         <div className="grid grid-cols-2 gap-2 mt-1">
             <button className="flex items-center justify-center gap-2 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs text-text-secondary transition-colors">
                 <Stack size={14} />
                 To Front
             </button>
             <button className="flex items-center justify-center gap-2 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs text-text-secondary transition-colors">
                 <Stack size={14} />
                 To Back
             </button>
         </div>
    </div>
  );
}
