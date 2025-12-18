import {
  Trash2,
  Copy,
  FlipHorizontal2,
  FlipVertical2,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
} from "lucide-react";
import FloatingPanel from "../UI/FloatingPanel";
import Slider from "../UI/Slider";
import useCanvasStore from "../../store/canvasStore";

export default function StickerControls() {
  const {
    stickers,
    selectedStickerIds,
    updateStickerWithHistory,
    duplicateSticker,
    removeSticker,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    setShowStickerControls,
  } = useCanvasStore();

  const selectedSticker = stickers.find((s) =>
    selectedStickerIds.includes(s.id),
  );

  if (!selectedSticker) return null;

  const handleScaleChange = (value) => {
    const scale = value / 100;
    updateStickerWithHistory(selectedSticker.id, {
      scaleX: scale,
      scaleY: scale,
    });
  };

  const handleRotationChange = (value) => {
    updateStickerWithHistory(selectedSticker.id, { angle: value });
  };

  const handleOpacityChange = (value) => {
    updateStickerWithHistory(selectedSticker.id, { opacity: value / 100 });
  };

  const handleFlipX = () => {
    updateStickerWithHistory(selectedSticker.id, {
      flipX: !selectedSticker.flipX,
    });
  };

  const handleFlipY = () => {
    updateStickerWithHistory(selectedSticker.id, {
      flipY: !selectedSticker.flipY,
    });
  };

  const handleToggleLock = () => {
    updateStickerWithHistory(selectedSticker.id, {
      locked: !selectedSticker.locked,
    });
  };

  const currentScale = Math.round(
    (((selectedSticker.scaleX || 1) + (selectedSticker.scaleY || 1)) / 2) * 100,
  );

  return (
    <FloatingPanel
      title="Sticker Controls"
      onClose={() => setShowStickerControls(false)}
      position="top-right"
      width={280}
    >
      <div className="space-y-4">
        {/* Scale */}
        <Slider
          label="Scale"
          value={currentScale}
          onChange={handleScaleChange}
          min={10}
          max={500}
          unit="%"
        />

        {/* Rotation */}
        <Slider
          label="Rotation"
          value={selectedSticker.angle || 0}
          onChange={handleRotationChange}
          min={0}
          max={360}
          unit="°"
        />

        {/* Opacity */}
        <Slider
          label="Opacity"
          value={(selectedSticker.opacity || 1) * 100}
          onChange={handleOpacityChange}
          min={0}
          max={100}
          unit="%"
        />

        {/* Flip Controls */}
        <div className="flex gap-2">
          <button
            onClick={handleFlipX}
            className={`
              flex-1 flex items-center justify-center gap-2 p-2 rounded-md
              text-sm border transition-colors duration-fast
              ${
                selectedSticker.flipX
                  ? "border-accent text-accent bg-accent/10"
                  : "border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-white"
              }
            `}
          >
            <FlipHorizontal2 size={16} />
            <span>Flip H</span>
          </button>
          <button
            onClick={handleFlipY}
            className={`
              flex-1 flex items-center justify-center gap-2 p-2 rounded-md
              text-sm border transition-colors duration-fast
              ${
                selectedSticker.flipY
                  ? "border-accent text-accent bg-accent/10"
                  : "border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-white"
              }
            `}
          >
            <FlipVertical2 size={16} />
            <span>Flip V</span>
          </button>
        </div>

        {/* Layer Controls */}
        <div className="space-y-2">
          <span className="text-sm text-text-secondary">Layer Order</span>
          <div className="flex gap-1">
            <button
              onClick={() => sendToBack(selectedSticker.id)}
              className="flex-1 p-2 rounded-md border border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-white transition-colors"
              title="Send to Back"
            >
              <ChevronsDown size={16} className="mx-auto" />
            </button>
            <button
              onClick={() => sendBackward(selectedSticker.id)}
              className="flex-1 p-2 rounded-md border border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-white transition-colors"
              title="Send Backward"
            >
              <ChevronDown size={16} className="mx-auto" />
            </button>
            <button
              onClick={() => bringForward(selectedSticker.id)}
              className="flex-1 p-2 rounded-md border border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-white transition-colors"
              title="Bring Forward"
            >
              <ChevronUp size={16} className="mx-auto" />
            </button>
            <button
              onClick={() => bringToFront(selectedSticker.id)}
              className="flex-1 p-2 rounded-md border border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-white transition-colors"
              title="Bring to Front"
            >
              <ChevronsUp size={16} className="mx-auto" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-border-subtle">
          <button
            onClick={handleToggleLock}
            className={`
              flex-1 flex items-center justify-center gap-2 p-2 rounded-md
              text-sm transition-colors duration-fast
              ${
                selectedSticker.locked
                  ? "bg-accent/20 text-accent"
                  : "bg-surface text-text-secondary hover:bg-surface-hover hover:text-white"
              }
            `}
          >
            {selectedSticker.locked ? <Lock size={16} /> : <Unlock size={16} />}
            <span>{selectedSticker.locked ? "Locked" : "Lock"}</span>
          </button>
          <button
            onClick={() => duplicateSticker(selectedSticker.id)}
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-md bg-surface text-text-secondary hover:bg-surface-hover hover:text-white text-sm transition-colors"
          >
            <Copy size={16} />
            <span>Duplicate</span>
          </button>
          <button
            onClick={() => removeSticker(selectedSticker.id)}
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm transition-colors"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </FloatingPanel>
  );
}
