import { Trash, Copy, MagicWand, ArrowCounterClockwise } from '@phosphor-icons/react';
import useCanvasStore from '../../store/canvasStore';
import clsx from 'clsx';

export default function StickerLibrary() {
  const stickers = useCanvasStore(state => state.stickers);
  const removeSticker = useCanvasStore(state => state.removeSticker);
  const selectedStickerIds = useCanvasStore(state => state.selectedStickerIds);
  const setSelectedStickers = useCanvasStore(state => state.setSelectedStickers);

  if (stickers.length === 0) return null;

  return (
    <div className="w-80 rounded-2xl bg-bg-elevated/85 backdrop-blur-md border border-border-subtle shadow-elevated overflow-hidden flex flex-col max-h-[300px] pointer-events-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <h3 className="text-sm font-medium text-text-secondary">Stickers</h3>
            <span className="text-xs text-text-muted">{stickers.length} items</span>
        </div>
        <div className="p-3 grid grid-cols-4 gap-2 overflow-y-auto">
            {stickers.map(sticker => (
                <div
                    key={sticker.id}
                    className={clsx(
                        "aspect-square rounded-lg bg-white/5 border border-white/5 p-2 relative group cursor-pointer hover:bg-white/10 transition-colors",
                        selectedStickerIds.includes(sticker.id) && "ring-2 ring-accent-primary bg-accent-primary/10"
                    )}
                    onClick={() => setSelectedStickers([sticker.id])}
                >
                    <img src={sticker.src} className="w-full h-full object-contain pointer-events-none" />

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            className="p-1.5 rounded-md hover:bg-white/20 text-white"
                            onClick={(e) => { e.stopPropagation(); removeSticker(sticker.id); }}
                            title="Delete"
                        >
                            <Trash size={14} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
